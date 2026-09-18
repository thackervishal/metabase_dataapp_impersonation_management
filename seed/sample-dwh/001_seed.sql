-- Sample warehouse content: the "real" data an RBAC demo grants access to.
-- Not Metabase's own metadata -- this is the target database the data app manages.

create schema if not exists analytics;
create schema if not exists sales;

create table analytics.events (
  id serial primary key,
  event_name text not null,
  user_id int not null,
  occurred_at timestamptz not null,
  properties jsonb
);

insert into analytics.events (event_name, user_id, occurred_at, properties)
select
  (array['page_view','signup','purchase','logout'])[1 + (n % 4)],
  1 + (n % 8),
  now() - (n || ' hours')::interval,
  jsonb_build_object('n', n)
from generate_series(1, 20) as n;

create table analytics.daily_metrics (
  id serial primary key,
  metric_date date not null,
  metric_name text not null,
  metric_value numeric not null
);

insert into analytics.daily_metrics (metric_date, metric_name, metric_value)
select
  current_date - (n || ' days')::interval,
  'active_users',
  100 + (n * 3)
from generate_series(1, 15) as n;

create table sales.customers (
  id serial primary key,
  name text not null,
  email text not null,
  region text not null,
  created_at timestamptz not null default now()
);

insert into sales.customers (name, email, region)
select
  'Customer ' || n,
  'customer' || n || '@example.com',
  (array['NA','EU','APAC'])[1 + (n % 3)]
from generate_series(1, 10) as n;

create table sales.orders (
  id serial primary key,
  customer_id int not null references sales.customers(id),
  order_total numeric not null,
  status text not null,
  ordered_at timestamptz not null default now()
);

insert into sales.orders (customer_id, order_total, status, ordered_at)
select
  1 + (n % 10),
  round((50 + (n * 7.5))::numeric, 2),
  (array['paid','pending','refunded'])[1 + (n % 3)],
  now() - (n || ' days')::interval
from generate_series(1, 20) as n;

create table sales.order_items (
  id serial primary key,
  order_id int not null references sales.orders(id),
  sku text not null,
  quantity int not null,
  unit_price numeric not null
);

insert into sales.order_items (order_id, sku, quantity, unit_price)
select
  1 + (n % 20),
  'SKU-' || (100 + (n % 15)),
  1 + (n % 5),
  round((5 + (n % 20) * 1.5)::numeric, 2)
from generate_series(1, 30) as n;
