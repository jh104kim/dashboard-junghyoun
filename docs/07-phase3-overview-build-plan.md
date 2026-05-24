# Phase 3 Overview Upgrade Build Plan

## 1. Goal

Redesign `/` into the two-zone executive overview described in `docs/04-overview-two-zone-dashboard.md`.

The first viewport should be dominated by:

- Asset Zone
- Health Zone
- cross-zone AI Executive Summary

## 1.1 Current Status

Completed for the first production overview pass:

- `/` is now organized around Asset Zone and Health Zone.
- Asset Zone includes wealth composition, investment allocation, pension timeline, tax/action suggestions, asset reading, holdings watch, and monthly 10M KRW target gap.
- Health Zone includes current status KPIs, long-term trend chart, priority tracking, anomaly markers, monitoring guidance, and care guidance.
- Header shows Supabase sync when remote data is available.
- Deterministic executive summary links asset target gap and health risk.

Latest validation:

- `npm run typecheck`: passed
- `npm run lint`: passed
- `npm run build`: passed after stopping a stale dev process that locked `.next/trace`
- browser check at 1920x1080: 5 chart canvases, Asset Zone visible, Health Zone visible, Supabase label visible, no page scroll
- browser check at 1366x1024: 5 chart canvases, Asset Zone visible, Health Zone visible, Supabase label visible, no page scroll

## 2. Build Principles

- Keep no-scroll behavior at 1920x1080.
- Use tabs/segmented controls inside zones for detail without page navigation.
- Keep UI dense but readable.
- Avoid broad explanatory copy.
- Use chart-first visual hierarchy.
- Preserve current data adapter boundary.

## 3. Build Steps

### Step 1: Dashboard Data Shape Upgrade

Extend `DashboardData` with:

- asset composition
- asset cards
- pension timeline by product/institution
- tax-saving suggestions
- monthly 10M KRW target gap
- health priority items
- health monitoring actions
- health anomaly markers

Status: completed for the first overview pass.

### Step 2: Asset Zone Components

Create:

```text
components/asset-zone/
  AssetZone.tsx
  WealthCompositionChart.tsx
  AssetTabs.tsx
  PensionTimelineChart.tsx
  AssetActionPanel.tsx
```

Tabs:

- Summary
- Real Estate
- Pension
- Investment
- Debt
- Tax
- Scenario

Status: implemented inline on `/` for the first pass. Extract into dedicated components when Phase 4 route shells are introduced.

### Step 3: Health Zone Components

Create:

```text
components/health-zone/
  HealthZone.tsx
  HealthPriorityPanel.tsx
  HealthTrendPanel.tsx
  HealthTabs.tsx
  MonitoringActionList.tsx
```

Tabs:

- Summary
- Metabolic
- Cardiovascular
- Liver
- Weight
- Checkups
- Actions

Status: implemented inline on `/` for the first pass. Extract into dedicated components when drill-down routes reuse the panels.

### Step 4: Cross-Zone Summary

Create:

```text
components/executive-summary/CrossZoneSummary.tsx
```

Initial summary should be deterministic, not AI-generated:

- asset condition
- health risk
- current priority
- next action

AI generation comes in Phase 5.

Status: completed.

### Step 5: Header Update

Header should show:

- date
- sync source
- Life Score
- Asset Score
- Health Score
- Risk
- Family/JH/YR toggle placeholder if auth is not ready

Status: completed except the Family/JH/YR toggle, which remains planned for authenticated profile scope work.

### Step 6: Interaction

Add:

- zone tabs
- hover/tooltips on charts
- drill-down links prepared but not all routes required

Status: static tabs are present. Route links should be added in Phase 4.

### Step 7: Browser Verification

Use browser verification after meaningful layout changes:

- charts render
- no runtime error overlay
- no page scroll
- no incoherent overlap
- 1920x1080 and tablet landscape if possible

## 4. Deliverables

- two-zone `/` layout
- Asset Zone components
- Health Zone components
- updated dashboard data types
- cross-zone summary
- no-scroll verified screen

## 5. Validation

```powershell
npm run typecheck
npm run lint
npm run build
npm audit --audit-level=moderate
```

Browser:

- `/` has Asset Zone and Health Zone
- wealth composition chart visible
- pension timeline visible
- health priorities visible
- no-scroll at 1920x1080

## 6. Risks

- Too much data can make no-scroll impossible.
- Tabs can hide critical 5-second awareness information.
- Asset categories can double-count if composition logic is unclear.
- Health recommendations must avoid medical overclaiming.

## 7. Handoff To Phase 4

The overview should expose natural links or tab affordances for:

- `/assets`
- `/health`
- `/investment`
- `/retirement`
- `/tax`
- `/data-center`
