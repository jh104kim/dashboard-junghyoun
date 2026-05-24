# Phase 0 Foundation Cleanup Implementation Plan

## 1. Goal

Prepare the current CSV-backed overview dashboard for Supabase, auth, DB-backed data loading, and future drill-down routes without changing the visible behavior of `/`.

Phase 0 must also prepare data shapes for the future two-zone overview described in `docs/04-overview-two-zone-dashboard.md`.

The page should continue to work in three states:

1. Local private CSV files exist.
2. Supabase is connected but domain tables are empty.
3. CSV files are absent because `data/*` is gitignored in a fresh clone.

## 2. Current Status

Completed:

- `@supabase/ssr` installed.
- Supabase project linked and schema applied.
- Migration history repaired and aligned.
- Supabase clients created:
  - `lib/supabase/browser.ts`
  - `lib/supabase/server.ts`
  - `lib/supabase/admin.ts`
- Supabase middleware created:
  - `middleware.ts`
- env validation helper created:
  - `lib/env.ts`
- generated DB types:
  - `lib/supabase/database.types.ts`
- CSV missing-file fallback added in `lib/csv.ts`.
- Dashboard data adapters created:
  - `lib/dashboard-data/types.ts`
  - `lib/dashboard-data/csv-source.ts`
  - `lib/dashboard-data/supabase-source.ts`
  - `lib/dashboard-data/index.ts`
- Score calculation extracted:
  - `lib/scoring/life-score.ts`
- Safe Supabase health check route added:
  - `app/api/health/supabase/route.ts`
- Build/typecheck/lint currently pass.
- Browser verification currently confirms no scroll, charts render, and no Next.js runtime error overlay.

Still required:

- Keep docs updated as Phase 0 behavior changes.
- Preserve this adapter boundary during Phase 2 import and Phase 3 two-zone overview work.

## 3. Target File Structure

Create or update:

```text
lib/dashboard-data/
  index.ts
  types.ts
  csv-source.ts
  supabase-source.ts

lib/scoring/
  life-score.ts

app/api/health/supabase/
  route.ts
```

Deprecate the current monolithic file:

```text
lib/dashboard-data.ts
```

Final shape:

- imports should use `@/lib/dashboard-data`
- CSV logic should live in `csv-source.ts`
- Supabase logic should live in `supabase-source.ts`
- shared return types should live in `types.ts`
- scoring should not be embedded in source adapters

## 4. Implementation Steps

### Step 1: Create Shared Types

Create `lib/dashboard-data/types.ts`.

Status: completed.

Types to define:

- `HealthSeries`
- `HealthAction`
- `FinanceSnapshot`
- `InvestmentHolding`
- `PensionPoint`
- `TaxPoint`
- `DashboardScores`
- `DashboardData`
- `DashboardSourceResult`

Important requirements:

- Keep the existing `DashboardData` shape compatible with `app/page.tsx`.
- Make source metadata explicit:
  - `source: "supabase" | "csv" | "empty"`
  - `generatedAt`
  - optional `warnings`

### Step 2: Extract Scoring

Create `lib/scoring/life-score.ts`.

Status: completed.

Move current score logic into:

```ts
calculateHealthScore(input)
calculateFinanceScore(input)
calculateLifeScore(input)
calculateDashboardScores(input)
```

Rules:

- Preserve current score outputs as much as possible.
- Avoid throwing on missing data.
- Never return `NaN`.
- Clamp scores to a useful range.

### Step 3: Move Current CSV Logic

Create `lib/dashboard-data/csv-source.ts`.

Status: completed.

Move current CSV reading and transformation from `lib/dashboard-data.ts`.

Rules:

- Keep Korean source labels.
- Handle missing files with empty arrays.
- Return `source: "csv"` when at least one useful source file has data.
- Return `source: "empty"` when no useful CSV data exists.
- Preserve the current dashboard values when private CSV files exist locally.

### Step 4: Add Supabase Source

Create `lib/dashboard-data/supabase-source.ts`.

Status: completed.

Read these tables:

