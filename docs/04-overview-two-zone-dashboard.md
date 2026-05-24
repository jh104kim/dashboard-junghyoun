# Two-Zone Overview Dashboard Plan

## 1. Goal

Redesign the overview dashboard around two primary executive zones:

1. Asset Zone
2. Health Zone

The overview should still preserve the PRD principles:

- no-scroll first viewport
- 5-second awareness
- dense but legible information
- drill-down first
- long-term trend orientation
- family/shared data readiness

This is a product direction document for Phase 3. Phase 0 should not implement the broad UI redesign yet, but its data adapter work must prepare for this structure.

## 2. Top-Level Layout

The landing page should move from four equal zones to two large primary zones:

```text
┌──────────────────────────────────────────────────────────────────────┐
│ Header: Date | Sync | Life Score | Asset Score | Health Score | Risk │
├───────────────────────────────────┬──────────────────────────────────┤
│ Asset Zone                        │ Health Zone                       │
│ - total net worth composition     │ - current health overview         │
│ - asset class analysis            │ - management priorities           │
│ - pension timeline                │ - trend tracking                  │
│ - tax-saving suggestions          │ - anomaly watch                   │
│ - 10M KRW/month target ideas      │ - action/monitoring checklist     │
├───────────────────────────────────┴──────────────────────────────────┤
│ Executive Summary: asset-health balance, alerts, next actions         │
└──────────────────────────────────────────────────────────────────────┘
```

## 3. Asset Zone

### 3.1 Overview Metrics

The Asset Zone should answer:

- What is my total net worth?
- How is my whole wealth composed?
- What assets dominate my risk and future income?
- How reliable is future pension cashflow?
- What can I do for tax reduction and monthly 10M KRW income target?

Primary KPIs:

- total assets
- total liabilities
- net worth
- financial assets
- real estate assets
- investment market value
- pension annual/monthly cashflow
- debt ratio
- projected net worth
- retirement start age

### 3.2 Wealth Composition

Required visualization:

- pie or donut chart for total asset composition

Composition groups:

- real estate
- stock/cash financial assets
- pension products
- investment holdings
- debt/liability offset

If a category overlaps in raw data, show it clearly as a derived view rather than double-counting silently.

### 3.3 Asset Class Analysis

Asset tabs inside the Asset Zone:

- Summary
- Real Estate
- Pension
- Investment
- Debt
- Tax
- Scenario

Each tab should show:

- current value
- projected value where data exists
- risk/constraint
- action item
- data freshness

Real Estate:

- current valuation
- debt exposure
- deposit/liability impact
- concentration risk

Pension:

- institution/product
- start age
- period
- annual expected cashflow
- monthly equivalent
- tax treatment notes

Investment:

- holdings table
- treemap/allocation
- gain/loss
- return percentage
- concentration risk

Debt:

- current balance
- rate
- monthly interest
- repayment status

Tax:

- yearly tax payment trend
- tax type breakdown
- spike detection
- pension/tax-saving opportunities

### 3.4 Pension Timeline

Required visualization:

- age-based pension timeline
- stacked bar by product or institution
- annual and monthly equivalent labels

Questions to answer:

- At what age does pension income start?
- Which products contribute most?
- Where are cashflow gaps?
- How long does each product last?
- What is the gap to monthly 10M KRW?

### 3.5 Tax Saving And Monthly 10M KRW Target

The dashboard should propose data-backed ideas, not generic advice.

Examples:

- pension contribution/tax deduction review
- IRP/pension savings optimization
- investment income and tax timing review
- debt interest cost reduction
- asset allocation concentration adjustment
- cashflow gap analysis by age
- additional monthly income target path toward 10M KRW

Output should be marked as:

- data-supported
- needs additional data
- advisory review needed

## 4. Health Zone

### 4.1 Overview Metrics

The Health Zone should answer:

- What is my current health status?
- What needs active management now?
- What should I watch continuously?
- Which metrics are worsening or abnormal?
- What actions should I take?

Primary KPIs:

- health score
- biological age gap
- BMI
- waist circumference
- fasting glucose
- blood pressure
- triglycerides
- cardiovascular risk
- liver/fatty liver status
- carotid plaque status

### 4.2 Management Priority Panel

The overview should explicitly surface current care priorities:

- cardiovascular risk
- obesity/weight reduction
- fasting glucose
- triglycerides
- fatty liver
- carotid plaque follow-up
- blood pressure

Each item should show:

- current value/status
- target or reference range
- why it matters
- monitoring cadence
- next action

### 4.3 Detailed Tracking

Health tabs inside the Health Zone:

- Summary
- Metabolic
- Cardiovascular
- Liver
- Weight
- Checkups
- Actions

Tracking charts:

- multi-line long-term health trend
- reference range band
- latest 3-year checkup detail table
- action list with status
- anomaly/attention marker

### 4.4 What To Watch

For each risk item, show:

- what to avoid
- what to manage
- what to monitor
- when to re-check

Examples:

- BMI/waist: weight target, exercise, diet, monthly check
- glucose: fasting glucose trend, HbA1c if available, diet/sleep watch
- triglycerides/fatty liver: alcohol, weight, lipid follow-up
- cardiovascular risk/plaque: blood pressure, lipid profile, annual ultrasound follow-up

## 5. Cross-Zone Insight

The final dashboard should explicitly connect Asset and Health:

- asset growth vs health deterioration
- work/overload risk
- retirement readiness vs health risk
- monthly 10M target vs sustainable lifestyle
- tax/investment optimization vs stress/health monitoring

This cross-zone insight becomes the main AI Executive Summary.

## 6. Data Requirements

Existing data can support:

- net worth snapshot
- projected net worth
- investment holdings
- pension cashflow by year/age
- pension products
- tax history
- debt snapshot
- health yearly metrics
- health detailed 2024-2026 metrics
- health findings/actions

Additional data that would improve the dashboard:

- monthly net worth history
- real estate valuation history
- monthly spending ledger
- latest debt balances and rates
- investment transaction history
- pension tax deduction contribution history
- Samsung Health daily sleep/steps/heart-rate
- alcohol/smoking/exercise habit logs
- target retirement spending
- target monthly income plan

## 7. Implementation Phasing

Phase 0:

- keep current UI stable
- prepare data adapters and types that can serve Asset Zone and Health Zone

Phase 2:

- import current CSV data into Supabase
- add raw import and data freshness metadata

Phase 3:

- redesign overview into Asset Zone and Health Zone
- add tabs and drill-down panels
- add cross-zone AI summary

Phase 4:

- dedicated `/assets`, `/health`, `/retirement`, `/tax`, `/investment` detail routes

## 8. Acceptance Criteria

- The overview clearly shows Asset Zone and Health Zone as the two main areas.
- Wealth composition pie/donut is visible in the Asset Zone.
- Pension timeline by age is visible in the Asset Zone.
- Asset tabs exist for deeper analysis.
- Health priorities are visible without opening a drill-down page.
- Health detail tabs exist for deeper analysis.
- AI summary connects asset and health conditions.
- No-scroll overview is preserved at 1920x1080.
- Text/charts do not overlap.
