---
plan: phase_3_settings-savings
status: verified
created: 2026-08-18
updated: 2026-08-18
owner: lead-agent
source_phase: docs/plans/phase_2_home-log_plan.md
workstream: docs/workstreams/20260818-puffpuffstop-mobile-mvp/manifest.md
---

# Phase 3: Settings and puff savings

## 1. Objective

Add settings (profile, goals, brand cost, local reminder flag, privacy export/delete) and a local Puff Savings ledger. No card, custody, or payout.

## 2. Relation to project end-state

Home is the daily loop. Settings edits the commitment inputs. Savings is estimated money not spent after under-cap days.

## 3. Entry criteria and inherited evidence

Phase 2 verified (28 tests). Owner asked to commit phase 2 and proceed. SEC-P0-001/002 remain.

## 4. Scope

- `/settings` from home.
- Local reminder boolean only (no OS notifications).
- Stake per puff (default from device cost / puffs-per-device, else 0.10).
- Credit `max(0, commitment − logged) * stake` when a local day rolls and yesterday was at or under cap.
- Export JSON of draft + log + settings + savings. Delete resets all local stores and returns to the age-gate.

## 5. Non-goals

Cards, IAP, bank linking, store submit, ads, remote sync, real notifications.

## 6. Current-state audit

In-process onboarding and daily-log stores. No settings or savings.

## 7. Assumptions

- Savings credit happens on day rollover, not per log tap.
- Export is on-screen selectable text, not a file share sheet.
- Growth skipped; no store copy this phase.

## 8–12. Implementation

Domain `src/domain/savings.ts`, stores, `src/data/privacy.ts`, `src/data/day-cycle.ts`, `app/settings.tsx`, home Settings + pot line.

## 13. Adaptive role map

Parent-led. Required: PM (inherited), UX, SWE, Security (no money custody), Project Lead. Growth skipped.

## 14. Tests

Unit tests for savings math, day-cycle credit, export/delete. lint/test/typecheck.

## 15. Security

No card UI. Disclaimer on savings. Delete clears draft/log/settings/pot. Under-16 path still resets draft.

## 16. Environment variables

None new.

## 17. Deferred human actions

Unchanged store/legal/Supabase/ads items.

## 18. Rollback

Revert phase-3 commits.

## 19. Acceptance criteria

User can edit nickname/goals/stake, see a local pot, export JSON, and delete everything. No payment surfaces.

## 20. Completion evidence

- `npm run lint` 0
- `npm test` 32 pass
- `npm run typecheck` 0

## 21. Deviations

In-process stores remain (SQLite is phase 4).

## 22. Next Plan Generation Prompt

Generate `docs/plans/phase_4_store-ready_plan.md` after this phase is verified. Do not implement phase 4 until that plan is the active execution step.
