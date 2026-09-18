-- Read-only views the RBAC data app queries via Metabase's data hooks.
-- Plain SELECTs over Postgres's own catalogs -- no state is duplicated here.

create schema if not exists rbac_control;

create view rbac_control.v_schema_tree as
select table_schema as schema_name, table_name
from information_schema.tables
where table_type = 'BASE TABLE'
  and table_schema not in ('pg_catalog', 'information_schema', 'pg_toast', 'rbac_control')
order by table_schema, table_name;

create view rbac_control.v_roles as
select
  rolname as role_name,
  rolcanlogin as can_login,
  rolsuper as is_superuser,
  rolcreaterole as can_create_role
from pg_roles
where rolname not like 'pg\_%'
order by rolname;

create view rbac_control.v_grants as
select
  table_schema as schema_name,
  table_name,
  grantee as role_name,
  privilege_type as privilege
from information_schema.role_table_grants
where table_schema not in ('pg_catalog', 'information_schema', 'pg_toast', 'rbac_control')
order by table_schema, table_name, grantee, privilege_type;

create view rbac_control.v_memberships as
select
  member_role.rolname as user_name,
  granted_role.rolname as role_name
from pg_auth_members m
join pg_roles member_role on member_role.oid = m.member
join pg_roles granted_role on granted_role.oid = m.roleid
order by member_role.rolname, granted_role.rolname;
