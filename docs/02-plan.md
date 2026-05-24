# Personal Life OS Dashboard Implementation Plan

## 1. Planning Basis

This plan is based on:

- `docs/01-prd.md`
- Current implementation state: Next.js `15.5.18`, App Router, Tailwind CSS, ECharts, local CSV ingestion
- Context7 documentation checks for Next.js App Router, Supabase SSR, and Supabase CLI
- Current environment keys:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `OPENAI_API_KEY`
  - `OPENAI_MODEL`
  - `OPENAI_REASONING_EFFORT`

Supabase-specific MCP database inspection is not currently available in this session. When available, use it to inspect remote schema, RLS policies, migrations, and existing data before applying DB changes.

## 2. Product North Star

The first screen must let the user understand the whole life state within 5 seconds:

- Health status
- Net worth state
- Spending risk
- Investment position
- Retirement readiness
- Tax timeline
- Alerts and anomalies
- Long-term trends

The landing page must remain a no-scroll, high-density executive dashboard.

## 3. Phase 0: Foundation Cleanup

Goal: make the current local CSV dashboard ready for Supabase, auth, and future drill-down routes without breaking the existing overview.

Tasks:

1. Add Supabase runtime package:
   - `@supabase/ssr`
2. Add Supabase clients:
   - `lib/supabase/browser.ts`
   - `lib/supabase/server.ts`
   - `lib/supabase/admin.ts`
3. Add `middleware.ts` for Supabase SSR cookie refresh.
4. Add environment validation:
   - public URL/anon key for browser and server clients
   - service role key only for server/admin code
5. Keep current CSV data loader working as the fallback source.
6. Introduce a dashboard data adapter boundary:
   - `lib/dashboard-data/csv-source.ts`
   - `lib/dashboard-data/supabase-source.ts`
   - `lib/dashboard-data/types.ts`

Deliverables:

- Supabase client utilities
- env validation utility
- dashboard data source interface
- unchanged visual behavior on `/`

Validation:

```powershell
npm run typecheck
npm run lint
npm run build
npm audit --audit-level=moderate
```

## 4. Phase 1: Database Design And Migration

Goal: define the first Supabase schema that can store the current CSV data and support the PRD architecture.

Recommended tables:

- `profiles`
- `family_memberships`
- `raw_import_batches`
- `raw_import_rows`
- `health_key_metrics`
- `health_checkup_metrics`
- `health_findings_actions`
- `networth_snapshot`
- `investment_holdings`
- `pension_cashflow`
- `tax_history`
- `spending_ledger`
- `alerts`
- `ai_insights`

RBAC concepts:

- `USER_JH`
- `USER_YR`
- `FAMILY_COMBINED`

Default visibility:

- Health: individual
- Assets: family combined
- Spending: family combined
- Investment: family combined

Tasks:

1. Initialize Supabase project config:
   - `supabase init`
2. If a remote project exists, link it:
   - `supabase link --project-ref <project-ref>`
3. If remote DB already has schema, pull before writing migrations:
   - `supabase db pull`
4. Create initial migration for core tables and indexes.
5. Add RLS policies for profile and family scoped access.
6. Add TypeScript DB type generation:
   - `supabase gen types typescript`

Deliverables:

- `supabase/migrations/*_initial_schema.sql`
- `lib/supabase/database.types.ts`
- documented table ownership and RLS assumptions

Validation:

- Migration applies locally
- Generated types compile
- service role is never used in client components

## 5. Phase 2: Data Pipeline And Import

Goal: move from direct CSV reads to auditable, repeatable data ingestion.

Tasks:

1. Create import pipeline for existing files in `data/`.
2. Store every import operation in `raw_import_batches`.
3. Store raw rows in `raw_import_rows` for reprocessing.
4. Transform raw rows into typed domain tables.
5. Add idempotency keys:
   - spending: `transaction_hash = date + amount + card_company + approval_no`
   - health daily summary: `kst_date`
   - health checkup: `year + metric_id + date`
   - finance snapshot: `metric + date_or_scenario`
   - investment holding: `account + instrument + source_batch_id`
6. Add validation output:
   - missing required columns
   - failed numeric parsing
   - duplicate rows
   - unknown categories

Deliverables:

