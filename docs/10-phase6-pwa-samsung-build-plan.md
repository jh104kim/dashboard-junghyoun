# Phase 6 PWA And Samsung Ecosystem Build Plan

## 1. Goal

Make the dashboard fast and comfortable on Galaxy devices while preparing for Samsung Health data integration.

## 1.1 Current Status

Completed first PWA metadata pass:

- `app/manifest.ts`
- `/manifest.webmanifest` returns HTTP 200
- display mode, name, start URL, theme color, orientation, and categories are defined

Validation:

- `/manifest.webmanifest` returned HTTP 200 in browser verification.
- `npm run typecheck`, `npm run lint`, and `npm run build` passed.

Known limitations:

- app icons are not added yet
- service worker and IndexedDB snapshot cache are not implemented yet
- Samsung Health adapter contract is still planned

## 2. Build Steps

### Step 1: PWA Manifest

Create:

```text
app/manifest.ts
```

Include:

- app name
- short name
- icons
- theme color
- display mode
- start URL

Status: completed except icons.

### Step 2: App Icons

Add generated or designed icons:

```text
public/icons/
```

Sizes:

- 192x192
- 512x512
- maskable variant

### Step 3: Local Dashboard Snapshot Cache

Create:

```text
lib/cache/dashboard-cache.ts
```

Use IndexedDB for:

- latest dashboard snapshot
- data freshness metadata
- last successful sync timestamp

### Step 4: Background Refresh

Add client-side refresh behavior:

- render cached dashboard quickly
- refresh Supabase data in background
- update visible sync status

### Step 5: Offline/Degraded State

When offline:

- show latest cached data
- show stale indicator
- disable import/generate actions

### Step 6: Samsung Health Adapter Boundary

Prepare interfaces:

```text
lib/integrations/samsung-health/types.ts
lib/integrations/samsung-health/sync-contract.ts
```

Target data:

- steps
- sleep
- heart rate
- exercise
- calories
- weight
- stress

Actual Android/SDK integration can be a later native-side project.

## 3. Deliverables

- installable PWA metadata
- icons
- IndexedDB cache
- sync status behavior
- Samsung Health adapter contract

## 4. Validation

```powershell
npm run typecheck
npm run lint
npm run build
```

Browser/device:

- install prompt/manifest visible
- dashboard loads quickly
- cached snapshot works when offline or Supabase fails
- mobile/tablet layout remains usable

## 5. Risks

- Service worker can cache stale private data.
- Offline cache must not leak to shared devices.
- Samsung Health SDK integration likely requires separate Android-side implementation.

## 6. Privacy Notes

- Cache only the minimum dashboard snapshot needed for fast boot.
- Provide a clear way to clear local cache.
- Do not cache service role data or secrets.
