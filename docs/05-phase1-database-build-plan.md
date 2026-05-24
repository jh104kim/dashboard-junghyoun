# Phase 1 Database Design And Migration Build Plan

## 1. Goal

Make Supabase the durable system of record for the dashboard while keeping private raw files out of Git.

Phase 1 is considered complete when:

- schema is represented by versioned migrations
- remote migration history is aligned
- TypeScript DB types compile
- RLS and grants are explicit
- future data import can target stable tables

## 2. Current Status

Completed:

- Supabase project linked: `xjjxdzisunsrcelbhfpm`
- initial schema migration applied
- API grants migration applied
- migration history repaired and aligned
- generated types exist at `lib/supabase/database.types.ts`

Existing migration files:

- `supabase/migrations/20260524000100_initial_life_os_schema.sql`
- `supabase/migrations/20260524000200_grant_api_access.sql`

## 3. Build Steps

### Step 1: Schema Inventory

Verify tables, enums, indexes, triggers, policies, and grants.

Use Supabase SQL or CLI to confirm:

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

### Step 2: RLS Review

Review current RLS policies for Phase 1 safety.

Current policy direction:

- service role can perform server-side imports and admin reads
- authenticated users can read dashboard data
- profile and membership tables are user-scoped

Phase 1 hardening candidates:

- add owner/family-scoped read policies
- add write policies only for server/admin paths
- keep public anon access restricted unless intentionally needed

### Step 3: Table Refinement Migration

Create a follow-up migration only if needed.

Candidate refinements:

- add `data_freshness_at`
- add `owner_user_id` where personal ownership matters
- add `source_confidence`
- add check constraints for amount fields
- add category enums after import categories stabilize

Do not churn schema prematurely. Let Phase 2 import validation reveal real needs.

### Step 4: Type Generation

Regenerate types after any schema change:

```powershell
$env:SUPABASE_ACCESS_TOKEN = "<token>"
npx supabase gen types typescript --project-id xjjxdzisunsrcelbhfpm --schema public > lib\supabase\database.types.ts
```

### Step 5: Migration History Verification

Run:

```powershell
$env:SUPABASE_ACCESS_TOKEN = "<token>"
$env:SUPABASE_DB_PASSWORD = "<password>"
npx supabase migration list --linked
npx supabase db push --dry-run --linked
```

Expected:

- local and remote versions match
- dry run reports remote database is up to date

## 4. Deliverables

- migration files under `supabase/migrations`
- generated `lib/supabase/database.types.ts`
- documented RLS assumptions
- verified REST/API grants

## 5. Validation

```powershell
npm run typecheck
npm run lint
npm run build
npm audit --audit-level=moderate
```

Supabase checks:

```powershell
powershell -ExecutionPolicy Bypass -File C:\Users\user\.codex\skills\supabase-connect\scripts\inspect-env.ps1 -EnvPath .env

powershell -ExecutionPolicy Bypass -File C:\Users\user\.codex\skills\supabase-connect\scripts\verify-rest.ps1 -EnvPath .env -Tables health_key_metrics,networth_snapshot,investment_holdings,pension_cashflow,tax_history,spending_ledger,ai_insights
```

## 6. Risks

- RLS can accidentally expose private personal data if policies become too broad.
- Over-modeling before import can slow progress.
- Applying SQL outside CLI requires migration repair.

## 7. Handoff To Phase 2

Phase 2 can begin when schema is stable enough to import:

- raw batches
- raw rows
- health metrics
- financial snapshots
- investments
- pension cashflow
- tax history
