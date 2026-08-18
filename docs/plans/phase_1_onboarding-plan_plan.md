---
plan: phase_1_onboarding-plan
status: verified
created: 2026-08-18
updated: 2026-08-18
owner: lead-agent
source_phase: docs/plans/phase_0_foundations_plan.md
workstream: docs/workstreams/20260818-puffpuffstop-mobile-mvp/manifest.md
blueprint: docs/blueprints/2026-08-18_puffpuffstop.md
---

# Phase 1: Onboarding and cessation plan

## 1. Objective

Implement the 16+ one-question onboarding flow, puff-estimation math, and the personal cessation plan screen so a user can go from the existing age-gate to a “See my organs” CTA. Local only. No store publish, no remote mutation, no organ home or Log button (phase 2).

## 2. Relation to project end-state

Phase 0 delivered the Expo skeleton and age-gate. Phase 1 captures the draft profile and commitment that later phases use for organ scores, daily logging, and puff savings. The plan screen is the product’s first “you have a number” moment.

## 3. Entry criteria and inherited evidence

- Phase 0 verified: lint 0, test 12/12, typecheck 0; commits `51c63bf` and `d6b1656`.
- Owner decision: `APPROVE` for local phase-1 planning and implementation (2026-08-18).
- Security residual: SEC-P0-001 client age-gate; SEC-P0-002 Expo `image-size` advisories. Do not waive.
- Age-gate routes to `/foundation` today; this phase retargets 16+ users into onboarding.
- Estimation helpers already exist: `daysIn`, `puffsPerDay`, `historyDays`, `commitmentPuffs`.

## 4. Scope

- Fourteen onboarding questions: existing age-gate plus thirteen new one-question screens.
- Rotary 0–999 dials with increment/decrement (not gesture-only) and period chips.
- Brand chips including Other and Custom; catalog rows get estimation defaults (not ads).
- Plan summary: puffs/day, week, month, year; devices/week when computable; optional spend/week; today’s commitment; wellness disclaimer; CTA to a phase-2 placeholder home.
- In-memory draft store for this phase (SQLite persistence is later).
- Domain tests for validation and plan math.

## 5. Non-goals

- Organ cards, Log button, midnight recovery, settings, puff-savings ledger.
- AsyncStorage/SQLite, auth, notifications, Lottie.
- Card/staking, IAP, ads, store submit, remote `db push`.
- Kids Category or under-16 tracking.
- Generating the phase-2 plan until this phase is verified.

## 6. Current-state audit

- Routes: `/` → `/age-gate` → `/foundation` or `/blocked`.
- `BRAND_CATALOG` is empty; names are reserved.
- Tokens and age-gate copy already say 16+ / not medical / not kids.
- No onboarding draft types or UI primitives for dials/chips.

## 7. Assumptions, constraints, risks, and decisions

- Month=30 and year=365 remain.
- Catalog puff defaults are estimation guesses, labeled as estimates, not purchase prompts.
- Nickname empty → `"friend"`.
- Cost and trigger screens are skippable; required: duration, frequency, brand path, strictness, motivation, quit window, cut-down.
- CTA “See my organs” opens `/home` placeholder (organs not built).
- Parent lead implements; no extra Task runtime required.
- Client age-gate residual stays documented.

## 8. Dependencies

Age-gate allow → onboarding draft → plan summary → placeholder home. Tests do not depend on Expo runtime.

## 9. Architecture and affected systems

Local Expo Router screens under `app/onboarding/` and `app/plan.tsx`. Domain under `src/domain/`. Shared UI under `src/ui/`. In-memory `src/data/onboarding-store.ts`. No new production systems.

## 10. Files and paths in scope

- `docs/plans/phase_1_onboarding-plan_plan.md`
- `app/age-gate.tsx`, `app/onboarding/[step].tsx`, `app/plan.tsx`, `app/home.tsx`
- `src/domain/onboarding.ts`, `src/domain/plan-summary.ts`, tests
- `src/data/brands.ts`, `src/data/onboarding-store.ts`
- `src/ui/OnboardingFrame.tsx`, `src/ui/RotaryDial.tsx`, `src/ui/ChipGroup.tsx`
- `package.json` test glob
- `.cursor/STATE.md`, continuation, workstream manifest, owner handoff

## 11. Supporting documents to create or update

- This plan (draft → verified).
- Manifest gate → phase-1 implementation, then owner note that phase 2 is not authorized yet.
- Continuation log.

## 12. Ordered implementation tasks

