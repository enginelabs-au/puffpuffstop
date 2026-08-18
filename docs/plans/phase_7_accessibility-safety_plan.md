---
plan: phase_7_accessibility-safety
status: verified
created: 2026-08-18
updated: 2026-08-18
owner: lead-agent
source_phase: docs/plans/phase_6_brand-identity_plan.md
workstream: docs/workstreams/20260818-puffpuffstop-mobile-mvp/manifest.md
---

# Phase 7: Accessibility and destructive-action safety

## 1. Objective

Close leftover PRD gaps that are still agent-executable: Dynamic Type limits (`PPS-NFR-05`), confirm-before-delete, and a shareable local export (`PPS-SET-02`). Do not submit, advertise, or send OS notifications.

## 2. Relation to project end-state

The loop already works. Phase 7 makes large text usable and stops an accidental wipe.

## 3. Entry criteria and inherited evidence

Phase 6 verified and committed (`29bc181`). Owner asked to proceed.

## 4. Scope

- Shared `AppText` with Dynamic Type enabled and a 1.4× cap.
- Settings delete uses a confirm sheet/alert before `deleteLocalData()`.
- Export offers the system share sheet and keeps on-screen JSON as fallback.
- Refresh the final checklist. Do not invent phase 8 unless the owner asks.

## 5. Non-goals

OS notification permission, Lottie/Rive, SQLite rewrite, store submit, ads, secrets, remote DB.

## 6. Current-state audit

Text scales without a cap. Delete wipes immediately. Export only dumps JSON on screen.

## 7. Assumptions

- 1.4× is enough for Dynamic Type without breaking the Log target.
- `Alert.alert` is enough confirmation; no second settings screen.
- Share may be unavailable in Node; fallback stays.

## 8–12. Implementation

`src/ui/AppText.tsx`, `fontScale` tokens, privacy confirm copy, settings Alert/Share, shared UI text swap.

## 13. Adaptive role map

Parent-led. UX + SWE required. Security inherited (delete still local-only). Growth skipped.

| Role ID | Required or skipped | Reason | Status |
|---|---|---|---|
| product-manager-subagent | inherited | PPS-NFR-05 / PPS-SET-02 | PASS inherited |
| ui-ux-developer-subagent | required | Dynamic Type + confirm copy | complete PASS |
| software-engineer-subagent | required | AppText, Alert, Share | complete PASS |
| security-engineer-subagent | skipped | No new data leaving the device except user-initiated share | skipped |
| growth-marketing-subagent | skipped | No listings or campaigns | skipped |
| project-lead-subagent | required | Checklist refresh | CONDITIONAL |

## 14. Tests

Confirm copy unit test. fontScale lock. lint/test/typecheck.

## 15. Security

Share is user-initiated and local. Delete still clears the snapshot after confirm.

## 16. Environment variables

None new.

## 17. Deferred human actions

Unchanged store/legal/EAS items. Simulator smoke still owner/device.

## 18. Rollback

Revert the phase-7 commit.

## 19. Acceptance criteria

Large text is allowed and capped. Delete asks first. Export can share JSON. No store submit.

## 20. Completion evidence

- `npm run lint` 0
- `npm test` 47 pass
- `npm run typecheck` 0
- Phase 6 commit `29bc181`

## 21. Deviations

Owner authorized a seventh implementation phase.

## 22. Next Plan Generation Prompt

Update `docs/plans/final_implementation_checklist.md` only. Do not invent phase 8 unless the owner explicitly asks.
