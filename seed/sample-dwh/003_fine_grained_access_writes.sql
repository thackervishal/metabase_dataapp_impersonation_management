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
    statements := array[
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
      else
        raise exception 'unknown change kind: %', change->>'kind';
      end if;
      outcomes := outcomes || jsonb_build_array(jsonb_build_object(
        'index', position_in_queue, 'change', change, 'status', 'applied', 'sql', to_jsonb(statements)));
    end loop;

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
