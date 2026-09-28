-- The role-management write path: one command table, command_batch, plus the functions
-- that apply and check each change.
-- Metabase's own DB connection only ever needs INSERT on the table -- the actual
-- privileged DDL runs inside SECURITY DEFINER trigger functions, owned by the bootstrap
-- superuser (fine for this local demo stack; a real deployment should own these functions
-- with a narrower, dedicated role instead of the superuser).
--
-- The trigger runs every change in the same transaction as the insert and checks each one, so
-- a batch either fully applies or changes nothing, and the row records which (see below).

-- Every role this app manages starts with imp_fn_rl_ (a functional role) or
-- imp_pr_rl_ (a person role): imp = impersonation, fn = functional, pr = person,
-- rl = role. The apply_* functions below call this first, so the app can't create,
-- drop, grant to, or add members to any other role (superusers, pg_* roles,
-- metabase_reader, and so on).
--
-- The length check matters: Postgres silently cuts identifiers longer than 63 bytes,
-- so a too-long name would create a role with a different name than the one asked for.
create or replace function fine_grained_access.require_managed_role(role_name text) returns void
language plpgsql as $$
begin
  -- A missing name would make the checks below evaluate to NULL and pass.
  if role_name is null then
    raise exception 'a role name is required';
  end if;
  if role_name !~ '^imp_(fn|pr)_rl_[a-z][a-z0-9_]*$' then
    raise exception 'role name must start with imp_fn_rl_ (functional) or imp_pr_rl_ (person), followed by lowercase letters, numbers, and underscores: %', role_name;
  end if;
  if octet_length(role_name) > 63 then
    raise exception 'role name is % characters; the limit is 63: %', octet_length(role_name), role_name;
  end if;
end;
$$;

-- ===== Batches: the whole queue in one row, applied and checked in one transaction =====
--
-- The app sends everything a person queued as one row. A trigger applies each change in
-- order, checks in the system catalog that it took effect, and writes the outcome back into
-- the same row. Everything happens in one transaction, so a batch either fully applies or
-- changes nothing, and a row always exists to say which:
--   status = 'applied'  every change ran and was verified
--   status = 'failed'   nothing was changed; error_message says why, and results says
--                       which change failed and which had run before it (all rolled back)
-- If the whole request never reaches the database, there is no row and nothing happened.
--
-- `changes` is a JSON array, kept as text so any client can send it:
--   {"kind":"grant","role":"imp_fn_rl_x","schema":"staging","table":"orders","grant":true}
--       (table "*" means every table in the schema, plus USAGE on the schema)
--   {"kind":"membership","member":"imp_pr_rl_a","role":"imp_fn_rl_x","add":true}
--   {"kind":"createRole","role":"imp_pr_rl_a","roleKind":"person"}   (or "functional")
--   {"kind":"dropRole","role":"imp_pr_rl_a"}
-- `status`, `results`, and `error_message` are always set by the trigger, whatever a client sends.

-- Does the role hold SELECT on the table itself, as its own entry and not inherited?
create or replace function fine_grained_access.holds_select(p_role text, p_schema text, p_table text)
returns boolean
language sql stable as $$
  select exists (
    select 1
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    cross join lateral aclexplode(coalesce(c.relacl, acldefault('r', c.relowner))) a
    where n.nspname = p_schema
      and c.relname = p_table
      and a.privilege_type = 'SELECT'
      and a.grantee = (select oid from pg_roles where rolname = p_role)
  )
$$;

-- Each apply_* function runs one change, checks that it took effect (raising if not),
-- and returns the SQL it ran.

create or replace function fine_grained_access.apply_grant(
  p_role text, p_schema text, p_table text, p_grant boolean
) returns text[]
language plpgsql as $$
declare
  statements text[];
  statement text;
  found_table text;