- import scripts or server actions
- validation report structure
- seeded Supabase tables from current CSV files

Validation:

- repeated import does not duplicate rows
- current dashboard numbers match pre-Supabase CSV output

## 6. Phase 3: Overview Upgrade

Goal: turn the current visual prototype into the first production-grade overview.

Tasks:

1. Switch `/` data source to Supabase with CSV fallback.
2. Add Family/JH/YR segmented toggle.
3. Extract Life Score calculation:
   - `lib/scoring/health-score.ts`
   - `lib/scoring/finance-score.ts`
   - `lib/scoring/life-risk.ts`
4. Add alert rules:
   - BMI and metabolic risk
   - fasting glucose trend
   - net worth growth vs health deterioration
   - tax spike
   - investment concentration
5. Add ECharts axisPointer synchronization.
6. Replace Spending placeholder with real `spending_ledger` when available.

Deliverables:

- DB-backed overview
- role/view toggle
- first alert engine
- synchronized chart interactions

Validation:

- no-scroll overview at 1920x1080 and tablet landscape
- browser check: charts render, no runtime error overlay, no visible overlap

## 7. Phase 4: Drill-Down Routes

Goal: make every overview zone clickable and useful.

Routes:

- `/health`
- `/finance`
- `/investment`
- `/spending`
- `/retirement`
- `/tax`
- `/analytics`
- `/ai-insight`
- `/data-center`

Route priorities:

1. `/data-center`: upload, validation, import history, source status
2. `/health`: long-term health metrics, findings, action tracking
3. `/finance`: net worth, debt, assets, salary/tax overview
4. `/investment`: holdings, returns, allocation, concentration
5. `/retirement`: pension cashflow and gap analysis
6. `/tax`: year/type trends and payment history
7. `/spending`: manual ledger and category dashboard
8. `/ai-insight`: generated summaries and anomaly explanations

Deliverables:

- route shells
- shared dashboard layout/navigation
- first meaningful drill-down per domain

## 8. Phase 5: AI Insight

Goal: make AI useful without leaking secrets or bypassing privacy controls.

Tasks:

1. Add server-only OpenAI client.
2. Add AI insight route handler or server action.
3. Persist outputs in `ai_insights`.
4. Generate weekly and monthly summaries.
5. Add anomaly explanation prompts using sanitized derived metrics.
6. Add user approval before sending sensitive raw data to any external model.

Insight examples:

- net worth is growing, but metabolic risk is increasing
- tax payments spiked in a specific year
- investment portfolio is concentrated in a few ETFs
- pension cashflow gap appears before or after age 65

Deliverables:

- AI summary generation
- persisted insight history
- privacy-aware prompt boundary

## 9. Phase 6: PWA And Samsung Ecosystem

Goal: make the dashboard feel native on Galaxy devices.

Tasks:

1. Add PWA manifest and icons.
2. Add service worker/caching strategy.
3. Cache latest dashboard snapshot in IndexedDB.
4. Add background refresh behavior.
5. Prepare Samsung Health import/sync adapter boundary.

Deliverables:

- installable PWA
- fast offline-ish dashboard boot
- sync status UI

## 10. Additional Ideas

### Life Risk Timeline

Create a timeline that overlays health, finance, investment, spending, tax, and retirement events. This can become the main executive analysis view.

### Data Trust Score

Add a score per domain:

- Health data freshness
- Finance data freshness
- Spending ledger completeness
- Investment source freshness
- Tax history completeness

This makes missing data visible instead of quietly weakening the dashboard.

### Raw Import Preservation

Keep raw imported rows even after transforming them. This allows parser improvements, reprocessing, and auditability.

### Scenario Mode

Add future scenario views:

- current path
- conservative retirement
- aggressive investment
- health improvement target
- reduced spending target

### Personal Operating Cadence

Add weekly/monthly review modes:

- weekly health review
- monthly finance close
- quarterly tax/investment review
- yearly retirement check

## 11. Immediate Next Step

Recommended next implementation task:

1. Install `@supabase/ssr`.
2. Add Supabase client utilities and env validation.
3. Add initial Supabase schema migration for current CSV-backed domains.
4. Generate database types.
5. Keep the current dashboard visually unchanged while preparing the DB-backed source.
