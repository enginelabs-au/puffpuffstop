---
plan: phase_2_home-log
status: draft
created: 2026-08-18
updated: 2026-08-18
owner: lead-agent
source_phase: docs/plans/phase_1_onboarding-plan_plan.md
workstream: docs/workstreams/20260818-puffpuffstop-mobile-mvp/manifest.md
---

# Phase 2: Organ home and Log

## 1. Objective

Replace the `/home` placeholder with cute organ-health cards and a Snapchat-style center Log button driven by the phase-1 plan commitment. Local only. No settings wallet, no store publish, no remote mutation.

## 2. Relation to project end-state

Phase 1 produced today’s commitment. Phase 2 is the daily loop: log puffs, see organs dip, recover a little only after a day at or under the cap.

## 3. Entry criteria and inherited evidence

- Phase 1 verified: lint 0, test 18/18, typecheck 0.
- Plan summary and in-memory onboarding draft exist.
- Owner APPROVE covered phase 1. Do not implement this file until execution is requested.
- SEC-P0-001/002 remain.

## 4. Scope

- Organs: Lungs, Heart, Brain, Liver, Mouth — cute loops + N%.
- Baseline 35–85% from onboarding history/frequency; clamp 1–100.
- Center Log: +1 puff today, haptic if available, undo via long-press or 5s snackbar.
- Today strip `logged / commitment`; over cap amber, not shaming.
- Per-log damage; extra cost over cap; local-midnight recovery if `logged <= commitment`.
- Disclaimer that scores are motivational estimates.

## 5. Non-goals

- Settings, puff-savings ledger, notifications, account sync.
- Store submit, ads, cards, remote DB.
- Medical claims or Kids Category.

## 6. Current-state audit

`/home` is a text placeholder. No persistence. Draft is in-memory only.

## 7. Assumptions, constraints, risks, and decisions

- Persist today log + organ scores locally (SQLite or equivalent) so midnight recovery survives reload.
- Damage/recovery fractions tuned so a commitment day is visible but not catastrophic.
- Recovery < damage.
- Parent-led implementation unless Task runtime is used.

## 8. Dependencies

Phase-1 `summarizePlan` commitment. Onboarding draft must exist or home should send the user back to age-gate/onboarding.

## 9. Architecture and affected systems

`app/home.tsx`, organ components, daily log domain, local store. No production systems.

## 10. Files and paths in scope

- `app/home.tsx`, `src/domain/organs.ts`, `src/data/daily-log-store.ts`, organ UI, tests
- State/continuation/manifest after implementation

## 11. Supporting documents to create or update

This plan → verified after implementation. Manifest PPS-HOME-* → verified.

## 12. Ordered implementation tasks

1. Organ baseline and tick math + tests.
2. Daily log store + midnight boundary.
3. Home UI: organs, Log, strip, undo.
4. Verify lint/test/typecheck.

## 13. Adaptive role and delegation map

| Role ID | Required or skipped | Reason | Predecessor | Owned paths | Gate evidence | Status |
|---|---|---|---|---|---|---|
| product-manager-subagent | required | Daily commitment UX is the PRD home | phase 1 | inherited PRD | HOME requirements | pending |
| ui-ux-developer-subagent | required | Organ motion, Snapchat chrome | PM | `app/home.tsx`, organ UI | a11y labels | pending |
| software-engineer-subagent | required | Log engine + persistence | UX | `src/`, `app/home.tsx` | tests | pending |
| security-engineer-subagent | required | Health-adjacent scores, minors | Engineering | residuals | no medical claims | pending |
| growth-marketing-subagent | skipped | No launch this phase | — | — | — | skipped |
| project-lead-subagent | required | Reconcile, no publish | Security | STATE | owner boundary | pending |

## 14. Test and validation matrix

| Requirement | Validation method | Expected evidence | Status |
|---|---|---|---|
| Baseline band | unit tests | 35–85, clamp 1–100 | pending |
| Log damage / midnight recover | unit tests | recover only if under cap | pending |
| Undo | unit tests | log decrements | pending |
| Toolchain | npm scripts | lint/test/typecheck | pending |

## 15. Security, privacy, reliability, accessibility, and performance checks

Keep wellness disclaimer. Log button labeled. Reduce Motion: static organs if needed. No new secrets.

## 16. Environment-variable registry

No new names.

## 17. Deferred human-action queue

Unchanged store/legal/Supabase/ads items.

## 18. Rollback and recovery

Revert phase-2 commits; `/home` placeholder can return.

## 19. Acceptance criteria

User finishing onboarding lands on organs + Log. Logging and midnight rules match the locked product brief. Checks pass.

## 20. Completion evidence

Not implemented.

## 21. Deviations and follow-ups

Written after phase 1; not executed in the same turn as onboarding.

## 22. Next Plan Generation Prompt

Read `/AGENTS.md`, the complete core agent context, `/instructions/PROJECT_PLANNING.md`, `/instructions/ROLES.md`, the original `docs/plans/phase_0_foundations_plan.md`, this completed phase plan, the active workstream manifest and role handoffs, all completion evidence, current repository state, active blockers, and relevant decisions. Confirm this phase and every required role gate are fully implemented and validated. Then generate exactly one exhaustive next phase plan at `docs/plans/phase_3_settings-savings_plan.md`. Derive it from the phase-0 roadmap and verified current state, preserve unresolved requirements, include all required plan sections and adaptive role decisions, defer non-blocking human actions to the final phase, and do not implement the next phase until the plan is written.