begin
  if p_schema is null or p_table is null or p_grant is null then
    raise exception 'a grant change needs role, schema, table, and grant';
  end if;
  perform fine_grained_access.require_managed_role(p_role);
  -- This schema holds the app's own plumbing. No managed role may ever get access to it.
  if p_schema = 'fine_grained_access' then
    raise exception 'the fine_grained_access schema cannot be granted to any role';
  end if;
  if not exists (select 1 from pg_namespace where nspname = p_schema) then
    raise exception 'schema % does not exist', p_schema;
  end if;

  if p_table = '*' then
    if p_grant then
      statements := array[
        format('grant usage on schema %I to %I', p_schema, p_role),
        format('grant select on all tables in schema %I to %I', p_schema, p_role)];
    else
      statements := array[
        format('revoke select on all tables in schema %I from %I', p_schema, p_role),
        format('revoke usage on schema %I from %I', p_schema, p_role)];
    end if;
  elsif p_grant then
    -- A table is only reachable with USAGE on its schema, so grant that too.
    statements := array[
      format('grant usage on schema %I to %I', p_schema, p_role),
      format('grant select on %I.%I to %I', p_schema, p_table, p_role)];
  else
    statements := array[format('revoke select on %I.%I from %I', p_schema, p_table, p_role)];
  end if;

  foreach statement in array statements loop
    execute statement;
  end loop;

  -- Check it took effect, on every table the change covers.
  for found_table in
    select c.relname
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = p_schema
      and c.relkind in ('r', 'p')
      and (p_table = '*' or c.relname = p_table)
  loop
    if fine_grained_access.holds_select(p_role, p_schema, found_table) is distinct from p_grant then
      raise exception 'check failed: % should % SELECT on %.%',
        p_role, case when p_grant then 'have' else 'not have' end, p_schema, found_table;
    end if;
  end loop;
  return statements;
end;
$$;

create or replace function fine_grained_access.apply_membership(
  p_member text, p_role text, p_add boolean
) returns text[]
language plpgsql as $$
declare
  statement text;
begin
  if p_add is null then
    raise exception 'a membership change needs member, role, and add';
  end if;
  perform fine_grained_access.require_managed_role(p_member);
  perform fine_grained_access.require_managed_role(p_role);

  statement := case when p_add
    then format('grant %I to %I', p_role, p_member)
    else format('revoke %I from %I', p_role, p_member) end;
  execute statement;

  if exists (
    select 1
    from pg_auth_members m
    join pg_roles granted on granted.oid = m.roleid
    join pg_roles member on member.oid = m.member
    where granted.rolname = p_role and member.rolname = p_member
  ) is distinct from p_add then
    raise exception 'check failed: % should % a member of %',
      p_member, case when p_add then 'be' else 'not be' end, p_role;
  end if;
  return array[statement];
end;
$$;

-- p_action is create_person, create_functional, or drop.
create or replace function fine_grained_access.apply_role(p_role text, p_action text)
returns text[]
language plpgsql as $$
declare
  statements text[];
  statement text;
