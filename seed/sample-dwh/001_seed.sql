-- Sample warehouse: the "real" data the RBAC demo grants access to.
-- Not Metabase's own metadata -- this is the target database the data app manages.
--
-- Three schemas, laid out like a typical warehouse:
--   public     a few unrelated application tables (settings, logs, leftovers)
--   staging    denormalized ("wide") tables loaded from source systems, by business area
--   analytics  the modeled layer: dim_* dimensions and fct_* facts
--
-- Tables are described compactly below, one line each: 'schema.table|column, column, ...'.
-- The first column of every table is its primary key. A column's type comes from its
-- name (see col_type), or from an explicit override written as name:type.
-- Most tables stay empty; the small dimensions at the bottom are filled in.

create schema staging;
create schema analytics;

-- Guess a column's type from its name, so the table list below stays readable.
create function pg_temp.col_type(col text) returns text
language sql immutable as $$
  select case
    when col ~ '^(is|has)_' then 'boolean'
    when col ~ '_(id|key)$' then 'bigint'
    when col ~ '_date$' then 'date'
    when col ~ '_(at|ts)$' then 'timestamptz'
    when col ~ '(_amount|_price|_cost|_total|_rate|_pct|_hours|_score|_value|_balance|_salary|_spend|_revenue|_margin)$' then 'numeric(14,2)'
    when col ~ '(quantity|_qty|_count|_days)$' then 'integer'
    else 'text'
  end
$$;

