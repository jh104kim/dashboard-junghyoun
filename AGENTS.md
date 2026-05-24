# Codex Rules: Personal Life OS Dashboard

## Project Identity

This repository is the Personal Life OS Dashboard: a private Samsung Galaxy-centered operating dashboard for health, finance, investment, spending, retirement, tax, data center workflows, and future AI insight.

Always treat `docs/01-prd.md` as the source of product truth. If implementation choices conflict with the PRD, preserve the PRD intent and explain the tradeoff.

## Product Priorities

1. Overview first: the first screen must communicate life status within 5 seconds.
2. Two-zone overview: the primary landing structure is Asset Zone plus Health Zone, with cross-zone insight connecting wealth and health risk.
3. No-scroll landing: the `/` overview must fit inside a single viewport, especially 1920x1080 desktop and Galaxy tablet landscape.
4. Dense but legible: favor compact executive dashboard UI over marketing pages, hero sections, large cards, or decorative layouts.
5. Drill-down ready: overview panels should be structured so Asset, Health, Investment, Retirement, Tax, Spending, AI Insight, and Data Center can become dedicated routes or tabs.
6. AI-ready data: keep data transformations explicit and typed so future AI agents can consume the same derived dashboard state.

## Technical Stack

Use these defaults unless the user explicitly changes direction:

- Next.js: exactly `15.5.18`
- React: `19.x`
- TypeScript: strict mode
- Styling: Tailwind CSS
- Visualization: Apache ECharts through `echarts-for-react`
- CSV parsing: `papaparse`
- Backend target: Supabase/PostgreSQL/Auth/RLS
- Data grid target: AG Grid Community
- PWA target: IndexedDB plus background refresh in later phases

Do not upgrade Next.js casually. Before any Next.js version change, verify the current official package/repository information and explain compatibility implications.

## Data Rules

The files in `data/` are private personal health and finance data. Handle them as sensitive.

- Do not move, rename, delete, anonymize, or overwrite source CSV/Markdown data unless the user explicitly asks.
- Prefer read-only ingestion utilities under `lib/`.
- Keep derived calculations transparent and easy to audit.
- Preserve Korean labels from the source data in UI where they help recognition.
- Never send private data to third-party services unless the user explicitly asks and confirms the destination.
- When adding upload/import flows, implement idempotency and duplicate prevention as described in the PRD.

## UI And UX Rules

- The landing page is an application surface, not a landing/marketing site.
- Use dark, high-density executive dashboard styling inspired by Bloomberg, Samsung Health, modern SaaS BI, and Grafana.
- Keep panels compact with clear labels, KPI values, trend/risk color, and chart-first hierarchy.
- Treat Asset Zone and Health Zone as the first-order overview surfaces. Finance, Investment, Pension, Tax, Debt, and Spending should roll up under Asset unless a dedicated route or tab needs detail.
- Asset Zone should include wealth composition, asset-class analysis, pension timeline, tax-saving/action ideas, and monthly 10M KRW target analysis when data supports it.
- Health Zone should include current status, active management priorities, tracking trends, anomaly markers, and monitoring/action guidance.
- Avoid nested cards, large hero text, decorative blobs, one-note palettes, and explanatory in-app copy.
- Use responsive constraints so text and charts do not overlap at desktop and tablet sizes.
- After meaningful UI changes, verify in a browser that:
  - no Next.js runtime error overlay is present,
  - charts render,
  - the overview has no page scroll,
  - text does not visibly overlap.

## Architecture Rules

- Use the App Router under `app/`.
- Keep server-side data loading in typed utilities under `lib/`.
- Keep reusable client visualization components under `components/`.
- Client components should be used only where browser APIs or chart rendering require them.
- Avoid adding abstractions until there is repeated structure or a clear future route/data boundary.
- Add route-level files only when a user-facing workflow is ready.

## Security And Privacy

- Assume all health, finance, tax, debt, and investment data is private.
- Supabase work must plan for Auth, RLS, user-based filtering, and family sharing roles:
  - `USER_JH`
  - `USER_YR`
  - `FAMILY_COMBINED`
- Health defaults to individual view; assets, spending, and investment default to combined family view, per the PRD.
- Do not hardcode service keys, API tokens, personal credentials, or production URLs.
- Use `.env.local` for secrets and keep it ignored.
- Use `SUPABASE_SERVICE_ROLE_KEY` for the server-only Supabase service role key. Never prefix it with `NEXT_PUBLIC_`.

## Verification Commands

Run the relevant checks before calling work done:

```powershell
npm run typecheck
npm run lint
npm run build
npm audit --audit-level=moderate
```

For frontend changes, also run the app locally and verify the rendered page:

```powershell
npm run dev -- --port 3000
```

If port `3000` is occupied, use the next available port and report it.

## Deployment Rules

- Pages that read private Supabase data at request time must opt out of static generation with `export const dynamic = "force-dynamic"`.
- Middleware must not throw when Supabase public env vars are missing in a preview/build environment.
- Do not rely on local `.env` for Vercel; configure required env vars in the Vercel project settings.

## Dependency Rules

- Keep `package-lock.json` committed/updated with dependency changes.
- Keep `next`, `eslint-config-next`, and related Next.js behavior aligned to `15.5.18`.
- If npm audit reports issues inside the pinned Next.js dependency chain, first prefer a narrow `overrides` fix that preserves `next@15.5.18`.
- Do not run broad upgrade commands such as `npm update` or `npm audit fix --force` without a clear reason.

## Documentation Rules

- Keep implementation choices traceable to the PRD.
- Keep `docs/02-plan.md` and relevant phase detail docs updated as implementation progresses.
- Before starting a planned phase, create or update a concrete phase implementation doc under `docs/`.
- After completing meaningful implementation work, update the corresponding doc with status, validation results, and known limitations.
- Use the phase build-plan docs as the execution source for planned work:
  - Phase 0: `docs/03-phase0-foundation.md`
  - Overview target: `docs/04-overview-two-zone-dashboard.md`
  - Phase 1: `docs/05-phase1-database-build-plan.md`
  - Phase 2: `docs/06-phase2-data-pipeline-build-plan.md`
  - Phase 3: `docs/07-phase3-overview-build-plan.md`
  - Phase 4: `docs/08-phase4-drilldown-build-plan.md`
  - Phase 5: `docs/09-phase5-ai-insight-build-plan.md`
  - Phase 6: `docs/10-phase6-pwa-samsung-build-plan.md`
- Update this file when project-wide conventions change.
- Add short README-style docs only when they help operate or extend the dashboard.
- Avoid duplicating the full PRD in code comments or UI copy.

## Current Implementation Notes

- The overview reads through `lib/dashboard-data`, which tries Supabase first and falls back to local CSV or an empty dashboard state.
- The dashboard currently renders the first Asset Zone plus Health Zone overview documented in `docs/04-overview-two-zone-dashboard.md`.
- Local CSV import is available through `npm run import:data`; it preserves raw batches/rows and upserts the initial dashboard-critical domain tables.
- Remaining CSV transforms, RBAC toggles, Samsung Health sync, PWA caching, and dedicated drill-down routes are planned next-phase work.
