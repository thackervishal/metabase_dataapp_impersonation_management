-- Read-only views the RBAC data app queries via Metabase's data hooks.
-- Plain SELECTs over Postgres's own catalogs -- no state is duplicated here.
--
-- "Managed" roles = the roles this app shows and edits: only those whose name starts
-- with imp_fn_rl_ (a functional role) or imp_pr_rl_ (a person role). imp = impersonation,
-- fn = functional, pr = person, rl = role. Everything else, such as superusers, pg_* roles,
-- and metabase_reader, is hidden by that rule. The kind is read from the prefix, since
-- people never log in (Metabase impersonates them with SET ROLE).

create schema if not exists fine_grained_access;

create view fine_grained_access.v_schema_tree as
-- Built on the system catalog, not information_schema: information_schema only lists
-- tables the connection user can read, and this tree must list every table.
select
  current_database()::text as database_name,
  n.nspname::text          as schema_name,
  c.relname::text          as table_name
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where c.relkind in ('r', 'p')
  and n.nspname not in ('pg_catalog', 'information_schema', 'pg_toast', 'fine_grained_access')
order by 2, 3;

create view fine_grained_access.v_roles as
select
  rolname::text as role_name,
  case when rolname ~ '^imp_fn_rl_' then 'functional' else 'person' end as role_kind
from pg_roles
where rolname ~ '^imp_(fn|pr)_rl_'
order by rolname;

-- Direct table privileges only (not inherited through memberships).
-- Grants to PUBLIC (everyone) are kept, shown as role_name = 'PUBLIC'.
create view fine_grained_access.v_grants as
select
  n.nspname::text                          as schema_name,
  c.relname::text                          as table_name,
  case when a.grantee = 0 then 'PUBLIC'::text
       else pg_get_userbyid(a.grantee)::text end as role_name,
  a.privilege_type                         as privilege
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
cross join lateral aclexplode(coalesce(c.relacl, acldefault('r', c.relowner))) a
where c.relkind in ('r', 'p')
  and n.nspname not in ('pg_catalog', 'information_schema', 'pg_toast', 'fine_grained_access')
  and (a.grantee = 0
       or a.grantee in (select oid from pg_roles where rolname ~ '^imp_(fn|pr)_rl_'))
order by 1, 2, 3, 4;

-- member_name is a member of role_name (either can be a person or a functional role).
create view fine_grained_access.v_memberships as
select
  member_role.rolname::text  as member_name,
  granted_role.rolname::text as role_name
from pg_auth_members m
join pg_roles member_role  on member_role.oid  = m.member
join pg_roles granted_role on granted_role.oid = m.roleid
where member_role.rolname ~ '^imp_(fn|pr)_rl_'
  and granted_role.rolname ~ '^imp_(fn|pr)_rl_'
order by member_role.rolname, granted_role.rolname;
