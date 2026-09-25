-- Demo data for the RBAC app: three functional roles and some people.
-- Functional roles hold the table privileges; people get them by being
-- members. Nobody logs in to Postgres: Metabase impersonates a person with
-- SET ROLE <person>, so every role here is NOLOGIN.
--
-- Every role the app manages starts with imp_fn_rl_ (functional) or imp_pr_rl_ (person):
-- imp = impersonation, fn = functional, pr = person, rl = role. The views only show
-- roles with those prefixes, and the command triggers refuse any other name, so the app
-- can't touch roles it didn't create. The prefix is how the app tells the two kinds apart.

create role imp_fn_rl_sales   nologin;
create role imp_fn_rl_finance nologin;
create role imp_fn_rl_hr      nologin;

create role imp_pr_rl_alice nologin;   -- sales
create role imp_pr_rl_bob   nologin;   -- sales + finance (belongs to two roles)
create role imp_pr_rl_carol nologin;   -- finance
create role imp_pr_rl_dave  nologin;   -- hr
create role imp_pr_rl_erin  nologin;   -- hr + finance (belongs to two roles)
create role imp_pr_rl_frank nologin;   -- no roles yet (empty-state case)

grant imp_fn_rl_sales   to imp_pr_rl_alice, imp_pr_rl_bob;
grant imp_fn_rl_finance to imp_pr_rl_bob, imp_pr_rl_carol, imp_pr_rl_erin;
grant imp_fn_rl_hr      to imp_pr_rl_dave, imp_pr_rl_erin;

grant usage on schema staging, analytics to imp_fn_rl_sales, imp_fn_rl_finance, imp_fn_rl_hr;

-- What each functional role can read. Table lists use LIKE patterns so the grants
-- stay short: "sales_%" means every staging table whose name starts with sales_.
create procedure pg_temp.grant_select(role_name text, schema_name text, patterns text[])
language plpgsql as $$
declare
  found_table text;
begin
  for found_table in
    select c.relname
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = schema_name
      and c.relkind = 'r'
      and c.relname like any (patterns)
  loop
    execute format('grant select on %I.%I to %I', schema_name, found_table, role_name);
  end loop;
end
$$;

-- Sales: its staging area, plus the sales-side dimensions and facts.
call pg_temp.grant_select('imp_fn_rl_sales', 'staging', array['sales\_%']);
call pg_temp.grant_select('imp_fn_rl_sales', 'analytics', array[
  'dim\_date', 'dim\_product', 'dim\_region', 'dim\_customer', 'dim\_channel', 'dim\_promotion',
  'fct\_sales', 'fct\_order\_lines', 'fct\_sales\_returns', 'fct\_sales\_pipeline'
]);

-- Finance: its staging area and the sales invoices, plus the finance model.
call pg_temp.grant_select('imp_fn_rl_finance', 'staging', array['finance\_%', 'sales\_invoices\_%', 'sales\_payments\_%']);
call pg_temp.grant_select('imp_fn_rl_finance', 'analytics', array[
  'dim\_date', 'dim\_department', 'dim\_account', 'dim\_cost\_center', 'dim\_currency', 'dim\_customer',
  'fct\_gl\_entries', 'fct\_invoices', 'fct\_budget\_vs\_actual', 'fct\_sales'
]);

-- HR: its staging area and payroll, plus the people model.
call pg_temp.grant_select('imp_fn_rl_hr', 'staging', array['hr\_%', 'payroll\_%']);
call pg_temp.grant_select('imp_fn_rl_hr', 'analytics', array[
  'dim\_date', 'dim\_person', 'dim\_department', 'dim\_position', 'dim\_location',
  'fct\_recruitment', 'fct\_retention', 'fct\_attrition', 'fct\_productivity', 'fct\_payroll', 'fct\_timesheets'
]);