- `health_key_metrics`
- `health_findings_actions`
- `networth_snapshot`
- `investment_holdings`
- `pension_cashflow`
- `tax_history`

Initial read strategy:

- Use `createAdminClient()` for server-side Phase 0 reads.
- Keep this file server-only by convention.
- Do not import it into Client Components.

Fallback logic:

- If env is missing, return `{ ok: false }`.
- If Supabase query fails, return `{ ok: false, warnings: [...] }`.
- If core tables are empty, return `{ ok: false, reason: "empty" }`.
- Do not throw unless the error indicates a programming bug.

### Step 5: Add Data Source Selector

Create `lib/dashboard-data/index.ts`.

Status: completed.

Export:

```ts
export async function getDashboardData(): Promise<DashboardData>
```

Selection policy:

1. Try Supabase source.
2. Use Supabase if it returns enough data.
3. Fall back to CSV.
4. If CSV is empty, return a stable empty dashboard state.

The existing page should continue importing `getDashboardData` with minimal change.

### Step 6: Add Supabase Health Check Route

Create:

```text
app/api/health/supabase/route.ts
```

Status: completed.

Return only safe status metadata:

```json
{
  "ok": true,
  "projectConfigured": true,
  "tables": {
    "health_key_metrics": true,
    "networth_snapshot": true
  }
}
```

Never return:

- API keys
- access tokens
- DB passwords
- raw personal rows
- service role details

### Step 7: Update Documentation

After implementation, update:

- `docs/02-plan.md`
- this file
- `AGENTS.md` if any project-wide convention changed

Record:

- completed Phase 0 items
- Supabase source behavior
- CSV fallback behavior
- any known limitations

Status: completed for the initial Phase 0 adapter implementation.

## 5. Acceptance Criteria

Functional:

- `/` renders with local CSV data. Status: verified.
- `/` renders without `data/*.csv`. Status: supported by missing-file fallback; full fresh-clone browser check pending.
- `/` can read from Supabase once data exists. Status: adapter implemented; domain tables currently empty.
- Supabase failures do not break the overview. Status: adapter falls back to CSV/empty.
- `app/api/health/supabase` returns safe status JSON. Status: verified.

Architecture:

- dashboard data types are centralized.
- CSV and Supabase sources share one output shape.
- score calculation is outside the source adapters.
- admin client remains server-only.

Security:

- `.env` remains ignored.
- `data/*` remains ignored except `data/.gitkeep`.
- service role key is never exposed to client code.
- health check route does not reveal secrets or private data.

Validation:

```powershell
npm run typecheck
npm run lint
npm run build
npm audit --audit-level=moderate
```

Latest validation:

- `npm run typecheck`: passed
- `npm run lint`: passed
- `npm run build`: passed
- Supabase REST verification: passed
- Browser check at `http://localhost:3003`: charts 4, runtime errors 0, no page scroll

Supabase verification:

```powershell
powershell -ExecutionPolicy Bypass -File C:\Users\user\.codex\skills\supabase-connect\scripts\inspect-env.ps1 -EnvPath .env

powershell -ExecutionPolicy Bypass -File C:\Users\user\.codex\skills\supabase-connect\scripts\verify-rest.ps1 -EnvPath .env -Tables health_key_metrics,networth_snapshot,investment_holdings,ai_insights
```

## 6. Known Constraints

- Private source CSV/Markdown files in `data/` are local-only and gitignored.
- Supabase tables currently exist but may be empty until Phase 2 import work.
- Phase 0 may use service role for server-side read-only dashboard loading; user-scoped RLS reads are a Phase 3/Auth refinement.
- No broad UI redesign should happen in Phase 0.
- The Asset Zone / Health Zone redesign is planned for Phase 3, but Phase 0 type names and adapters should not make that future split harder.

## 7. Next Phase Handoff

Phase 0 prepares Phase 1/2 by making the app source-agnostic.

After Phase 0:

- Phase 1 can refine schema/RLS without changing page code.
- Phase 2 can import CSV into Supabase and immediately power the overview.
- Phase 3 can switch default source to Supabase and add family/user toggles.
