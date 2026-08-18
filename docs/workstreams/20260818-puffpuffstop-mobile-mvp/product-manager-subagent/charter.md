---
schema_version: 1
task_id: 20260818-puffpuffstop-mobile-mvp
role_id: product-manager-subagent
status: complete
revision: 1
created_at: 2026-08-18T10:46:00Z
updated_at: 2026-08-18T10:46:00Z
predecessor_handoff: none
---

# Role Charter: product-manager-subagent

## 1. Role objective

### Mission

Convert the locked PuffPuffStop owner brief into a testable product contract so UI/UX, Engineering, Security, Growth, and Project Lead can execute phase 0 and later phases without inventing product intent.

## 2. Inherited request and evidence

- Workstream manifest: `docs/workstreams/20260818-puffpuffstop-mobile-mvp/manifest.md`
- Active plan: `docs/plans/phase_0_foundations_plan.md` (created after this contract)
- Predecessor handoff: none
- Relevant decisions/blockers: owner-locked product, stack, risk tier 3; no open blockers

## 3. Scope, non-goals, and ownership

- In scope: user/problem/outcome, PRD with unique IDs, journeys, acceptance, metrics, non-goals, sequencing, privacy/ethics flags, strategy blueprint content for product sections.
- Explicit non-goals: application code, final visual design, campaigns, production actions, inventing clinical claims.
- Owned/write paths or `read-only`: role is read-only; orchestrating lead materializes this directory and `docs/blueprints/2026-08-18_puffpuffstop.md`.
- Read-only paths: README, control plane, workstream, public research.
- External-system scope: public web research only. No analytics warehouse was authenticated.
- Prohibited actions: implementation, publishing, spend, secret storage, accepting residual risk for the owner.

## 4. Inherited requirements and vertical responsibilities

Owner-locked requirements PPS-AGE-*, PPS-ONB-*, PPS-EST-*, PPS-HOME-*, PPS-SET-*, PPS-MNY-*, PPS-SAFE-*, PPS-P0-*. This role uniquely IDs them, prioritizes now/later/excluded, and writes acceptance that later roles cannot reinterpret.

## 5. Assumptions, open questions, and clarification decisions

- `verified` — 16+ hard gate; wellness not medical; local savings only; Expo stack; 14 onboarding questions; organ set; Log interaction.
- `provisional` — daysIn(period): day=1, week=7, month=30, year=365.
- `provisional` — organ baseline formula weights deferred to phase 2 with clamp 1–100, never 0, seed range 35–85.
- `provisional` — under-16 help resources are non-clinical public links (e.g., national youth support pages) shown locally with no tracking.
- `blocking` — none for phase 0.

## 6. Skills, tools, and evidence sources

- Skills: `launch-pipeline` (activated). Supabase/Vercel skills noted, unused for product contract.
- Tools: repository inspection, WebSearch for public competitors and App Store age/Kids rules. No Figma. No authenticated analytics.
- Availability: WebSearch executed 2026-08-18. Cursor Cloud MCP used only for run identity.

## 7. Outputs and storage paths

- `charter.md`, `plan.md`, `evidence.md`, `handoff.md` in this directory
- `artifacts/product-requirements.md`
- Canonical blueprint: `docs/blueprints/2026-08-18_puffpuffstop.md`

## 8. Horizontal quality coverage

- Product and user acceptance: owned
- UI/UX and accessibility: reviewed; UX owns specification
- Frontend/backend/data/API/integration impact: reviewed; Engineering owns implementation
- Security/privacy/compliance/abuse: reviewed; Security owns verdict
- Testing/observability/reliability/performance: reviewed
- Deployment/rollback/operations: not_applicable for this phase’s production surface
- Analytics/growth/consent: reviewed; Growth after security evidence
- Documentation/handoff: owned for product contract

## 9. Validation plan and gate criteria

Gate may PASS when user/problem/outcome are coherent; requirements uniquely identified and testable; acceptance covers success/failure/edges; metrics distinguish unknown baselines; non-goals and unauthorized actions are explicit; downstream roles need not invent intent.

## 10. Risks, blockers, and escalation triggers

- Medical-device or clinical-accuracy interpretation of organ %.
- Kids Category or under-13 copy drift.
- Money feature becoming a wallet.
- Escalate if owner later requests under-16 use, IAP on tracker, or real money before 18+.

## 11. Failure handling and recovery

If product ambiguity blocks a later role, return here with requirement IDs. Do not let Engineering invent journeys.

## 12. Downstream role and handoff conditions

Downstream: `ui-ux-developer-subagent`. Handoff requires this charter, plan, evidence, PRD, and blueprint. UI/UX may not change required onboarding questions, age-gate rule, wellness disclaimer, or money prohibition.