1. Seed catalog estimate rows and plan-summary helpers. Evidence: unit tests.
2. In-memory draft store + step validation. Evidence: unit tests.
3. Shared dial, chips, frame. Evidence: lint/typecheck; a11y labels on controls.
4. Age-gate → `/onboarding/nickname`; thirteen step screens; `/plan`; `/home` placeholder.
5. Verify lint/test/typecheck. Update state/memory.

## 13. Adaptive role and delegation map

| Role ID | Required or skipped | Reason | Predecessor | Owned paths | Gate evidence | Status |
|---|---|---|---|---|---|---|
| product-manager-subagent | required | Phase 1 is the locked PRD onboarding contract | owner APPROVE | workstream PM dir (inherited) | screens match PPS-ONB-* | parent-led |
| ui-ux-developer-subagent | required | One-question flow, dial, chips | PM | `src/ui/`, onboarding screens | a11y increment/decrement | parent-led |
| software-engineer-subagent | required | Implement routes, math, tests | UI/UX | `app/`, `src/` | lint/test/typecheck | parent-led |
| security-engineer-subagent | required | Minors, wellness copy, no money | Engineering | residual notes | no card UI; blocked path unchanged | parent-led |
| growth-marketing-subagent | skipped | No launch/copy campaign this phase | — | — | no store metadata change | skipped |
| project-lead-subagent | required | Reconcile and keep owner boundary | Security | STATE, handoff | no publish | parent-led |

Growth skip: no positioning/distribution change beyond existing 16+ wellness copy.

## 14. Test and validation matrix

| Requirement | Validation method | Expected evidence | Status |
|---|---|---|---|
| PPS-ONB-02–14 screens | route + draft validation tests | each required step rejects empty/invalid | verified |
| Estimation + commitment | unit tests | day/week/month/year, devices, spend, clamp | verified |
| Plan copy | inspect + test strings | disclaimer + CTA present | verified |
| Under-16 | existing age-gate tests + route | still `/blocked`, no draft | verified |
| Toolchain | npm scripts | lint 0, tests pass, typecheck 0 | verified |

## 15. Security, privacy, reliability, accessibility, and performance checks

- Do not persist under-16 answers.
- No medical claims; disclaimer on plan.
- Brand picker is estimation-only.
- Dial has +/− buttons, 44pt targets.
- No new env secrets. SEC-P0-001/002 remain.

## 16. Environment-variable registry

No new names. Existing: `EXPO_PUBLIC_APP_ENV`, `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_PROJECT_REF`, `EAS_PROJECT_ID`.

## 17. Deferred human-action queue

Apple/Google, privacy policy, hosted Supabase, legal review, ads, 18+ money — unchanged, not blocking.

## 18. Rollback and recovery

Revert this phase’s commits on `cursor/puffpuffstop-phase-0-foundations-1685`. Age-gate and blocked screens must keep working.

## 19. Acceptance criteria

- 16+ user can complete onboarding and see a plan with the locked fields.
- Under-16 still hard-stops with no tracking.
- Commitment = max(0, estimatedPuffsPerDay − cutDownPerDay).
- CTA reaches `/home` placeholder only.
- lint/test/typecheck pass.

## 20. Completion evidence

- `npm run lint` exit 0
- `npm test` 18 pass / 0 fail
- `npm run typecheck` exit 0
- Routes: `/age-gate` → `/onboarding/nickname` … `/cut-down` → `/plan` → `/home`

## 21. Deviations and follow-ups

- Catalog is no longer empty: estimate defaults for math.
- Home organs remain phase 2.
- Growth role skipped for this phase only.

## 22. Next Plan Generation Prompt

Read `/AGENTS.md`, the complete core agent context, `/instructions/PROJECT_PLANNING.md`, `/instructions/ROLES.md`, the original `docs/plans/phase_0_foundations_plan.md`, this completed phase plan, the active workstream manifest and role handoffs, all completion evidence, current repository state, active blockers, and relevant decisions. Confirm this phase and every required role gate are fully implemented and validated. Then generate exactly one exhaustive next phase plan at `docs/plans/phase_2_home-log_plan.md`. Derive it from the phase-0 roadmap and verified current state, preserve unresolved requirements, include all required plan sections and adaptive role decisions, defer non-blocking human actions to the final phase, and do not implement the next phase until the plan is written. Phase 2 must implement organ-health cards, the Snapchat-style Log button, daily commitment comparison, per-puff damage, and local-midnight recovery without store publish or remote mutation.
