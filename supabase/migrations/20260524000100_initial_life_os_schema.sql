create extension if not exists pgcrypto;

create type public.life_os_scope as enum ('USER_JH', 'USER_YR', 'FAMILY_COMBINED');
create type public.import_status as enum ('pending', 'validated', 'imported', 'failed');
create type public.alert_severity as enum ('low', 'moderate', 'high', 'critical');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  life_os_scope public.life_os_scope not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.family_memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  family_scope public.life_os_scope not null default 'FAMILY_COMBINED',
  role text not null default 'member',
  created_at timestamptz not null default now(),
  unique (user_id, family_scope)
);

create table public.raw_import_batches (
  id uuid primary key default gen_random_uuid(),
  source_name text not null,
  source_kind text not null,
  source_file_name text,
  source_hash text,
  status public.import_status not null default 'pending',
  row_count integer not null default 0,
  error_count integer not null default 0,
  imported_by uuid references public.profiles(id) on delete set null,
  imported_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  unique nulls not distinct (source_name, source_hash)
);

create table public.raw_import_rows (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references public.raw_import_batches(id) on delete cascade,
  row_number integer not null,
  row_data jsonb not null,
  row_hash text not null,
  validation_errors jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  unique (batch_id, row_hash)
);

create table public.health_key_metrics (
  id uuid primary key default gen_random_uuid(),
  owner_scope public.life_os_scope not null default 'USER_JH',
  year integer not null,
  metric_id text not null,
  metric_label text not null,
  value_text text,
  value_numeric numeric,
  unit text,
  source text,
  note text,
  batch_id uuid references public.raw_import_batches(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (owner_scope, year, metric_id)
);

create table public.health_checkup_metrics (
  id uuid primary key default gen_random_uuid(),
  owner_scope public.life_os_scope not null default 'USER_JH',
  category text,
  metric_id text not null,
  metric_label text not null,
  measured_date date,
  year integer not null,
  value_text text,
  value_numeric numeric,
  reference_range text,
  source text,
  batch_id uuid references public.raw_import_batches(id) on delete set null,
  created_at timestamptz not null default now(),
  unique nulls not distinct (owner_scope, year, metric_id, measured_date)
);

create table public.health_findings_actions (
  id uuid primary key default gen_random_uuid(),
  owner_scope public.life_os_scope not null default 'USER_JH',
  year integer not null,
  category text not null,
  item text not null,
  status_or_value text,
  dashboard_note text,
  source text,
  batch_id uuid references public.raw_import_batches(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (owner_scope, year, category, item)
);

create table public.networth_snapshot (
  id uuid primary key default gen_random_uuid(),
  owner_scope public.life_os_scope not null default 'FAMILY_COMBINED',
  metric text not null,
  date_or_scenario text not null,
  value_krw numeric,
  value_text text,
  source text,
  batch_id uuid references public.raw_import_batches(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (owner_scope, metric, date_or_scenario)
);

create table public.investment_holdings (
  id uuid primary key default gen_random_uuid(),
  owner_scope public.life_os_scope not null default 'FAMILY_COMBINED',
  account text,
  instrument text not null,
  cost_krw numeric,
  market_value_krw numeric,
  gain_loss_krw numeric,
  return_pct numeric,
  source text,
  batch_id uuid references public.raw_import_batches(id) on delete set null,
  created_at timestamptz not null default now(),
  unique nulls not distinct (owner_scope, account, instrument, batch_id)
);

create table public.pension_cashflow (
  id uuid primary key default gen_random_uuid(),
  owner_scope public.life_os_scope not null default 'FAMILY_COMBINED',
  year integer not null,
  age integer,
  category text,
  institution text,
  product text not null,
  annual_amount_thousand_krw numeric not null default 0,
  source text,
  batch_id uuid references public.raw_import_batches(id) on delete set null,
  created_at timestamptz not null default now(),
  unique nulls not distinct (owner_scope, year, category, institution, product)
);

create table public.tax_history (
  id uuid primary key default gen_random_uuid(),
  owner_scope public.life_os_scope not null default 'FAMILY_COMBINED',
  tax_year integer not null,
  tax_type text not null,
  amount_krw numeric not null default 0,
  source text,
  batch_id uuid references public.raw_import_batches(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (owner_scope, tax_year, tax_type)
);

create table public.spending_ledger (
  id uuid primary key default gen_random_uuid(),
  owner_scope public.life_os_scope not null default 'FAMILY_COMBINED',
  transaction_at timestamptz not null,
  card_company text,
  category text not null,
  amount_krw numeric not null,
  memo text,
  approval_no text,
  transaction_hash text not null,
  source text,
  batch_id uuid references public.raw_import_batches(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (transaction_hash)
);

create table public.alerts (
  id uuid primary key default gen_random_uuid(),
  owner_scope public.life_os_scope not null default 'FAMILY_COMBINED',
  domain text not null,
  severity public.alert_severity not null,
  title text not null,
  body text,
  signal_date date,
  status text not null default 'open',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.ai_insights (
  id uuid primary key default gen_random_uuid(),
  owner_scope public.life_os_scope not null default 'FAMILY_COMBINED',
  insight_kind text not null,
  title text not null,
  markdown text not null,
  model text,
  input_summary jsonb not null default '{}'::jsonb,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger set_spending_ledger_updated_at
before update on public.spending_ledger
for each row execute function public.set_updated_at();

create trigger set_alerts_updated_at
before update on public.alerts
for each row execute function public.set_updated_at();

create index health_key_metrics_metric_year_idx on public.health_key_metrics (metric_id, year);
create index health_checkup_metrics_metric_year_idx on public.health_checkup_metrics (metric_id, year);
create index networth_snapshot_metric_idx on public.networth_snapshot (metric);
create index investment_holdings_value_idx on public.investment_holdings (market_value_krw desc);
create index pension_cashflow_year_idx on public.pension_cashflow (year);
create index tax_history_year_idx on public.tax_history (tax_year);
create index spending_ledger_transaction_at_idx on public.spending_ledger (transaction_at desc);
create index alerts_status_severity_idx on public.alerts (status, severity);
create index ai_insights_created_at_idx on public.ai_insights (created_at desc);

alter table public.profiles enable row level security;
alter table public.family_memberships enable row level security;
alter table public.raw_import_batches enable row level security;
alter table public.raw_import_rows enable row level security;
alter table public.health_key_metrics enable row level security;
alter table public.health_checkup_metrics enable row level security;
alter table public.health_findings_actions enable row level security;
alter table public.networth_snapshot enable row level security;
alter table public.investment_holdings enable row level security;
alter table public.pension_cashflow enable row level security;
alter table public.tax_history enable row level security;
alter table public.spending_ledger enable row level security;
alter table public.alerts enable row level security;
alter table public.ai_insights enable row level security;

create policy "Users can read own profile"
on public.profiles for select
to authenticated
using (id = auth.uid());

create policy "Users can read own memberships"
on public.family_memberships for select
to authenticated
using (user_id = auth.uid());

create policy "Authenticated users can read shared dashboard data"
on public.health_key_metrics for select
to authenticated
using (true);

create policy "Authenticated users can read health checkup data"
on public.health_checkup_metrics for select
to authenticated
using (true);

create policy "Authenticated users can read health action data"
on public.health_findings_actions for select
to authenticated
using (true);

create policy "Authenticated users can read net worth data"
on public.networth_snapshot for select
to authenticated
using (true);

create policy "Authenticated users can read investment data"
on public.investment_holdings for select
to authenticated
using (true);

create policy "Authenticated users can read pension data"
on public.pension_cashflow for select
to authenticated
using (true);

create policy "Authenticated users can read tax data"
on public.tax_history for select
to authenticated
using (true);

create policy "Authenticated users can read spending data"
on public.spending_ledger for select
to authenticated
using (true);

create policy "Authenticated users can read alerts"
on public.alerts for select
to authenticated
using (true);

create policy "Authenticated users can read ai insights"
on public.ai_insights for select
to authenticated
using (true);
