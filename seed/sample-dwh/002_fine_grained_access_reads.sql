-- Read-only views the RBAC data app queries via Metabase's data hooks.
-- Plain SELECTs over Postgres's own catalogs -- no state is duplicated here.
--
-- "Managed" roles = the roles this app shows and edits: everything except
-- superusers, Postgres's built-in pg_* roles, and metabase_reader (the role
-- Metabase itself connects as). They're hidden by rule, not just by name.
-- Person vs functional is stored as a role COMMENT ('person' / 'functional'), since
-- people never log in (Metabase impersonates them with SET ROLE). Unmarked = 'unclassified'.

create schema if not exists fine_grained_access;

create view fine_grained_access.v_schema_tree as
select table_schema as schema_name, table_name
from information_schema.tables
where table_type = 'BASE TABLE'
  and table_schema not in ('pg_catalog', 'information_schema', 'pg_toast', 'fine_grained_access')
order by table_schema, table_name;

create view fine_grained_access.v_roles as
select
  rolname as role_name,
  coalesce(shobj_description(oid, 'pg_authid'), 'unclassified') as role_kind
from pg_roles
where not rolsuper
  and rolname not like 'pg\_%'
  and rolname <> 'metabase_reader'
order by rolname;

-- Direct table privileges only (not inherited through memberships).
-- Grants to PUBLIC (everyone) are kept, shown as role_name = 'PUBLIC'.
create view fine_grained_access.v_grants as
select
  n.nspname                                as schema_name,
  c.relname                                as table_name,
  case when a.grantee = 0 then 'PUBLIC'
       else pg_get_userbyid(a.grantee) end as role_name,
  a.privilege_type                         as privilege
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
cross join lateral aclexplode(coalesce(c.relacl, acldefault('r', c.relowner))) a
where c.relkind in ('r', 'p')
  and n.nspname not in ('pg_catalog', 'information_schema', 'pg_toast', 'fine_grained_access')
  and (a.grantee = 0
       or a.grantee in (select oid from pg_roles
                        where not rolsuper
                          and rolname not like 'pg\_%'
                          and rolname <> 'metabase_reader'))
order by 1, 2, 3, 4;

-- member_name is a member of role_name (either can be a person or a functional role).
create view fine_grained_access.v_memberships as
select
  member_role.rolname  as member_name,
  granted_role.rolname as role_name
from pg_auth_members m
join pg_roles member_role  on member_role.oid  = m.member
join pg_roles granted_role on granted_role.oid = m.roleid
where not member_role.rolsuper  and member_role.rolname  not like 'pg\_%' and member_role.rolname  <> 'metabase_reader'
  and not granted_role.rolsuper and granted_role.rolname not like 'pg\_%' and granted_role.rolname <> 'metabase_reader'
order by member_role.rolname, granted_role.rolname;
