-- Command tables: the RBAC data app's write path.
-- Metabase's own DB connection only ever needs INSERT on these tables --
-- the actual privileged DDL runs inside SECURITY DEFINER trigger functions,
-- owned by the bootstrap superuser (fine for this local demo stack; a real
-- deployment should own these functions with a narrower, dedicated role
-- instead of the superuser).

create table rbac_control.role_commands (
  id bigserial primary key,
  role_name text not null,
  action text not null check (action in ('create', 'drop')),
  requested_at timestamptz not null default now()
);

create or replace function rbac_control.apply_role_command() returns trigger
language plpgsql security definer as $$
begin
  if new.action = 'create' then
    execute format('create role %I', new.role_name);
  elsif new.action = 'drop' then
    execute format('drop role %I', new.role_name);
  else
    raise exception 'unknown role command action: %', new.action;
  end if;
  return new;
end;
$$;

create trigger role_commands_apply
before insert on rbac_control.role_commands
for each row execute function rbac_control.apply_role_command();


create table rbac_control.user_commands (
  id bigserial primary key,
  user_name text not null,
  password text,
  action text not null check (action in ('create', 'drop')),
  requested_at timestamptz not null default now()
);

create or replace function rbac_control.apply_user_command() returns trigger
language plpgsql security definer as $$
begin
  if new.action = 'create' then
    execute format('create role %I login password %L', new.user_name, new.password);
  elsif new.action = 'drop' then
    execute format('drop role %I', new.user_name);
  else
    raise exception 'unknown user command action: %', new.action;
  end if;
  return new;
end;
$$;

create trigger user_commands_apply
before insert on rbac_control.user_commands
for each row execute function rbac_control.apply_user_command();


create table rbac_control.grant_commands (
  id bigserial primary key,
  schema_name text not null,
  table_name text not null,
  role_name text not null,
  privilege text not null check (privilege in ('SELECT', 'INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'REFERENCES', 'TRIGGER')),
  should_grant boolean not null,
  requested_at timestamptz not null default now()
);

create or replace function rbac_control.apply_grant_command() returns trigger
language plpgsql security definer as $$
begin
  -- Privilege feeds into the DDL text directly (it's a keyword, not an
  -- identifier, so format's %I can't quote it) -- re-check it against the
  -- same allowlist as the table's CHECK constraint here, since a BEFORE
  -- trigger runs before constraints are validated and can't rely on them.
  if new.privilege not in ('SELECT', 'INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'REFERENCES', 'TRIGGER') then
    raise exception 'invalid privilege: %', new.privilege;
  end if;

  if new.should_grant then
    execute format('grant %s on %I.%I to %I', new.privilege, new.schema_name, new.table_name, new.role_name);
  else
    execute format('revoke %s on %I.%I from %I', new.privilege, new.schema_name, new.table_name, new.role_name);
  end if;
  return new;
end;
$$;

create trigger grant_commands_apply
before insert on rbac_control.grant_commands
for each row execute function rbac_control.apply_grant_command();


create table rbac_control.membership_commands (
  id bigserial primary key,
  user_name text not null,
  role_name text not null,
  action text not null check (action in ('add', 'remove')),
  requested_at timestamptz not null default now()
);

create or replace function rbac_control.apply_membership_command() returns trigger
language plpgsql security definer as $$
begin
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

create trigger membership_commands_apply
before insert on rbac_control.membership_commands
for each row execute function rbac_control.apply_membership_command();
