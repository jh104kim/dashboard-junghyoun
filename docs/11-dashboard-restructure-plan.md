# Dashboard Restructure Plan

## 1. Goal

Rebuild the dashboard as a landing page plus domain drill-down system.

The landing page is the executive cockpit. It should show only the highest-signal summary for the whole Life OS. Domain pages should carry the rich charts, tables, and long-form analysis.

## 2. Information Architecture

Landing:

- Life status scorecard
- Health summary
- Finance summary
- Activity/travel summary
- Learning/signal summary
- Data trust and freshness
- Next actions

Domain pages:

- `/finance`: assets, debt, investment, pension, income, tax, scenario
- `/health`: checkups, metabolic risk, cardiovascular risk, action tracking, benefits
- `/activity`: hiking, exercise, golf, mountain list, schedule
- `/travel`: trips, trekking, itinerary, packing, cost readiness
- `/learning`: AI learning, social-feed picks, idea backlog, execution cadence
- `/data-center`: source files, import history, validation, freshness
- `/ai-insight`: cross-domain insight, anomaly explanation, weekly review

## 3. Chart Strategy

Use chart types according to the data shape, not for decoration.

Finance:

- Donut chart: asset composition
- Area/line chart: net worth goal path
- Bar chart: pension annual cashflow
- 100% stacked bar: tax type share by year
- Scatter plot: salary scenario take-home vs deductions
- Radial gauge: 57-year net-worth target progress
- Sparklines: salary, tax, debt, investment trend hints

Health:

- Line chart: BMI, glucose, BP long trend
- Area chart: risk-zone background for metabolic trend
- Gauge: BMI, biological age, BP risk
- Histogram: normal/watch/risk checkup distribution
- Box plot: category distribution when enough numeric samples exist
- Sparklines: current priority metric deltas

Activity:

- Donut chart: visited vs unvisited mountains
- Bar chart: monthly hiking schedule count
- Scatter plot: mountain altitude vs visited/planned
- Histogram: altitude distribution
- Choropleth or regional heatmap: mountain/travel distribution by region

Travel:

- Timeline/bar: itinerary days
- Donut chart: cost composition
- 100% stacked bar: packing/readiness state
- Map/region chart: destinations

Learning:

- Bar chart: social-feed category counts
- Scatter plot: impact vs execution effort
- Donut chart: backlog status
- Sparkline: weekly execution cadence

## 4. UI/UX Quality Bar

Senior UI/UX acceptance criteria:

- Landing must not scroll at 1920x1080 and 1366x1024.
- Landing may switch to scroll on mobile; do not squeeze desktop grid into unusable mobile columns.
- Text must not overlap charts, adjacent cards, or section boundaries.
- Tables must not be shrunk below readable size to fit a panel. Use pagination, scrolling within the table region, or move detail to drill-down pages.
- Chart labels must not collide with each other. Hide labels, use tooltips, or move dense labels to legends/tables.
- Every card needs a clear decision purpose: status, risk, trend, gap, or next action.
- Static tabs are allowed only as visual placeholders during a phase. Production tabs must switch content or be changed to route links.
- Avoid mixing unrelated domain charts inside a zone. Tax charts belong in finance/tax, not health.
- Empty or pending data should be explicit, not silently hidden.

## 5. Phase Plan

### Phase A: Documentation And Rules

- Update `AGENTS.md`.
- Update `docs/02-plan.md`.
- Add this restructure plan.

### Phase B: Landing Rebuild

- Replace two giant zone layout with executive cockpit.
- Show 6 to 8 high-signal cards.
- Link every card to a domain route.
- Keep charts small and readable.

### Phase C: Finance Deep Page

- Use all current finance CSV sources:
  - net worth
  - investments
  - pension cashflow
  - pension products
  - salary/tax yearly
  - salary take-home scenarios
  - tax payments
  - debt/loan snapshot

### Phase D: Health Deep Page

- Use all current health CSV sources:
  - key yearly metrics
  - detailed checkup metrics
  - findings/actions
  - health north-star goals

### Phase E: Activity And Travel

- Add `/activity`.
- Add `/travel`.
- Ingest or read hiking/travel sources from Obsidian/raw.

### Phase F: Learning And Signal

- Add `/learning`.
- Read social-feed digest and learning backlog candidates.

### Phase G: Quality Pass

- Playwright verification:
  - route status
  - canvas count
  - console/page errors
  - scroll behavior
  - overlapping elements
  - mobile/tablet layout
- Update docs with issues and fixes.

## 6. Current Assessment

Current landing issues:

- Four major panels only, despite rich source data.
- Asset and Health sections are too large and too dense in the wrong places.
- Static tabs do not switch content.
- Health Zone includes Tax Timeline, which violates domain grouping.
- Mobile layout compresses two columns into unusable widths.
- Several existing datasets are not yet visible: salary, tax payments, debt/loan, pension products, hiking/travel, learning/social signals.

## 7. Immediate Implementation Order

1. Rebuild landing as cockpit.
2. Add richer finance and health summaries to domain pages.
3. Add `/activity`, `/travel`, and `/learning` route shells with real source inventory.
4. Run Playwright quality checks.
5. Document findings and remaining gaps.

## 8. Implementation Status

Completed in the first restructure pass:

- Landing rebuilt from two large zones into an executive cockpit.
- Landing cards now cover Life, Finance, Health, Retirement, Activity/Travel, Signals/Data Trust, and next actions.
- `/finance` upgraded from a text shell into a finance dashboard with asset composition, pension cashflow, investment holdings, tax trend, and finance actions.
- `/health` upgraded from a text shell into a health dashboard with long-term trend, health score gauge, BMI/glucose sparklines, priority tracking, anomalies, and monitoring cadence.
- Added `/activity`, `/travel`, and `/learning` route shells with source inventory and chart candidates.
- Added reusable ECharts components:
  - `ScoreGaugeChart`
  - `SparklineChart`
  - `CompactBarChart`

## 9. QA Results

Validation commands:

- `npm run typecheck`: passed
- `npm run lint`: passed
- `npm run build`: passed
- `npm audit --audit-level=moderate`: 0 vulnerabilities

Playwright checks:

- Routes checked: `/`, `/finance`, `/health`, `/activity`, `/travel`, `/learning`
- Viewports checked: `1920x1080`, `1366x1024`, `390x844`
- Landing desktop/tablet:
  - HTTP 200
  - 6 chart canvases
  - no page scroll at `1920x1080`
  - no page scroll at `1366x1024`
  - no section overlap detected
- Landing mobile:
  - scroll allowed
  - no horizontal overflow
  - no section overlap detected
  - no text overflow detected after responsive fixes
- Finance and Health:
  - vertical scroll exists by design because these are drill-down pages
  - no horizontal overflow
  - no section overlap detected
  - no text overflow detected
- Activity, Travel, Learning:
  - route shells return 200
  - mobile wrapping fixed for long source paths

## 10. Remaining Gaps

- `/activity`, `/travel`, and `/learning` are still source-inventory route shells, not full dashboards.
- Finance still needs import support for:
  - pension products
  - salary/tax yearly
  - salary take-home scenarios
  - tax payments
  - debt/loan snapshot
- Health still needs detailed checkup matrix and distribution charts from the 398 detailed rows.
- Landing still uses some static source counts for Activity/Travel/Learning until those sources are normalized into app data loaders.
- Static route shells should be replaced with chart-backed pages in the next phase.