do $$
declare
  specs text[] := array[

    -- ===== public: a few unrelated application tables =====
    'public.app_settings|setting_id, setting_key, setting_value, updated_at',
    'public.audit_log|log_id, actor_email, action, entity_type, entity_id, created_at',
    'public.feature_flags|flag_id, flag_name, is_enabled, rollout_pct, updated_at',
    'public.import_jobs|job_id, source_name, status, rows_loaded:integer, started_at, finished_at',
    'public.notifications|notification_id, recipient_email, channel, subject, sent_at, is_read',
    'public.file_uploads|upload_id, file_name, content_type, size_bytes:bigint, uploaded_by, uploaded_at',
    'public.legacy_users|user_id, email, full_name, created_at, is_active',
    'public.schema_migrations|migration_id, version, applied_at',
    'public.scratch_notes|note_id, title, body, created_at',
    'public.tmp_export_2024|export_id, export_name, exported_at',

    -- ===== staging: sales =====
    'staging.sales_orders_wide|order_id, order_date, customer_id, customer_name, customer_segment, region_name, country_name, sales_rep_name, channel_name, order_status, currency_code, subtotal_amount, discount_amount, tax_amount, total_amount',
    'staging.sales_order_lines_wide|order_line_id, order_id, order_date, product_id, product_name, category_name, brand_name, quantity, unit_price, discount_amount, line_total',
    'staging.sales_returns_wide|return_id, order_id, return_date, customer_name, product_name, return_reason, quantity, refund_amount',
    'staging.sales_quotes_wide|quote_id, quote_date, customer_name, sales_rep_name, quote_status, expiry_date, total_amount',
    'staging.sales_invoices_wide|invoice_id, invoice_number, invoice_date, due_date, customer_name, payment_terms, invoice_status, total_amount, balance_amount',
    'staging.sales_payments_wide|payment_id, invoice_number, payment_date, customer_name, payment_method, currency_code, payment_amount',
    'staging.sales_customers_wide|customer_id, customer_name, segment_name, industry_name, region_name, country_name, account_owner_name, first_order_date, lifetime_value',
    'staging.sales_opportunities_wide|opportunity_id, opportunity_name, account_name, owner_name, stage_name, expected_close_date, probability_pct, expected_amount',
    'staging.sales_targets_wide|target_id, sales_rep_name, region_name, target_date, quota_amount, attainment_pct',
    'staging.sales_price_lists_wide|price_list_id, product_name, currency_code, effective_date, expiry_date, list_price',

    -- ===== staging: marketing =====
    'staging.marketing_campaigns_wide|campaign_id, campaign_name, channel_name, objective_name, owner_name, start_date, end_date, budget_amount',
    'staging.marketing_ad_spend_daily|ad_spend_id, spend_date, campaign_name, platform_name, impressions:integer, clicks:integer, spend_amount',
    'staging.marketing_email_sends|send_id, campaign_name, recipient_email, subject_line, sent_at, is_test',
    'staging.marketing_email_events|event_id, send_id, recipient_email, event_type, event_at, link_url',
    'staging.marketing_web_sessions|session_id, visitor_id, session_start_at, landing_page, referrer_name, device_type, country_name, page_count:integer',
    'staging.marketing_page_views|page_view_id, session_id, viewed_at, page_url, time_on_page_seconds:integer',
    'staging.marketing_leads_wide|lead_id, created_date, full_name, email, company_name, lead_source, campaign_name, lead_status, lead_score',
    'staging.marketing_lead_conversions|conversion_id, lead_id, converted_date, opportunity_name, first_touch_channel, last_touch_channel, deal_amount',
    'staging.marketing_social_posts|post_id, posted_at, platform_name, campaign_name, likes_count, shares_count, comments_count',
    'staging.marketing_survey_responses|response_id, survey_name, respondent_email, submitted_at, satisfaction_score, comment_text',

    -- ===== staging: hr =====
    'staging.hr_employees_wide|employee_id, full_name, email, hire_date, job_title, department_name, manager_name, location_name, employment_type, is_active',
    'staging.hr_positions_wide|position_id, job_title, department_name, job_level, min_salary, max_salary, is_open',
    'staging.hr_departments_wide|department_id, department_name, parent_department_name, head_name, cost_center_code, headcount_count',
    'staging.hr_job_requisitions|requisition_id, job_title, department_name, hiring_manager_name, opened_date, closed_date, requisition_status',
    'staging.hr_candidates_wide|candidate_id, full_name, email, source_name, current_employer, created_date',
    'staging.hr_applications_wide|application_id, candidate_id, requisition_id, applied_date, stage_name, application_status, recruiter_name',
    'staging.hr_interviews_wide|interview_id, application_id, interview_date, interviewer_name, interview_type, score_value, recommendation',
    'staging.hr_offers_wide|offer_id, application_id, offer_date, salary_offered_amount, offer_status, accepted_date',
    'staging.hr_terminations_wide|termination_id, employee_id, termination_date, termination_type, reason_name, is_regretted, exit_interview_score',
    'staging.hr_performance_reviews|review_id, employee_id, review_period, reviewer_name, rating_score, reviewed_date',

    -- ===== staging: payroll =====
    'staging.payroll_runs|payroll_run_id, pay_period_start_date, pay_period_end_date, pay_date, run_status, total_gross_amount, total_net_amount',
    'staging.payroll_employee_earnings|earning_id, payroll_run_id, employee_id, employee_name, base_salary, overtime_amount, bonus_amount, gross_total',
    'staging.payroll_deductions|deduction_id, payroll_run_id, employee_id, deduction_type, deduction_amount',
    'staging.payroll_taxes_withheld|tax_id, payroll_run_id, employee_id, jurisdiction_name, tax_type, tax_amount',
    'staging.payroll_benefits_enrollments|enrollment_id, employee_id, plan_name, coverage_level, effective_date, employee_cost, employer_cost',
    'staging.payroll_bonus_payments|bonus_id, employee_id, bonus_type, award_date, bonus_amount, approver_name',
    'staging.payroll_timesheets_wide|timesheet_id, employee_id, work_date, project_name, regular_hours, overtime_hours, approved_date',
    'staging.payroll_bank_transfers|transfer_id, payroll_run_id, employee_id, bank_name, transfer_date, transfer_amount, transfer_status',

    -- ===== staging: finance =====
    'staging.finance_gl_entries_wide|gl_entry_id, posting_date, account_code, account_name, cost_center_name, department_name, debit_amount, credit_amount, currency_code, memo_text',
    'staging.finance_chart_of_accounts|account_id, account_code, account_name, account_type, parent_account_code, is_active',
    'staging.finance_accounts_payable|payable_id, vendor_name, bill_number, bill_date, due_date, bill_status, bill_total, paid_amount',
    'staging.finance_accounts_receivable|receivable_id, customer_name, invoice_number, invoice_date, due_date, receivable_status, invoice_total, open_balance',
    'staging.finance_budgets_wide|budget_id, fiscal_year:integer, department_name, account_name, budget_period, budget_amount',
    'staging.finance_forecasts_wide|forecast_id, forecast_version, department_name, account_name, forecast_period, forecast_amount',
    'staging.finance_expense_reports|expense_report_id, employee_name, submitted_date, expense_category, merchant_name, expense_amount, report_status',
    'staging.finance_cost_center_allocations|allocation_id, cost_center_name, department_name, allocation_period, allocation_pct, allocated_amount',
    'staging.finance_fx_rates_daily|fx_rate_id, rate_date, from_currency_code, to_currency_code, exchange_rate',
    'staging.finance_fixed_assets|asset_id, asset_name, asset_class, purchase_date, purchase_cost, depreciation_method, accumulated_depreciation_amount, net_book_value',

    -- ===== staging: inventory =====
    'staging.inventory_stock_levels|stock_level_id, snapshot_date, warehouse_name, product_name, on_hand_quantity, reserved_quantity, reorder_point_quantity',
    'staging.inventory_movements_wide|movement_id, movement_date, warehouse_name, product_name, movement_type, quantity, reference_number, unit_cost',
    'staging.inventory_warehouses_wide|warehouse_id, warehouse_name, city_name, country_name, region_name, capacity_units:integer, is_active',
    'staging.inventory_products_wide|product_id, sku_code, product_name, category_name, brand_name, supplier_name, unit_cost, list_price, is_discontinued',
    'staging.inventory_suppliers_wide|supplier_id, supplier_name, contact_name, country_name, payment_terms, lead_time_days, rating_score',
    'staging.inventory_purchase_orders_wide|purchase_order_id, order_date, supplier_name, buyer_name, expected_date, order_status, total_amount',
    'staging.inventory_purchase_order_lines|purchase_order_line_id, purchase_order_id, product_name, quantity, unit_cost, line_total',
    'staging.inventory_receipts_wide|receipt_id, purchase_order_id, received_date, warehouse_name, product_name, received_quantity, damaged_quantity',
    'staging.inventory_shipments_wide|shipment_id, order_id, shipped_date, warehouse_name, carrier_name, tracking_number, shipment_status, freight_cost',
    'staging.inventory_cycle_counts|cycle_count_id, count_date, warehouse_name, product_name, expected_quantity, counted_quantity, variance_quantity',

    -- ===== analytics: dimensions =====
    'analytics.dim_date|date_key, calendar_date, day_name, day_of_week:integer, week_of_year:integer, month_number:integer, month_name, quarter_number:integer, calendar_year:integer, is_weekend, is_holiday',
    'analytics.dim_product|product_key, sku_code, product_name, category_name, subcategory_name, brand_name, unit_cost, list_price, is_discontinued',
    'analytics.dim_region|region_key, region_name, country_name, continent_name',
    'analytics.dim_customer|customer_key, customer_name, segment_name, industry_name, region_key, first_order_date, is_active',
    'analytics.dim_person|person_key, full_name, email, job_title, department_key, manager_person_key, hire_date, termination_date, employment_type, is_active',
    'analytics.dim_department|department_key, department_name, function_name',
    'analytics.dim_position|position_key, job_title, job_level, job_family, min_salary, max_salary',
    'analytics.dim_channel|channel_key, channel_name, channel_group',
    'analytics.dim_campaign|campaign_key, campaign_name, channel_key, objective_name, start_date, end_date, budget_amount',
    'analytics.dim_supplier|supplier_key, supplier_name, country_name, payment_terms, lead_time_days, rating_score',
    'analytics.dim_warehouse|warehouse_key, warehouse_name, city_name, region_key, capacity_units:integer',
    'analytics.dim_currency|currency_key, currency_code, currency_name',
    'analytics.dim_account|account_key, account_code, account_name, account_type, parent_account_key',
    'analytics.dim_cost_center|cost_center_key, cost_center_code, cost_center_name, department_key',
    'analytics.dim_location|location_key, location_name, city_name, region_key, is_remote',
    'analytics.dim_promotion|promotion_key, promotion_name, promotion_type, start_date, end_date, discount_pct',

    -- ===== analytics: facts =====
    'analytics.fct_sales|sales_key, date_key, product_key, customer_key, region_key, channel_key, promotion_key, salesperson_person_key, quantity, gross_amount, discount_amount, net_amount, cost_amount, margin_amount',
    'analytics.fct_order_lines|order_line_key, order_id, date_key, product_key, customer_key, quantity, unit_price, line_total',
    'analytics.fct_sales_returns|return_key, date_key, product_key, customer_key, return_reason, quantity, refund_amount',
    'analytics.fct_sales_pipeline|pipeline_key, snapshot_date_key, customer_key, owner_person_key, stage_name, expected_amount, probability_pct',
    'analytics.fct_marketing_spend|spend_key, date_key, campaign_key, channel_key, impressions:integer, clicks:integer, spend_amount',
    'analytics.fct_web_sessions|session_key, date_key, campaign_key, region_key, device_type, page_count:integer, session_seconds:integer, is_bounce',
    'analytics.fct_campaign_performance|performance_key, date_key, campaign_key, leads_count, opportunities_count, revenue_amount, cost_amount',
    'analytics.fct_lead_conversions|conversion_key, date_key, campaign_key, first_touch_channel_key, last_touch_channel_key, deal_amount, convert_days',
    'analytics.fct_recruitment|recruitment_key, application_date_key, position_key, department_key, source_name, stage_name, stage_days, is_hired, offer_amount',
    'analytics.fct_retention|retention_key, snapshot_date_key, department_key, location_key, headcount_count, hires_count, exits_count, retention_rate',
    'analytics.fct_attrition|attrition_key, termination_date_key, person_key, department_key, termination_type, reason_name, tenure_days, is_regretted',
    'analytics.fct_productivity|productivity_key, date_key, person_key, department_key, tasks_completed_count, billable_hours, utilization_rate, output_score',
    'analytics.fct_payroll|payroll_key, pay_date_key, person_key, department_key, gross_amount, tax_amount, deduction_amount, net_amount',
    'analytics.fct_timesheets|timesheet_key, work_date_key, person_key, department_key, regular_hours, overtime_hours',
    'analytics.fct_gl_entries|gl_entry_key, posting_date_key, account_key, cost_center_key, currency_key, debit_amount, credit_amount',
    'analytics.fct_invoices|invoice_key, invoice_date_key, due_date_key, customer_key, currency_key, invoice_total, paid_amount, open_balance',
    'analytics.fct_budget_vs_actual|budget_actual_key, month_date_key, department_key, account_key, budget_amount, actual_amount, variance_amount',
    'analytics.fct_inventory_snapshot|snapshot_key, snapshot_date_key, product_key, warehouse_key, on_hand_quantity, reserved_quantity, inventory_value',
    'analytics.fct_inventory_movements|movement_key, date_key, product_key, warehouse_key, movement_type, quantity, unit_cost',
    'analytics.fct_purchase_orders|purchase_order_key, order_date_key, supplier_key, product_key, warehouse_key, quantity, unit_cost, line_total'
  ];
  spec text;
  table_ref text;
  schema_part text;
  table_part text;
  col text;
  col_name text;
  col_type text;
  defs text;
  position_in_table int;