begin
  perform fine_grained_access.require_managed_role(p_role);

  if p_action = 'create_person' then
    if p_role not like 'imp\_pr\_rl\_%' then
      raise exception 'a person role must start with imp_pr_rl_: %', p_role;
    end if;
    -- Metabase impersonates a person with SET ROLE, so the role the app connects
    -- as (session_user) must be allowed to switch to it, without inheriting it.
    statements := array[
      format('create role %I nologin', p_role),
      format('grant %I to %I with inherit false, set true', p_role, session_user)];
  elsif p_action = 'create_functional' then
    if p_role not like 'imp\_fn\_rl\_%' then
      raise exception 'a functional role must start with imp_fn_rl_: %', p_role;
    end if;
    statements := array[format('create role %I nologin', p_role)];
  elsif p_action = 'drop' then
    -- Refuse if the role owns anything: DROP OWNED would delete those objects.
    if exists (select 1 from pg_class c join pg_roles r on r.oid = c.relowner
               where r.rolname = p_role) then
      raise exception 'role % owns database objects and cannot be dropped here', p_role;
    end if;
    -- Revoke every privilege the role holds, then drop it. Its memberships go with it.
    -- Drop the role's row policies one by one first, so each one is in the record. (drop owned
    -- would remove them too, but silently.) Only policies this app created, and only ones that
    -- name this role alone: the app never makes a policy for several roles.
    statements := array(
      select format('drop policy %I on %I.%I', pol.polname, n.nspname, c.relname)
      from pg_policy pol
      join pg_class c on c.oid = pol.polrelid
      join pg_namespace n on n.oid = c.relnamespace
      where pol.polname like 'imp\_rls\_%'
        and pol.polroles = array[(select oid from pg_roles where rolname = p_role)]
      order by n.nspname, c.relname, pol.polname);
    statements := statements || array[
      format('drop owned by %I', p_role),
      format('drop role %I', p_role)];
  else
    raise exception 'unknown role action: %', p_action;
  end if;

  foreach statement in array statements loop
    execute statement;
  end loop;

  if exists (select 1 from pg_roles where rolname = p_role) is distinct from (p_action <> 'drop') then
    raise exception 'check failed: role % should % exist', p_role,
      case when p_action = 'drop' then 'no longer' else 'now' end;
  end if;
  if p_action = 'create_person' and not pg_has_role(session_user, p_role, 'SET') then
    raise exception 'check failed: % cannot switch to %', session_user, p_role;
  end if;
  return statements;
end;
$$;

create table fine_grained_access.command_batch (
  id bigserial primary key,
  changes text not null,
  status text,
  results text,
  error_message text,
  requested_at timestamptz not null default now()
);

create or replace function fine_grained_access.apply_batch_command() returns trigger
language plpgsql security definer as $$
declare
  queue jsonb;
  change jsonb;
  position_in_queue int := 0;
  statements text[];
  outcomes jsonb := '[]';
  policies_before jsonb;
  policies_gone jsonb;
begin
  -- Everything in this block is one unit. If any change fails or fails its check, the
  -- exception handler below runs after the block's database changes were undone.
  begin
    queue := new.changes::jsonb;
    if jsonb_typeof(queue) <> 'array' or jsonb_array_length(queue) = 0 then
      raise exception 'changes must be a JSON array with at least one change';
    end if;

    for change in select value from jsonb_array_elements(queue) loop
      position_in_queue := position_in_queue + 1;
      -- Remember the row policies, so the record can say which ones this change removed.
      policies_before := fine_grained_access.policy_snapshot();
      if change->>'kind' = 'grant' then
        statements := fine_grained_access.apply_grant(
          change->>'role', change->>'schema', change->>'table', (change->>'grant')::boolean);
      elsif change->>'kind' = 'membership' then
        statements := fine_grained_access.apply_membership(
          change->>'member', change->>'role', (change->>'add')::boolean);
      elsif change->>'kind' = 'createRole' then
        statements := fine_grained_access.apply_role(
          change->>'role',
          case change->>'roleKind' when 'person' then 'create_person'
                                   when 'functional' then 'create_functional' end);
      elsif change->>'kind' = 'dropRole' then
        statements := fine_grained_access.apply_role(change->>'role', 'drop');
      elsif change->>'kind' = 'enableRls' then
        statements := fine_grained_access.apply_rls(change->>'schema', change->>'table', true);
      elsif change->>'kind' = 'disableRls' then
        statements := fine_grained_access.apply_rls(change->>'schema', change->>'table', false);
      elsif change->>'kind' = 'createRowPolicy' then
        statements := fine_grained_access.apply_row_policy_create(
          change->>'role', change->>'schema', change->>'table', change->>'column', change->'values');
      elsif change->>'kind' = 'dropRowPolicy' then
        statements := fine_grained_access.apply_row_policy_drop(
          change->>'schema', change->>'table', change->>'policy');
      else
        raise exception 'unknown change kind: %', change->>'kind';
      end if;
      policies_gone := fine_grained_access.policies_missing(policies_before);
      outcomes := outcomes || jsonb_build_array(
        jsonb_build_object(
          'index', position_in_queue, 'change', change, 'status', 'applied', 'sql', to_jsonb(statements))
        || case when jsonb_array_length(policies_gone) > 0
                then jsonb_build_object('removedPolicies', policies_gone) else '{}'::jsonb end);
    end loop;

    -- Access may have been taken away above. Remove the row policies of any role that no
    -- longer has a use for them, and record it as its own step.
    policies_before := fine_grained_access.policy_snapshot();
    statements := fine_grained_access.prune_orphan_policies();
    if coalesce(array_length(statements, 1), 0) > 0 then
      policies_gone := fine_grained_access.policies_missing(policies_before);
      outcomes := outcomes || jsonb_build_array(
        jsonb_build_object(
          'index', position_in_queue + 1,
          'change', jsonb_build_object('kind', 'pruneOrphanPolicies'),
          'status', 'applied', 'sql', to_jsonb(statements))
        || case when jsonb_array_length(policies_gone) > 0
                then jsonb_build_object('removedPolicies', policies_gone) else '{}'::jsonb end);
    end if;

    -- A role can end up with USAGE on a schema but SELECT on none of its tables (revoking
    -- every table one at a time, rather than the whole schema at once, does this). That
    -- USAGE grant does nothing but let the role see the schema exists, so remove it too.
    statements := fine_grained_access.prune_orphan_schema_usage();
    if coalesce(array_length(statements, 1), 0) > 0 then
      outcomes := outcomes || jsonb_build_array(jsonb_build_object(
        'index', position_in_queue + 2,
        'change', jsonb_build_object('kind', 'pruneOrphanSchemaUsage'),
        'status', 'applied', 'sql', to_jsonb(statements)));
    end if;

    new.status := 'applied';
    new.results := outcomes::text;
    new.error_message := null;
  exception when others then
    -- Nothing from the block above is in the database any more. Record what happened.
    -- Changes that had run before the failure are marked rolled back.
    new.status := 'failed';
    new.error_message := sqlerrm;
    new.results := (
      coalesce((select jsonb_agg(o || '{"status":"rolled_back"}'::jsonb)
                from jsonb_array_elements(outcomes) o), '[]'::jsonb)
      || jsonb_build_array(jsonb_build_object(
           'index', position_in_queue, 'change', change, 'status', 'failed', 'error', sqlerrm))
    )::text;
  end;
  return new;
