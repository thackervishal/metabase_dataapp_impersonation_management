-- Command tables: the RBAC data app's write path.
-- Metabase's own DB connection only ever needs INSERT on these tables --
-- the actual privileged DDL runs inside SECURITY DEFINER trigger functions,
-- owned by the bootstrap superuser (fine for this local demo stack; a real
-- deployment should own these functions with a narrower, dedicated role
-- instead of the superuser).
--
-- Each trigger runs its statement in the same transaction as the insert. If the
-- statement fails, the insert is rolled back too, so a row in a command table
-- means its statement succeeded.

-- Every role this app manages starts with imp_fn_rl_ (a functional role) or
-- imp_pr_rl_ (a person role): imp = impersonation, fn = functional, pr = person,
-- rl = role. The trigger functions below call this first, so the app can't create,
-- drop, grant to, or add members to any other role (superusers, pg_* roles,
-- metabase_reader, and so on).
--
-- The length check matters: Postgres silently cuts identifiers longer than 63 bytes,
-- so a too-long name would create a role with a different name than the one asked for.
create or replace function fine_grained_access.require_managed_role(role_name text) returns void
language plpgsql as $$
begin
  if role_name !~ '^imp_(fn|pr)_rl_[a-z][a-z0-9_]*$' then
    raise exception 'role name must start with imp_fn_rl_ (functional) or imp_pr_rl_ (person), followed by lowercase letters, numbers, and underscores: %', role_name;
  end if;
  if octet_length(role_name) > 63 then
    raise exception 'role name is % characters; the limit is 63: %', octet_length(role_name), role_name;
  end if;
end;
$$;

-- Creating a role says what kind it is, through the action:
--   create_person      a person role, named imp_pr_rl_<name> (Metabase impersonates it with SET ROLE)
--   create_functional  a functional role, named imp_fn_rl_<name> (people are made members of it)
-- The kind is part of the name, and fine_grained_access.v_roles reads it from there.
create table fine_grained_access.command_role (
  id bigserial primary key,
  role_name text not null,
  action text not null check (action in ('create_person', 'create_functional', 'drop')),
  requested_at timestamptz not null default now()
);

create or replace function fine_grained_access.apply_role_command() returns trigger
language plpgsql security definer as $$
begin
  perform fine_grained_access.require_managed_role(new.role_name);

  if new.action = 'create_person' then
    if new.role_name not like 'imp\_pr\_rl\_%' then
      raise exception 'a person role must start with imp_pr_rl_: %', new.role_name;
    end if;
    execute format('create role %I nologin', new.role_name);
    -- Metabase impersonates a person with SET ROLE, so the role the app connects
    -- as (session_user) must be allowed to switch to it, without inheriting it.
    execute format('grant %I to %I with inherit false, set true', new.role_name, session_user);

  elsif new.action = 'create_functional' then
    if new.role_name not like 'imp\_fn\_rl\_%' then
      raise exception 'a functional role must start with imp_fn_rl_: %', new.role_name;
    end if;
    execute format('create role %I nologin', new.role_name);

  elsif new.action = 'drop' then
    -- Refuse if the role owns anything: DROP OWNED would delete those objects.
    if exists (select 1 from pg_class c join pg_roles r on r.oid = c.relowner
               where r.rolname = new.role_name) then
      raise exception 'role % owns database objects and cannot be dropped here', new.role_name;
    end if;
    -- Revoke every privilege the role holds, then drop it. Its memberships go with it.
    execute format('drop owned by %I', new.role_name);
    execute format('drop role %I', new.role_name);

  else
    raise exception 'unknown role command action: %', new.action;
  end if;
  return new;
end;
$$;

create trigger command_role_apply
before insert on fine_grained_access.command_role
for each row execute function fine_grained_access.apply_role_command();


-- The app manages SELECT on tables and nothing else, so that's the only privilege allowed.
-- table_name = '*' means "every table in the schema": one row grants (or revokes) SELECT on
-- all tables that exist at that moment, together with USAGE on the schema itself.
-- (Tables created later are not covered. That's a known gap, left for later.)
create table fine_grained_access.command_grant (
  id bigserial primary key,
  schema_name text not null,
  table_name text not null,
  role_name text not null,
  privilege text not null check (privilege = 'SELECT'),
  should_grant boolean not null,
  requested_at timestamptz not null default now()
);

create or replace function fine_grained_access.apply_grant_command() returns trigger
language plpgsql security definer as $$
begin
  perform fine_grained_access.require_managed_role(new.role_name);
  -- This schema holds the app's own plumbing. No managed role may ever get access to it.
  if new.schema_name = 'fine_grained_access' then
    raise exception 'the fine_grained_access schema cannot be granted to any role';
  end if;
  -- A BEFORE trigger runs before the CHECK constraint, so re-check here.
  if new.privilege <> 'SELECT' then
    raise exception 'only SELECT can be granted or revoked here, got: %', new.privilege;
  end if;

  if new.table_name = '*' then
    if new.should_grant then
      execute format('grant usage on schema %I to %I', new.schema_name, new.role_name);
      execute format('grant select on all tables in schema %I to %I', new.schema_name, new.role_name);
    else
      execute format('revoke select on all tables in schema %I from %I', new.schema_name, new.role_name);
      execute format('revoke usage on schema %I from %I', new.schema_name, new.role_name);
    end if;
  elsif new.should_grant then
    -- A table is only reachable with USAGE on its schema, so grant that too.
    execute format('grant usage on schema %I to %I', new.schema_name, new.role_name);
    execute format('grant select on %I.%I to %I', new.schema_name, new.table_name, new.role_name);
  else
    execute format('revoke select on %I.%I from %I', new.schema_name, new.table_name, new.role_name);
  end if;
  return new;
end;
$$;

create trigger command_grant_apply
before insert on fine_grained_access.command_grant
for each row execute function fine_grained_access.apply_grant_command();


create table fine_grained_access.command_membership (
  id bigserial primary key,
  user_name text not null,
  role_name text not null,
  action text not null check (action in ('add', 'remove')),
  requested_at timestamptz not null default now()
);

create or replace function fine_grained_access.apply_membership_command() returns trigger
language plpgsql security definer as $$
begin
  perform fine_grained_access.require_managed_role(new.user_name);
  perform fine_grained_access.require_managed_role(new.role_name);
  if new.action = 'add' then
    execute format('grant %I to %I', new.role_name, new.user_name);
  elsif new.action = 'remove' then
    execute format('revoke %I from %I', new.role_name, new.user_name);
  else
    raise exception 'unknown membership command action: %', new.action;
  end if;
  return new;
end;
$$;

create trigger command_membership_apply
before insert on fine_grained_access.command_membership
for each row execute function fine_grained_access.apply_membership_command();
