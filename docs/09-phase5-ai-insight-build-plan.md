# Phase 5 AI Insight Build Plan

## 1. Goal

Add privacy-aware AI summaries and anomaly explanations that connect asset and health conditions.

## 1.1 Current Status

Completed first safety-oriented UI pass:

- `/ai-insight` route shell exists.
- Overview and AI route use deterministic summaries based on derived dashboard metrics.
- No external AI request is made yet.
- Prompt boundary is documented in UI and this plan.

Validation:

- `/ai-insight` returned HTTP 200 in browser verification.
- `npm run typecheck`, `npm run lint`, and `npm run build` passed.

Next implementation:

- Add server-only OpenAI client.
- Add derived metric input builder.
- Add `GET`/`POST` route for persisted insights.
- Persist generated summaries to `ai_insights`.

## 2. Safety Principles

- Use server-only OpenAI calls.
- Never expose API keys to client components.
- Prefer derived metrics over raw private rows.
- Do not send sensitive raw personal data without explicit user confirmation.
- Store generated outputs and input summaries for audit.

## 3. Build Steps

### Step 1: Server OpenAI Client

Create:

```text
lib/ai/openai-client.ts
lib/ai/env.ts
```

Use:

- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `OPENAI_REASONING_EFFORT`

### Step 2: Insight Input Builder

Create:

```text
lib/ai/insight-input.ts
```

Input should include:

- scores
- net worth summary
- pension gap
- investment concentration
- health priority items
- recent health trend signals
- data freshness

Avoid raw row dumps.

### Step 3: Insight Generator

Create:

```text
lib/ai/generate-insight.ts
```

Initial insight types:

- weekly executive summary
- health-risk summary
- asset-readiness summary
- retirement gap summary
- anomaly explanation

### Step 4: Route Handler Or Server Action

Create:

```text
app/api/ai/insights/route.ts
```

Methods:

- `POST`: generate insight
- `GET`: read recent insights

### Step 5: Persistence

Use `ai_insights` table.

Store:

- `owner_scope`
- `insight_kind`
- `title`
- `markdown`
- `model`
- `input_summary`

### Step 6: UI

Add to:

- overview executive summary
- `/ai-insight` route

Status: deterministic UI shell is complete. Generated insight UI remains planned after server-side AI route implementation.

## 4. Deliverables

- server-only AI client
- insight input builder
- persisted AI insights
- safe UI rendering

## 5. Validation

```powershell
npm run typecheck
npm run lint
npm run build
```

Functional:

- AI route does not expose secrets
- generated insight is persisted
- generated text is based on derived metrics
- failure returns safe error

## 6. Risks

- Over-sharing private data with external models.
- AI output sounding like medical or financial advice.
- Hallucinated recommendations if data is sparse.

## 7. Guardrails

AI output should frame recommendations as:

- data-based observation
- risk to monitor
- next question
- action to review

Avoid definitive medical, legal, tax, or investment instructions.