end;
$$;

create trigger command_batch_apply
before insert on fine_grained_access.command_batch
for each row execute function fine_grained_access.apply_batch_command();

-- These are called by the trigger, never by a client.
revoke execute on function
  fine_grained_access.holds_select(text, text, text),
  fine_grained_access.apply_grant(text, text, text, boolean),
  fine_grained_access.apply_membership(text, text, boolean),
  fine_grained_access.apply_role(text, text)
from public;

-- What the app reads to show the latest save, so the outcome is still there after a page reload.
create view fine_grained_access.v_batches as
select
  id as batch_id,
  requested_at,
  status,
  error_message,
  changes,
  results
from fine_grained_access.command_batch
order by id desc;


-- ===== Row security =====
--
-- A table with row security ON is locked down by default: a role that can read the table
-- still sees no rows until a policy allows some. Superusers, the table owner, and roles with
-- BYPASSRLS (the app's connection role) always see every row. BYPASSRLS is checked against the
-- role in effect, so it doesn't carry over when the connection switches to a person.
--
-- The app manages one kind of policy: "column is one of these values", for one role, on one
-- table. Policies from several roles add up: a role sees every row that any policy applying to
-- it allows, including policies on functional roles it belongs to. Policies the app creates are
-- named imp_rls_<hash> and carry their structure as a JSON comment, so the catalog is the record
-- and the app never touches policies it didn't create.
--
-- A policy is only allowed for a role that can read the table. When a role loses that access
-- (a revoke, leaving a functional role, being deleted), every batch ends by removing the
-- policies that role no longer has any use for, so no orphan policies are left behind.

-- Reads a JSON comment; anything that isn't valid JSON reads as null instead of raising.
create or replace function fine_grained_access.safe_jsonb(p text) returns jsonb
language plpgsql immutable as $$
begin
  return p::jsonb;
exception when others then
  return null;
end;
$$;

-- The table's oid, refusing the plumbing schema, system schemas, and anything that isn't a table.
create or replace function fine_grained_access.managed_table(p_schema text, p_table text)
returns oid
language plpgsql as $$
declare
  rel oid;
begin
  if p_schema is null or p_table is null then
    raise exception 'a schema and a table are required';
  end if;
  if p_schema in ('pg_catalog', 'information_schema', 'pg_toast', 'fine_grained_access') then
    raise exception 'row security cannot be managed on tables in the % schema', p_schema;
  end if;
  select c.oid into rel
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = p_schema and c.relname = p_table and c.relkind in ('r', 'p');
  if rel is null then
    raise exception 'table %.% does not exist', p_schema, p_table;
  end if;
  return rel;
end;
$$;

-- Turn row security on or off for a table. Turning it off first removes every policy the app
-- created there, so nothing is left behind.
create or replace function fine_grained_access.apply_rls(p_schema text, p_table text, p_enable boolean)
returns text[]
language plpgsql as $$
declare
  rel oid;
  statements text[] := '{}';
  statement text;
  policy text;
begin
  if p_enable is null then
    raise exception 'a row security change needs enable';
  end if;
  rel := fine_grained_access.managed_table(p_schema, p_table);

  if p_enable then
    statements := array[format('alter table %I.%I enable row level security', p_schema, p_table)];
  else
    for policy in
      select polname from pg_policy
      where polrelid = rel and polname like 'imp\_rls\_%' order by polname
    loop
      statements := statements || format('drop policy %I on %I.%I', policy, p_schema, p_table);
    end loop;
    statements := statements || format('alter table %I.%I disable row level security', p_schema, p_table);
  end if;

  foreach statement in array statements loop
    execute statement;
  end loop;

  if (select relrowsecurity from pg_class where oid = rel) is distinct from p_enable then
    raise exception 'check failed: row security on %.% should be %', p_schema, p_table,
      case when p_enable then 'on' else 'off' end;
  end if;
  if not p_enable and exists (
    select 1 from pg_policy where polrelid = rel and polname like 'imp\_rls\_%'
  ) then
    raise exception 'check failed: policies remain on %.%', p_schema, p_table;
  end if;
  return statements;
end;
$$;

-- Allow a role to see only the rows where a column is one of the given values.
-- p_values is a JSON array of strings, numbers, or booleans.
create or replace function fine_grained_access.apply_row_policy_create(
  p_role text, p_schema text, p_table text, p_column text, p_values jsonb
) returns text[]
language plpgsql as $$
declare
  rel oid;
  column_type text;
  category "char";
  sorted_values jsonb;
  literals text;
  policy text;
  role_oid oid;
  comment_json jsonb;
  statements text[];
  statement text;
begin
  if p_column is null or p_values is null then
    raise exception 'a row policy needs a column and values';
  end if;
  perform fine_grained_access.require_managed_role(p_role);
  rel := fine_grained_access.managed_table(p_schema, p_table);

  if not (select relrowsecurity from pg_class where oid = rel) then
    raise exception 'row security is not on for %.%', p_schema, p_table;
  end if;
  -- Effective access: direct, or through a role it belongs to.
  if not has_table_privilege(p_role, rel, 'SELECT') then
    raise exception 'role % has no access to %.%, so it cannot have a row policy there',
      p_role, p_schema, p_table;
  end if;

  select format_type(a.atttypid, a.atttypmod), t.typcategory
    into column_type, category
  from pg_attribute a
  join pg_type t on t.oid = a.atttypid
  where a.attrelid = rel and a.attname = p_column and a.attnum > 0 and not a.attisdropped;
  if column_type is null then
    raise exception 'column % does not exist on %.%', p_column, p_schema, p_table;
  end if;
  -- String, number, boolean, and enum columns for now.
  if category not in ('S', 'N', 'B', 'E') then
    raise exception 'row policies on % columns are not supported yet (column %)', column_type, p_column;
  end if;

  if jsonb_typeof(p_values) <> 'array'
     or jsonb_array_length(p_values) = 0
     or jsonb_array_length(p_values) > 200 then
    raise exception 'values must be a list of 1 to 200 items';
  end if;
  if exists (
    select 1 from jsonb_array_elements(p_values) e
    where jsonb_typeof(e) not in ('string', 'number', 'boolean')
       or length(e #>> '{}') = 0
       or length(e #>> '{}') > 200
  ) then
    raise exception 'each value must be a non-empty string, number, or boolean of at most 200 characters';
  end if;

  -- Sorted and de-duplicated, so the same rule always gets the same name.
  select jsonb_agg(v order by v) into sorted_values
  from (select distinct v from jsonb_array_elements_text(p_values) v) d;
  select string_agg(quote_literal(v), ', ' order by v) into literals
  from jsonb_array_elements_text(sorted_values) v;

  policy := 'imp_rls_' || substr(md5(
    p_role || '|' || p_schema || '.' || p_table || '|' || p_column || '|' || sorted_values::text), 1, 16);
  comment_json := jsonb_build_object('column', p_column, 'op', 'in', 'values', sorted_values);
  if exists (select 1 from pg_policy where polrelid = rel and polname = policy) then
    raise exception 'that row policy already exists on %.% for %', p_schema, p_table, p_role;
  end if;

  statements := array[
    format('create policy %I on %I.%I as permissive for select to %I using (%I = any (array[%s]::%s[]))',
           policy, p_schema, p_table, p_role, p_column, literals, column_type),
    format('comment on policy %I on %I.%I is %L', policy, p_schema, p_table, comment_json::text)];
  foreach statement in array statements loop
    execute statement;
  end loop;

  -- Check it took effect: one permissive SELECT policy, for exactly this role, with our comment.
  select oid into role_oid from pg_roles where rolname = p_role;
  if not exists (
    select 1 from pg_policy
    where polrelid = rel and polname = policy and polroles = array[role_oid]
      and polpermissive and polcmd = 'r'
      and fine_grained_access.safe_jsonb(obj_description(oid, 'pg_policy')) = comment_json
  ) then
    raise exception 'check failed: policy % on %.% is not as requested', policy, p_schema, p_table;
  end if;
  return statements;
end;
$$;

create or replace function fine_grained_access.apply_row_policy_drop(
  p_schema text, p_table text, p_policy text
) returns text[]
language plpgsql as $$
declare
  rel oid;
  statement text;
begin
  rel := fine_grained_access.managed_table(p_schema, p_table);
  if p_policy is null or p_policy not like 'imp\_rls\_%' then
    raise exception 'only policies created by this app can be removed here';
  end if;
  if not exists (select 1 from pg_policy where polrelid = rel and polname = p_policy) then
    raise exception 'policy % does not exist on %.%', p_policy, p_schema, p_table;
  end if;

  statement := format('drop policy %I on %I.%I', p_policy, p_schema, p_table);
  execute statement;

  if exists (select 1 from pg_policy where polrelid = rel and polname = p_policy) then
    raise exception 'check failed: policy % is still on %.%', p_policy, p_schema, p_table;
  end if;
  return array[statement];
end;
$$;

-- Remove the app's policies for any role that can no longer read the table. Runs at the end of
-- every batch, so a batch that takes access away and gives it back keeps its policies. Then it
-- checks that none are left.
create or replace function fine_grained_access.prune_orphan_policies() returns text[]
language plpgsql as $$
declare
  statements text[] := '{}';
  statement text;
  orphan record;
begin
  for orphan in
    select n.nspname as schema_name, c.relname as table_name, pol.polname as policy_name
    from pg_policy pol
    join pg_class c on c.oid = pol.polrelid
    join pg_namespace n on n.oid = c.relnamespace
    where pol.polname like 'imp\_rls\_%'
      and exists (select 1 from unnest(pol.polroles) r(role_oid)
                  where r.role_oid <> 0 and not has_table_privilege(r.role_oid, c.oid, 'SELECT'))
    order by 1, 2, 3
  loop
    statement := format('drop policy %I on %I.%I', orphan.policy_name, orphan.schema_name, orphan.table_name);
    execute statement;
    statements := statements || statement;
  end loop;

  if exists (
    select 1
    from pg_policy pol
    join pg_class c on c.oid = pol.polrelid
    where pol.polname like 'imp\_rls\_%'
      and exists (select 1 from unnest(pol.polroles) r(role_oid)
                  where r.role_oid <> 0 and not has_table_privilege(r.role_oid, c.oid, 'SELECT'))
  ) then
    raise exception 'check failed: a row policy still names a role without access to its table';
  end if;
  return statements;
end;
$$;

-- A role with USAGE on a schema but SELECT on none of its tables holds a stray, no-op
-- privilege: it can see the schema exists but reach nothing inside it. Revoking a whole
-- schema at once already drops USAGE along with every table's SELECT (see apply_grant); this
-- only matters when every table was revoked one at a time instead. Runs at the end of every
-- batch, the same way prune_orphan_policies does.
create or replace function fine_grained_access.prune_orphan_schema_usage() returns text[]
language plpgsql as $$
declare
  statements text[] := '{}';
  statement text;
  orphan record;
begin
  for orphan in
    select n.nspname as schema_name, r.rolname as role_name
    from pg_namespace n
    cross join lateral aclexplode(coalesce(n.nspacl, acldefault('n', n.nspowner))) a
    join pg_roles r on r.oid = a.grantee
    where a.privilege_type = 'USAGE'
      and r.rolname ~ '^imp_(fn|pr)_rl_'
      and n.nspname <> 'fine_grained_access'
      and not exists (
        select 1
        from pg_class c
        cross join lateral aclexplode(coalesce(c.relacl, acldefault('r', c.relowner))) ca
        where c.relnamespace = n.oid
          and c.relkind in ('r', 'p')
          and ca.grantee = a.grantee
          and ca.privilege_type = 'SELECT'
      )
    order by 1, 2
  loop
    statement := format('revoke usage on schema %I from %I', orphan.schema_name, orphan.role_name);
    execute statement;
    statements := statements || statement;
  end loop;

  if exists (
    select 1
    from pg_namespace n
    cross join lateral aclexplode(coalesce(n.nspacl, acldefault('n', n.nspowner))) a
    join pg_roles r on r.oid = a.grantee
    where a.privilege_type = 'USAGE'
      and r.rolname ~ '^imp_(fn|pr)_rl_'
      and n.nspname <> 'fine_grained_access'
      and not exists (
        select 1
        from pg_class c
        cross join lateral aclexplode(coalesce(c.relacl, acldefault('r', c.relowner))) ca
        where c.relnamespace = n.oid
          and c.relkind in ('r', 'p')
          and ca.grantee = a.grantee
          and ca.privilege_type = 'SELECT'
      )
  ) then
    raise exception 'check failed: a managed role still holds schema usage with no table access in it';
  end if;
  return statements;
end;
$$;

-- safe_jsonb stays open to everyone: v_row_policies calls it, and Postgres checks function
-- permission against the person reading the view, not the view owner. It only parses text.
revoke execute on function
  fine_grained_access.managed_table(text, text),
  fine_grained_access.apply_rls(text, text, boolean),
  fine_grained_access.apply_row_policy_create(text, text, text, text, jsonb),
  fine_grained_access.apply_row_policy_drop(text, text, text),
  fine_grained_access.prune_orphan_policies(),
  fine_grained_access.prune_orphan_schema_usage()
from public;

-- Tables that have row security on, with how many policies the app created and how many it didn't.
create view fine_grained_access.v_rls_tables as
select
  n.nspname::text as schema_name,
  c.relname::text as table_name,
  (select count(*) from pg_policy p
    where p.polrelid = c.oid and p.polname like 'imp\_rls\_%')::integer as policy_count,
  (select count(*) from pg_policy p
    where p.polrelid = c.oid and p.polname not like 'imp\_rls\_%')::integer as other_policy_count
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where c.relkind in ('r', 'p')
  and c.relrowsecurity
  and n.nspname not in ('pg_catalog', 'information_schema', 'pg_toast', 'fine_grained_access')
order by 1, 2;

-- One row per policy and role. is_managed says whether the app created it; for those,
-- filter_column and filter_values (a JSON list) come from the policy's comment. Policies the app
-- didn't create show only their definition, read-only.
create view fine_grained_access.v_row_policies as
select
  n.nspname::text as schema_name,
  c.relname::text as table_name,
  pol.polname::text as policy_name,
  (case when r.role_oid = 0 then 'PUBLIC' else pg_get_userbyid(r.role_oid) end)::text as role_name,
  (pol.polname like 'imp\_rls\_%') as is_managed,
  pol.polpermissive as is_permissive,
  coalesce(fine_grained_access.safe_jsonb(
    case when pol.polname like 'imp\_rls\_%' then obj_description(pol.oid, 'pg_policy') end
  ) ->> 'column', '')::text as filter_column,
  coalesce((fine_grained_access.safe_jsonb(
    case when pol.polname like 'imp\_rls\_%' then obj_description(pol.oid, 'pg_policy') end
  ) -> 'values')::text, '[]')::text as filter_values,
  coalesce(pg_get_expr(pol.polqual, pol.polrelid), '')::text as definition
from pg_policy pol
join pg_class c on c.oid = pol.polrelid
join pg_namespace n on n.oid = c.relnamespace
cross join lateral unnest(pol.polroles) as r(role_oid)
where n.nspname not in ('pg_catalog', 'information_schema', 'pg_toast', 'fine_grained_access')
order by 1, 2, 3, 4;

-- The columns of every table, so a screen can offer the right ones. type_kind is what a row
-- policy can filter on: text, number, or boolean; anything else is "other".
create view fine_grained_access.v_columns as
select
  n.nspname::text as schema_name,
  c.relname::text as table_name,
  a.attname::text as column_name,
  format_type(a.atttypid, a.atttypmod)::text as data_type,
  (case t.typcategory
     when 'N' then 'number' when 'B' then 'boolean'
     when 'S' then 'text' when 'E' then 'text' else 'other' end)::text as type_kind,
  a.attnum::integer as ordinal
from pg_attribute a
join pg_class c on c.oid = a.attrelid
join pg_namespace n on n.oid = c.relnamespace
join pg_type t on t.oid = a.atttypid
where a.attnum > 0
  and not a.attisdropped
  and c.relkind in ('r', 'p')
  and n.nspname not in ('pg_catalog', 'information_schema', 'pg_toast', 'fine_grained_access')
order by 1, 2, 6;


-- The app's row policies as a JSON list, and which of an earlier list are gone now. The batch
-- trigger takes a snapshot before each change, so the record can say what a change removed
-- (the role, table, column, and values), which the policy itself no longer holds once dropped.
create or replace function fine_grained_access.policy_snapshot() returns jsonb
language sql stable as $$
  select coalesce(jsonb_agg(jsonb_build_object(
      'policy', policy_name, 'role', role_name, 'schema', schema_name, 'table', table_name,
      'column', filter_column, 'values', filter_values::jsonb)
    order by schema_name, table_name, policy_name, role_name), '[]'::jsonb)
  from fine_grained_access.v_row_policies
  where is_managed;
$$;

create or replace function fine_grained_access.policies_missing(p_before jsonb) returns jsonb
language sql stable as $$
  with now_policies as (select value from jsonb_array_elements(fine_grained_access.policy_snapshot()))
  select coalesce(jsonb_agg(b.value), '[]'::jsonb)
  from jsonb_array_elements(p_before) b
  where not exists (select 1 from now_policies n where n.value = b.value);
$$;

revoke execute on function
  fine_grained_access.policy_snapshot(),
  fine_grained_access.policies_missing(jsonb)
from public;
