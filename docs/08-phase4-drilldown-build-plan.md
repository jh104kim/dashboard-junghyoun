# Phase 4 Drill-Down Routes Build Plan

## 1. Goal

Create focused detail routes for each major dashboard domain without overloading the overview.

## 1.1 Current Status

Completed first route-shell pass:

- shared `components/DomainShell.tsx`
- `/data-center`
- `/assets`
- `/health`
- `/finance`
- `/investment`
- `/retirement`
- `/tax`
- `/spending`
- `/ai-insight`
- `/analytics`

Validation:

- all listed routes returned HTTP 200 in browser verification
- `npm run typecheck`, `npm run lint`, and `npm run build` passed

Known limitations:

- `/assets` currently reuses the `/finance` asset/finance detail implementation.
- Route content is useful summary content, not final deep analysis.
- Overview tabs are still static; route links should be wired into the overview interaction pass.

## 2. Route Map

Primary routes:

- `/assets`
- `/health`
- `/investment`
- `/retirement`
- `/tax`
- `/spending`
- `/data-center`
- `/ai-insight`
- `/analytics`

Compatibility aliases may exist:

- `/finance` can redirect to `/assets`

Current decision: keep `/assets` and `/finance` on the same implementation until the asset model is split from general finance.

## 3. Shared Layout

Create:

```text
components/app-shell/
  AppShell.tsx
  DomainNav.tsx
  PageHeader.tsx
```

Route pages should share:

- compact header
- domain nav
- data freshness status
- source indicator
- family/user scope indicator

## 4. Build Order

### Step 1: Data Center

Route: `/data-center`

Purpose:

- import history
- source file status
- validation report
- data freshness

### Step 2: Health

Route: `/health`

Purpose:

- long-term health trends
- detailed 2024-2026 checkup table
- priority actions
- monitoring schedule

### Step 3: Assets

Route: `/assets`

Purpose:

- wealth composition
- net worth snapshots
- debt exposure
- scenario summary

### Step 4: Investment

Route: `/investment`

Purpose:

- holdings
- return/gain-loss
- allocation
- concentration risk

### Step 5: Retirement

Route: `/retirement`

Purpose:

- pension timeline
- monthly equivalent
- cashflow gap
- 10M KRW target scenarios

### Step 6: Tax

Route: `/tax`

Purpose:

- yearly tax trend
- tax type breakdown
- spike detection
- tax-saving candidates

### Step 7: Spending

Route: `/spending`

Purpose:

- manual ledger
- category analysis
- budget vs actual once data exists

### Step 8: AI Insight

Route: `/ai-insight`

Purpose:

- generated summaries
- anomaly explanations
- insight history

## 5. Deliverables

- route shells
- shared app shell
- first useful content per route
- links from overview to details

## 6. Validation

```powershell
npm run typecheck
npm run lint
npm run build
```

Browser:

- all routes load
- shared navigation works
- no route exposes private secrets

Latest result: all current route shells and `/manifest.webmanifest` returned 200.

## 7. Risks

- Building too many empty routes can create noise.
- Route names should match the two-zone mental model.
- Spending route depends on Phase 2 ledger import or manual entry.
