---
plan: phase_8_local-reminders
status: verified
created: 2026-08-18
updated: 2026-08-18
owner: lead-agent
source_phase: docs/plans/phase_7_accessibility-safety_plan.md
workstream: docs/workstreams/20260818-puffpuffstop-mobile-mvp/manifest.md
---

# Phase 8: Opt-in local daily reminders

## 1. Objective

Wire the existing Settings reminder flag to one opt-in local daily check-in. Ask for notification permission only when the user turns reminders on. Cancel the schedule when they turn it off or delete local data.

## 2. Relation to project end-state

Phase 8 was skipped for notifications or a SQLite rewrite. The versioned JSON snapshot already covers local persist. This phase closes the remaining deferred capability: a device-local reminder, not remote push.

## 3. Entry criteria and inherited evidence

Phases 0–7 verified. Phase 9 identity/journey is implemented locally. Owner asked to finish phase 8, then commit and merge to `main`.

## 4. Scope

- Domain copy and 19:00 local daily schedule.
- Injectable reminder driver; Expo adapter; memory driver for Node tests.
- Settings toggle asks permission, schedules or cancels, and reverts if denied.
- Boot re-syncs from persisted settings. Delete cancels the schedule.
- `expo-notifications` config plugin with remote/background push off.

## 5. Non-goals

Remote push, FCM/APNs tokens, marketing notifications, badge spam, SQLite rewrite, `eas build`, store submit, ads, secrets, remote DB.

## 6. Current-state audit

`settings.remindersEnabled` persists but the Settings copy says notifications are not sent. No `expo-notifications` dependency.

## 7. Assumptions, constraints, risks, and decisions

- 19:00 local is a reversible evening default; no time picker in this phase.
- Permission denial keeps the flag off.
- JSON snapshot stays the persist layer.
- A physical device needs a native rebuild before the OS prompt appears.

## 8. Dependencies

`expo-notifications` matching Expo 57. Existing settings persist and privacy delete.

## 9. Architecture and affected systems

`src/domain/reminders.ts` owns schedule constants. `src/data/reminders.ts` owns driver + apply/sync. Settings and root layout call those helpers. No server.

## 10. Files and paths in scope

`src/domain/reminders.ts`, `src/data/reminders.ts`, tests, `app/settings.tsx`, `app/_layout.tsx`, `src/data/privacy.ts`, `app.json`, `package.json`, plans/checklist/workstream.

## 11. Supporting documents to create or update

This plan. Supersede `phase_8_skipped_plan.md`. Refresh checklist, manifest, owner handoff, STATE, continuation.

## 12. Ordered implementation tasks

1. Domain schedule + tests.
2. Driver, apply/sync, delete cancel, boot hook.
3. Settings copy and toggle.
4. Plugin + dependency.
5. lint/test/typecheck.

## 13. Adaptive role and delegation map

Parent-led. No Task runtime.

| Role ID | Required or skipped | Reason | Status |
|---|---|---|---|
| product-manager-subagent | inherited | Still 16+ wellness, not medical, not kids | PASS inherited |
| ui-ux-developer-subagent | required | Settings reminder copy and permission-gated toggle | parent-led |
| software-engineer-subagent | required | Driver, schedule, tests, plugin | parent-led |
| security-engineer-subagent | skipped | Local only; remote push explicitly off | skipped |
| growth-marketing-subagent | skipped | No campaigns or listing changes | skipped |
| project-lead-subagent | required | Checklist + merge handoff | parent-led |

## 14. Test and validation matrix

| Requirement | Validation method | Expected evidence | Status |
|---|---|---|---|
| Daily 19:00 local schedule | domain test | hour/id/copy locked | verified |
| Grant schedules; deny stays off | data test | memory driver | verified |
| Delete cancels | data test | scheduled empty | verified |
| Lint/typecheck | CLI | 0 | verified |

## 15. Security, privacy, reliability, accessibility, and performance checks

No remote push. No new tokens or secrets. Permission only after opt-in. Toggle labeled. Delete clears the schedule.

## 16. Environment-variable registry

None new.

## 17. Deferred human-action queue

| Action | Why agent cannot perform it | Earliest required phase | Blocking now? | Final-checklist destination |
|---|---|---|---|---|
| Native rebuild / device permission smoke | Owner device + EAS or local native run | after merge | no | checklist |
| Store / legal / EAS login | Owner accounts | closure | no | checklist |

## 18. Rollback and recovery

Revert the phase-8 commit. Turn the Settings toggle off or delete local data to cancel a scheduled reminder.

## 19. Acceptance criteria

Toggle schedules only after grant. Deny and delete cancel. Tests pass. No push credentials. No store submit.

## 20. Completion evidence

- `npm run lint` 0
- `npm test` 58/58
- `npm run typecheck` 0
- `expo-notifications` ~57.0.12 with remote/background push off

## 21. Deviations and follow-ups

Owner previously skipped this phase; this reverses that skip. SQLite remains deferred because JSON snapshot already persists.

## 22. Next Plan Generation Prompt

Refresh `docs/plans/final_implementation_checklist.md` only. Do not invent phase 10 unless the owner explicitly asks.