begin
  foreach spec in array specs loop
    table_ref := split_part(spec, '|', 1);
    schema_part := split_part(table_ref, '.', 1);
    table_part := split_part(table_ref, '.', 2);
    defs := '';
    position_in_table := 0;

    foreach col in array string_to_array(split_part(spec, '|', 2), ',') loop
      col := trim(col);
      col_name := split_part(col, ':', 1);
      col_type := case
        when position(':' in col) > 0 then split_part(col, ':', 2)
        else pg_temp.col_type(col_name)
      end;
      defs := defs
        || case when position_in_table = 0 then '' else ', ' end
        || format('%I %s', col_name, col_type)
        || case when position_in_table = 0 then ' primary key' else '' end;
      position_in_table := position_in_table + 1;
    end loop;

    execute format('create table %I.%I (%s)', schema_part, table_part, defs);
  end loop;
end
$$;

-- ===== Small reference dimensions, filled in so the warehouse isn't entirely empty =====

insert into analytics.dim_date
select
  to_char(day, 'YYYYMMDD')::bigint,
  day,
  trim(to_char(day, 'Day')),
  extract(isodow from day),
  extract(week from day),
  extract(month from day),
  trim(to_char(day, 'Month')),
  extract(quarter from day),
  extract(year from day),
  extract(isodow from day) >= 6,
  false
