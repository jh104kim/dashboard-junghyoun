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

- Asset Zone summary
- Health Zone summary
- Health status
- Net worth state
- Spending risk
- Investment position
- Retirement readiness
- Tax timeline
- Alerts and anomalies
- Long-term trends

The landing page must remain a no-scroll, high-density executive dashboard on desktop/tablet landscape. Rich tables and dense analysis should move to domain pages.

The target overview structure is now documented in `docs/04-overview-two-zone-dashboard.md`.

The next IA restructure is documented in `docs/11-dashboard-restructure-plan.md`.

Current restructure direction:

- Landing: executive cockpit for Life, Finance, Health, Activity, Travel, Learning, Data Trust, and next actions.
- Domain pages: rich charts, tables, and source-level detail.
- Desktop landing must avoid scroll and overlap.
- Mobile must remain readable, even if it scrolls.

## 3. Phase 0: Foundation Cleanup

Goal: make the current local CSV dashboard ready for Supabase, auth, and future drill-down routes without breaking the existing overview.

Detailed implementation plan: `docs/03-phase0-foundation.md`

Status:

- Supabase runtime, clients, middleware, env validation, migrations, and generated DB types are in place.
- Dashboard data adapters, Supabase source fallback, score extraction, and safe health-check route are implemented.
- Phase 0 is functionally complete for the initial adapter boundary. Future changes should preserve the source abstraction while Phase 2 imports data and Phase 3 redesigns the overview.

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
7. Extract score calculation:
   - `lib/scoring/life-score.ts`
8. Add safe Supabase status endpoint:
   - `app/api/health/supabase/route.ts`

Deliverables:

- Supabase client utilities
- env validation utility
- dashboard data source interface
- CSV/Supabase fallback source selector
- score calculation module
- safe Supabase health check endpoint
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

Detailed build plan: `docs/05-phase1-database-build-plan.md`

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

Detailed build plan: `docs/06-phase2-data-pipeline-build-plan.md`

Status:

- Initial local CSV import script is implemented with raw batch preservation and idempotent raw row writes.
- Current dashboard source CSV files were imported into Supabase.
- Re-running the import does not duplicate raw rows.
- Detailed 2024-2026 health checkup metrics are imported into `health_checkup_metrics`.
- `/` now reads Supabase data first and shows `Supabase` when remote dashboard tables contain data.

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

Detailed product/UI target: `docs/04-overview-two-zone-dashboard.md`

Detailed build plan: `docs/07-phase3-overview-build-plan.md`

Status:

- First two-zone overview is implemented on `/`.
- Asset Zone includes wealth composition, investment allocation, pension timeline, tax/action suggestions, and monthly 10M KRW target gap.
- Health Zone includes trend chart, priority tracking, anomaly markers, monitoring guidance, and care guidance.
- Browser verification confirms Asset Zone, Health Zone, Supabase source label, five chart canvases, and no page scroll at 1920x1080 and 1366x1024.

Tasks:

1. Switch `/` data source to Supabase with CSV fallback.
2. Add Family/JH/YR segmented toggle.
3. Redesign `/` around two primary zones:
   - Asset Zone
   - Health Zone
4. Add Asset Zone surfaces:
   - wealth composition pie/donut
   - asset class tabs
   - pension timeline by age
   - tax-saving/action ideas
   - monthly 10M KRW income target gap and suggestions
5. Add Health Zone surfaces:
   - current status
   - management priorities
   - detailed tracking tabs
   - anomaly markers
   - monitoring/action guidance
6. Extract Life Score calculation:
   - `lib/scoring/health-score.ts`
   - `lib/scoring/finance-score.ts`
   - `lib/scoring/life-risk.ts`
7. Add alert rules:
   - BMI and metabolic risk
   - fasting glucose trend
   - net worth growth vs health deterioration
   - tax spike
   - investment concentration
8. Add ECharts axisPointer synchronization.
9. Replace Spending placeholder with real `spending_ledger` when available.
10. Add cross-zone AI Executive Summary connecting asset condition and health risk.

Deliverables:

- DB-backed overview
- role/view toggle
- two-zone Asset/Health dashboard
- Asset Zone tabs and Health Zone tabs
- first alert engine
- synchronized chart interactions

Validation:

- no-scroll overview at 1920x1080 and tablet landscape
- browser check: charts render, no runtime error overlay, no visible overlap

## 7. Phase 4: Drill-Down Routes

Goal: make every overview zone clickable and useful.

Detailed build plan: `docs/08-phase4-drilldown-build-plan.md`

Status:

- First route-shell pass is implemented for `/data-center`, `/assets`, `/health`, `/finance`, `/investment`, `/retirement`, `/tax`, `/spending`, `/ai-insight`, and `/analytics`.
- Shared drill-down shell/navigation exists at `components/DomainShell.tsx`.
- Browser verification returned HTTP 200 for all current route shells.

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

Detailed build plan: `docs/09-phase5-ai-insight-build-plan.md`

Status:

- First deterministic AI Insight route shell is implemented.
- Overview and `/ai-insight` use derived dashboard metrics only.
- External AI generation and persistence remain planned for the next Phase 5 implementation step.

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

Detailed build plan: `docs/10-phase6-pwa-samsung-build-plan.md`

Status:

- First PWA manifest is implemented at `app/manifest.ts`.
- `/manifest.webmanifest` returned HTTP 200 in browser verification.
- Icons, service worker, IndexedDB snapshot cache, and Samsung Health adapter contract remain planned.

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

1. Rebuild landing as a cockpit according to `docs/11-dashboard-restructure-plan.md`.
2. Upgrade `/finance` and `/health` into true deep pages using the already extracted CSVs.
3. Add `/activity`, `/travel`, and `/learning` route surfaces for Obsidian/raw Life OS data.
4. Run Playwright quality checks for overlap, responsive readability, route health, and chart rendering.

## 12. Deployment Notes

Vercel deployment fix applied:

- Pages that read Supabase-backed dashboard data are marked `dynamic = "force-dynamic"` so Next.js does not try to collect live private data during static page generation.
- Middleware skips Supabase cookie refresh when public Supabase environment variables are not configured, preventing runtime crashes in incomplete preview environments.
- Vercel should still be configured with:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`

## 13. Restructure Status

First landing-plus-domain restructure pass is complete.

Delivered:

- cockpit-style landing page
- richer `/finance` dashboard
- richer `/health` dashboard
- new `/activity`, `/travel`, and `/learning` route shells
- senior UI/UX quality rules in `AGENTS.md`
- detailed restructure plan and QA record in `docs/11-dashboard-restructure-plan.md`

Latest validation:

- `npm run typecheck`: passed
- `npm run lint`: passed
- `npm run build`: passed
- `npm audit --audit-level=moderate`: 0 vulnerabilities
- Playwright: no overlap detected on checked routes and viewports

Next phase:

1. Normalize remaining finance CSVs into import/data loaders.
2. Build chart-backed Activity, Travel, and Learning dashboards.
3. Add health detailed checkup matrix, histogram, and category risk views.
