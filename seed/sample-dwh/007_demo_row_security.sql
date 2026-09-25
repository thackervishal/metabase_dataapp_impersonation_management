-- Demo row security. Two tables are locked down, then each role is allowed some of the rows.
-- Everything goes through the same functions the app uses, so these policies look exactly like
-- ones created from the Row and Column Policies tab.
--
-- sales_orders_wide: sales sees United States and Canada orders only.
-- hr_employees_wide: hr sees the People and Legal departments only.
-- Anyone else with access to a table sees no rows until a policy allows some.

select fine_grained_access.apply_rls('staging', 'sales_orders_wide', true);
select fine_grained_access.apply_row_policy_create(
  'imp_fn_rl_sales', 'staging', 'sales_orders_wide', 'country_name', '["United States", "Canada"]');

select fine_grained_access.apply_rls('staging', 'hr_employees_wide', true);
select fine_grained_access.apply_row_policy_create(
  'imp_fn_rl_hr', 'staging', 'hr_employees_wide', 'department_name', '["People", "Legal"]');
