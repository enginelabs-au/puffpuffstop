---
schema_version: 1
task_id: 20260818-puffpuffstop-mobile-mvp
role_id: ui-ux-developer-subagent
status: complete
revision: 1
created_at: 2026-08-18T10:55:00Z
updated_at: 2026-08-18T10:55:00Z
predecessor_handoff: docs/workstreams/20260818-puffpuffstop-mobile-mvp/product-manager-subagent/handoff.md
---

# Role Charter: ui-ux-developer-subagent

## 1. Role objective

### Mission

Turn the PuffPuffStop PRD into a build-ready experience specification: phase-0 age-gate stub plus mapped later journeys, tokens, states, and accessibility rules. Remain read-only on application code.

## 2. Inherited request and evidence

- Workstream manifest: `docs/workstreams/20260818-puffpuffstop-mobile-mvp/manifest.md`
- Active plan: `docs/plans/phase_0_foundations_plan.md`
- Predecessor handoff: PM `PASS`
- Relevant decisions: cute teen-friendly, not kids; Snapchat-style Log; one question per screen

## 3. Scope, non-goals, and ownership

- In scope: IA, flows, token system, age-gate stub spec, later-screen map, a11y, copy hierarchy, empty/error/blocked states.
- Explicit non-goals: implementing UI, Figma library edits (no file supplied), campaigns, changing PRD rules.
- Owned/write paths or `read-only`: this role directory via orchestrating lead.
- Read-only paths: PRD, blueprint, phase plan, future `app/` and `src/theme/`.
- External-system scope: no Figma file ID provided; do not claim Figma work.
- Prohibited actions: source edits, publishing assets, Kids Category styling cues (bubble-letter “for kids” tropes, COPPA parental-gate as product positioning).

## 4. Inherited requirements and vertical responsibilities

PPS-P0-02, PPS-P0-03, PPS-AGE-*, PPS-ONB-*, PPS-HOME-*, PPS-SAFE-*, PPS-NFR-05. Specify tokens and age-gate now; specify remaining screens as a map Engineering must not implement in phase 0.

## 5. Assumptions, open questions, and clarification decisions

- `provisional` — Color system: mint/lilac/cream with amber over-cap and green recovery; dark-mode tokens reserved but unused in phase 0.
- `provisional` — Triggers list: morning, school/work, after eating, with friends, bored, stressed, other.
- `provisional` — Nicotine chips: 0, 3, 5, 20, 35, 50 mg + Other (common disposable/pod labels; not clinical).
- `verified` — Log is a single center circle; undo = long-press or 5s snackbar.
- `blocking` — none.

## 6. Skills, tools, and evidence sources

No Figma skill registered. TOOLS.md Figma entry: configuration does not prove access. Availability check: no Figma MCP authenticated. Visual evidence will be specification + later source inspection.

## 7. Outputs and storage paths

- `charter.md`, `plan.md`, `evidence.md`, `handoff.md`
- `artifacts/design-specification.md`
- `artifacts/flow-and-state-matrix.md`
- `artifacts/accessibility-specification.md`

## 8. Horizontal quality coverage

- Product and user acceptance: reviewed
- UI/UX and accessibility: owned
- Frontend/backend/data/API/integration impact: reviewed
- Security/privacy/compliance/abuse: reviewed (age-gate copy, no tracking)
- Testing/observability/reliability/performance: reviewed
- Deployment/rollback/operations: not_applicable
- Analytics/growth/consent: reviewed (no tracking before allow)
- Documentation/handoff: owned for experience spec

## 9. Validation plan and gate criteria

PASS when every applicable PRD item maps to a flow/screen/component or explicit later disposition; phase-0 stub is build-ready; a11y rules are testable; no Figma claimed.

## 10. Risks, blockers, and escalation triggers

Cute UI misread as kids app. Motion discomfort. Age-gate skip patterns. Escalate if Engineering adds extra home chrome that competes with Log.

## 11. Failure handling and recovery

Revise spec; do not patch code in this role.

## 12. Downstream role and handoff conditions

Downstream: `software-engineer-subagent`. Implement only phase-0 stub + tokens + empty catalog. Do not build onboarding 2–14 or home in phase 0.
