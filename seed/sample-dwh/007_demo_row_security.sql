-- Demo row security. A few tables are locked down, then each role is allowed some of the
-- rows. Everything goes through the same functions the app uses, so these policies look
-- exactly like ones created from the Row and Column Policies tab.
--
-- sales_orders_wide: two policies for sales (country, then customer segment; they add up),
--   plus one just for Bruce on top of what he already gets through sales.
-- hr_employees_wide: two policies for hr (department, then employment type), plus one just
--   for Thor on top of what he already gets through hr.
-- finance_budgets_wide: locked down with no policies at all, so finance can read the table
--   but sees zero rows. Demonstrates the "has access but no policy" case.
-- Anyone else with access to a table sees no rows until a policy allows some.

select fine_grained_access.apply_rls('staging', 'sales_orders_wide', true);
select fine_grained_access.apply_row_policy_create(
  'imp_fn_rl_sales', 'staging', 'sales_orders_wide', 'country_name', '["United States", "Canada"]');
select fine_grained_access.apply_row_policy_create(
  'imp_fn_rl_sales', 'staging', 'sales_orders_wide', 'customer_segment', '["Enterprise"]');
select fine_grained_access.apply_row_policy_create(
  'imp_pr_rl_bruce', 'staging', 'sales_orders_wide', 'channel_name', '["Web Store"]');

select fine_grained_access.apply_rls('staging', 'hr_employees_wide', true);
select fine_grained_access.apply_row_policy_create(
  'imp_fn_rl_hr', 'staging', 'hr_employees_wide', 'department_name', '["People", "Legal"]');
select fine_grained_access.apply_row_policy_create(
  'imp_fn_rl_hr', 'staging', 'hr_employees_wide', 'employment_type', '["Full time"]');
select fine_grained_access.apply_row_policy_create(
  'imp_pr_rl_thor', 'staging', 'hr_employees_wide', 'location_name', '["Berlin"]');

select fine_grained_access.apply_rls('staging', 'finance_budgets_wide', true);