from generate_series('2023-01-01'::date, '2026-12-31'::date, interval '1 day') as day;

insert into analytics.dim_region values
  (1, 'US West', 'United States', 'North America'),
  (2, 'US East', 'United States', 'North America'),
  (3, 'Canada', 'Canada', 'North America'),
  (4, 'UK and Ireland', 'United Kingdom', 'Europe'),
  (5, 'DACH', 'Germany', 'Europe'),
  (6, 'France', 'France', 'Europe'),
  (7, 'Australia and New Zealand', 'Australia', 'Oceania'),
  (8, 'Japan', 'Japan', 'Asia'),
  (9, 'India', 'India', 'Asia'),
  (10, 'Brazil', 'Brazil', 'South America');

insert into analytics.dim_department values
  (1, 'Sales', 'Revenue'),
  (2, 'Marketing', 'Revenue'),
  (3, 'Customer Success', 'Revenue'),
  (4, 'Engineering', 'Product'),
  (5, 'Product', 'Product'),
  (6, 'Finance', 'General and Administrative'),
  (7, 'People', 'General and Administrative'),
  (8, 'Legal', 'General and Administrative'),
  (9, 'Operations', 'Operations'),
  (10, 'Supply Chain', 'Operations');

insert into analytics.dim_currency values
  (1, 'USD', 'US Dollar'),
  (2, 'EUR', 'Euro'),
  (3, 'GBP', 'British Pound'),
  (4, 'CAD', 'Canadian Dollar'),
  (5, 'AUD', 'Australian Dollar'),
  (6, 'JPY', 'Japanese Yen'),
  (7, 'INR', 'Indian Rupee'),
  (8, 'BRL', 'Brazilian Real');

