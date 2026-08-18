---
plan: phase_9_app-identity-journey
status: verified
created: 2026-08-18
updated: 2026-08-18
owner: lead-agent
source_phase: docs/plans/phase_8_skipped_plan.md
workstream: docs/workstreams/20260818-puffpuffstop-mobile-mvp/manifest.md
---

# Phase 9: App identity and local journey

## 1. Objective

Lock store-ready bundle IDs, add a snapshot migrator for older local files, and prove the full local loop in one journey test. Do not submit, advertise, or mutate a remote database.

## 2. Relation to project end-state

Phases 0–7 delivered the product loop. Phase 8 was skipped. Phase 9 makes later EAS builds and persist upgrades safer.

## 3. Entry criteria

Phase 7 committed (`dec05c3`). Owner asked to skip 8 and proceed to 9.

## 4. Scope

- iOS `bundleIdentifier` and Android `package`.
- `migrateSnapshot` so unversioned local files become v1; unknown versions still fail closed.
- One domain journey test: draft → plan → log → export → delete.
- Refresh the final checklist. Do not invent phase 10 unless the owner asks.

## 5. Non-goals

`eas build`, store submit, ads, secrets, notifications, SQLite rewrite, remote `db push`.

## 6. Current-state audit

`app.json` has no bundle IDs. Snapshots are v1-only with no upgrade path. Tests cover units, not the full loop.

## 7. Assumptions

- Bundle ID `au.com.enginelabs.puffpuffstop` matches the GitHub org without claiming a store listing.
- Unversioned objects with draft + dailyLog are treated as v1.

## 8–12. Implementation

`src/config/app-id.ts`, `app.json` identity, `migrateSnapshot` in persist hydrate, `src/data/journey.test.ts`.

## 13. Adaptive role map

Parent-led. SWE required. Security inherited (fail-closed unknown versions). Growth skipped.

| Role ID | Required or skipped | Reason | Status |
|---|---|---|---|
| product-manager-subagent | inherited | Identity stays 16+ / not kids | PASS inherited |
| ui-ux-developer-subagent | skipped | No new screens | skipped |
| software-engineer-subagent | required | IDs, migrator, journey test | complete PASS |
| security-engineer-subagent | skipped | No new network or auth | skipped |
| growth-marketing-subagent | skipped | No listings or campaigns | skipped |
| project-lead-subagent | required | Checklist refresh | CONDITIONAL |

## 14. Tests

App ID lock, unversioned migrate, journey loop. lint/test/typecheck.

## 15. Security

Unknown snapshot versions still reject. No secrets in `app.json`.

## 16. Environment variables

None new.

## 17. Deferred human actions

Unchanged store/legal/EAS login items.

## 18. Rollback

Revert the phase-9 commit.

## 19. Acceptance criteria

Bundle IDs exist. Unversioned snapshots hydrate. Journey test passes. No store submit.

## 20. Completion evidence

- `npm run lint` 0
- `npm test` 50 pass
- `npm run typecheck` 0
- Phase 7 commit `dec05c3`. Phase 8 skipped.

## 21. Deviations

Owner originally skipped phase 8; later asked to finish it as local reminders.

## 22. Next Plan Generation Prompt

Update `docs/plans/final_implementation_checklist.md` only. Do not invent phase 10 unless the owner explicitly asks.
