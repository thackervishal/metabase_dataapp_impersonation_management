-- Demo data for the RBAC app: three functional roles and some people.
-- Functional roles hold the table privileges; people get them by being
-- members. Nobody logs in to Postgres: Metabase impersonates a person with
-- SET ROLE <person>, so every role here is NOLOGIN.
--
-- Person vs functional is recorded as a role COMMENT ('person' / 'functional'),
-- which fine_grained_access.v_roles reads. (It can't be derived from LOGIN any more.)

create role sales   nologin;
create role finance nologin;
create role hr      nologin;

create role alice nologin;   -- sales
create role bob   nologin;   -- sales + finance (belongs to two roles)
create role carol nologin;   -- finance
create role dave  nologin;   -- hr
create role erin  nologin;   -- hr + finance (belongs to two roles)
create role frank nologin;   -- no roles yet (empty-state case)

comment on role sales   is 'functional';
comment on role finance is 'functional';
comment on role hr      is 'functional';
comment on role alice   is 'person';
comment on role bob     is 'person';
comment on role carol   is 'person';
comment on role dave    is 'person';
comment on role erin    is 'person';
comment on role frank   is 'person';

grant sales   to alice, bob;
grant finance to bob, carol, erin;
grant hr      to dave, erin;

grant usage on schema sales, analytics to sales, finance, hr;

grant select on sales.customers, sales.orders, sales.order_items to sales;
grant insert, update on sales.orders to sales;

grant select on sales.orders, sales.order_items, analytics.daily_metrics to finance;

grant select on analytics.events to hr;

