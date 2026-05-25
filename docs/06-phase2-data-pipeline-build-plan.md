# Phase 2 Data Pipeline And Import Build Plan

## 1. Goal

Move from direct local CSV reads to auditable, repeatable Supabase ingestion while preserving local CSV fallback.

Phase 2 is complete when current local data can be imported into Supabase repeatedly without duplicates, and the dashboard can read the imported data.

## 1.1 Current Status

Completed for the first dashboard-critical slice:

- `scripts/import-local-data.ts`
- `npm run import:data`
- `lib/import/types.ts`
- `lib/import/schemas.ts`
- `lib/import/raw-batch.ts`
- `lib/import/transformers.ts`
- `lib/import/report.ts`

Imported files:

- `health_key_yearly_metrics.csv`
- `health_detailed_2024_2026_metrics.csv`
- `health_findings_actions.csv`
- `finance_net_worth_snapshot.csv`
- `finance_investment_holdings.csv`
- `finance_pension_cashflow_by_year.csv`
- `finance_tax_by_year_type.csv`

Latest validation:

- latest expanded import: 7 files, 661 raw rows, 661 domain rows, 0 validation errors
- repeated expanded import: 7 files, 0 new raw rows, 661 domain upserts, 0 validation errors
- Supabase REST checks returned 200 for raw batches and dashboard domain tables

Analysis:

- Raw import preservation is working.
- Domain upserts are stable for the dashboard-critical tables and detailed health checkup metrics.
- Supplemental finance files are now read into typed dashboard data for visibility, but still need dedicated Supabase transforms before Phase 2 can be considered fully complete.

## 2. Source Files

Current private local sources:

- `data/health_key_yearly_metrics.csv`
- `data/health_detailed_2024_2026_metrics.csv`
- `data/health_findings_actions.csv`
- `data/finance_net_worth_snapshot.csv`
- `data/finance_pension_cashflow_by_year.csv`
- `data/finance_pension_products.csv`
- `data/finance_salary_tax_yearly.csv`
- `data/finance_tax_by_year_type.csv`
- `data/finance_tax_payments.csv`
- `data/finance_debt_loan_snapshot.csv`
- `data/finance_investment_holdings.csv`

These files remain gitignored.

## 3. Build Steps

### Step 1: Import Types

Create import domain definitions:

```text
lib/import/types.ts
lib/import/schemas.ts
```

Define:

- file kind
- required columns
- target table
- row hash strategy
- transform function name

Status: completed for the initial dashboard-critical slice.

### Step 2: Raw Import Batch Writer

Create:

```text
lib/import/raw-batch.ts
```

Responsibilities:

- calculate source hash
- insert or reuse `raw_import_batches`
- insert raw rows into `raw_import_rows`
- store validation errors

Status: completed. Duplicate raw rows are ignored by `batch_id,row_hash`.

### Step 3: Domain Transformers

Create:

```text
lib/import/transformers/
  health.ts
  finance.ts
  investment.ts
  pension.ts
  tax.ts
  spending.ts
```

Each transformer should:

- validate required columns
- normalize numeric values
- normalize dates/years
- assign `owner_scope`
- preserve `source`
- upsert into target table

Status: completed for health key metrics, health findings/actions, net worth, investment holdings, pension cashflow, and tax history.

Supplemental visibility status:

- `finance_pension_products.csv`: visible in `/finance`, Supabase transform pending
- `finance_salary_tax_yearly.csv`: visible in `/finance`, Supabase transform pending
- `finance_salary_takehome_scenarios.csv`: visible in `/finance`, Supabase transform pending
- `finance_tax_payments.csv`: visible in `/finance`, Supabase transform pending
- `finance_debt_loan_snapshot.csv`: visible in `/finance`, Supabase transform pending

### Step 4: Idempotency Keys

Use deterministic keys:

- health key metric: `owner_scope + year + metric_id`
- health checkup metric: `owner_scope + year + metric_id + measured_date`
- health action: `owner_scope + year + category + item`
- net worth: `owner_scope + metric + date_or_scenario`
- investment holding: `owner_scope + account + instrument + batch_id`
- pension cashflow: `owner_scope + year + category + institution + product`
- tax history: `owner_scope + tax_year + tax_type`
- spending ledger: `transaction_hash`

### Step 5: Import Execution Surface

Start with a script, not UI:

```text
scripts/import-local-data.ts
```

Command target:

```powershell
npm run import:data
```

The script should:

- read private local files
- import raw batches
- transform to domain tables
- print safe summary only

Do not print private row values.

Status: completed. The command prints only aggregate safe summaries.

### Step 6: Validation Report

Create a structured report:

```text
lib/import/report.ts
```

Report:

- files processed
- raw rows
- inserted rows
- updated rows
- skipped rows
- duplicate rows
- validation errors by file

Status: completed for command-line summary output. Persisted validation reporting can be added in the Data Center phase.

### Step 7: Dashboard Source Verification

After import:

- dashboard should prefer Supabase source
- `Sync` label should show `Supabase`
- numbers should match CSV fallback

Status: completed for current overview data.

## 4. Deliverables

- import modules
- import script
- npm script
- import validation report
- Supabase tables populated from current local data
- docs updated with import status

## 5. Validation

Run import twice.

Expected:

- second run does not duplicate domain rows
- raw import batch is reused or duplicate-safe
- dashboard values remain stable

Commands:

```powershell
npm run import:data
npm run import:data
npm run typecheck
npm run lint
npm run build
```

Supabase:

```powershell
powershell -ExecutionPolicy Bypass -File C:\Users\user\.codex\skills\supabase-connect\scripts\verify-rest.ps1 -EnvPath .env -Tables raw_import_batches,health_key_metrics,networth_snapshot,investment_holdings,pension_cashflow,tax_history
```

## 6. Risks

- Source CSVs contain private data and must remain local.
- Numeric parsing can silently distort KRW values.
- Investment holdings imported by batch can duplicate if keys are too loose.
- Some source files are snapshots, not time-series histories.

## 7. Handoff To Phase 3

Phase 3 can begin when Supabase has enough data to power:

- Asset Zone composition
- pension timeline
- investment overview
- health priority panel
- health trend charts

Status: met for the first overview upgrade.