insert into analytics.dim_channel values
  (1, 'Direct Sales', 'Direct'),
  (2, 'Partner', 'Indirect'),
  (3, 'Web Store', 'Online'),
  (4, 'Marketplace', 'Online'),
  (5, 'Retail', 'Offline');

-- ===== Demo rows for the row security tab =====
-- About 200 orders spread over the regions in dim_region, and 60 employees spread over the
-- departments in dim_department, so a row policy visibly changes what a role sees.

insert into staging.sales_orders_wide
select
  n,
  date '2024-01-01' + (n * 5 % 700),
  1000 + n % 40,
  'Customer ' || (1000 + n % 40),
  (array['Enterprise', 'Mid-market', 'Small business'])[1 + n % 3],
  r.region_name,
  r.country_name,
  (array['Ava Brooks', 'Liam Chen', 'Noor Haddad', 'Sofia Reyes', 'Ken Ito'])[1 + n % 5],
  (select channel_name from analytics.dim_channel where channel_key = 1 + n % 5),
  (array['Completed', 'Completed', 'Completed', 'Pending', 'Cancelled'])[1 + n % 5],
  'USD',
  (subtotal)::numeric(14,2),
  (subtotal * 0.05)::numeric(14,2),
  (subtotal * 0.08)::numeric(14,2),
  (subtotal * 1.03)::numeric(14,2)
from generate_series(1, 200) n
join analytics.dim_region r on r.region_key = 1 + n % 10
cross join lateral (select 100 + (n * 37 % 900) as subtotal) s;

insert into staging.hr_employees_wide
select
  n,
  'Employee ' || n,
  'employee' || n || '@example.com',
  date '2018-01-01' + (n * 53 % 2500),
  (array['Analyst', 'Manager', 'Specialist', 'Director', 'Associate'])[1 + n % 5],
  d.department_name,
  'Manager ' || (1 + n % 8),
  (array['Remote', 'New York', 'London', 'Berlin'])[1 + n % 4],
  (array['Full time', 'Full time', 'Part time', 'Contractor'])[1 + n % 4],
  n % 9 <> 0
from generate_series(1, 60) n
join analytics.dim_department d on d.department_key = 1 + n % 10;
