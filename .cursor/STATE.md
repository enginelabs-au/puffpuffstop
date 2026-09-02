# STATE.md

## Current Objective

- Phase 12 health wearables (in progress) plus hourly puff-goal pacing on onboarding, Settings, and Home.

## Current Status

- Phase 10 verified locally. Phase 11 pivoted from hardware quick log to native-assistant logging.
- Do not publish the app. Do not use the owner's personal Gmail.

## Project Phase

- Phases 0–9 verified on `origin/main`. Phases 10–11 verified locally; owner asked to commit and push.

## Active Plan

- `docs/plans/phase_12_health-wearables_plan.md` (status: implementing)
- Prior: `docs/plans/phase_11_quick-log-hardware_plan.md` (status: verified)
- Prior: `docs/plans/phase_10_friendly-science-onboarding_plan.md` (status: verified)
- Closure: `docs/plans/final_implementation_checklist.md` (status: open)

## Active Workstream

- `docs/workstreams/20260901-health-wearables/manifest.md`
- Task ID: `20260901-health-wearables`

## Active Role and Gate

- Parent-led software implementation. Other roles skipped (owner-specified product).
- Last integrated validation: `npm test` 95/95; `npm run typecheck` 0; `npm run lint` 0. Release build 22 on Free Malware.

## Predecessor Handoff

- `docs/workstreams/20260818-puffpuffstop-mobile-mvp/delivery/owner-handoff.md`

## Pending Remediation

- Residuals: SEC-P0-001 (now store-rating only), SEC-P0-002, SEC-P4-001.

## Owner Decision

- HARD RULE: always author/commit as `Cursor Agent <cursoragent@cursor.com>` via env vars. Never use personal Gmail. Never change git config. See `/memory/memories/git-identity.md` and `/USER.md`.
- Production, store publish, ads, secrets, cards, and remote DB mutation remain unauthorized.
- Volume-button quick log removed on both OS. Voice assistants only.

## Active Instructions

- `/instructions/LAUCH.md`
- `/instructions/PROJECT_PLANNING.md`
- `/instructions/ROLES.md`

## Active Items

- Owner asked to commit and push phases 10–11. Do not publish the app.

## Files in Active Use

- `/AGENTS.md`
- `/USER.md`
- `/STATE.md`
- `/INSTRUCTIONS.md`
- `/SKILLS.md`
- `/TOOLS.md`
- `/memory/MEMORY.md`
- `/memory/memories/git-identity.md`
- `/memory/memories/2026-09-02-continuation.md`
- `docs/plans/phase_12_health-wearables_plan.md`
- `src/domain/pacing.ts`, `src/ui/PacingMeter.tsx`, `src/ui/GoalResetRow.tsx`, `src/ui/WatchShiftBanner.tsx`, `plugins/health/`
- `app/`, `src/`, `plugins/quick-log/`

## Open Blockers

- None. Siri add/remove verified by owner; note moved to `/memory/blockers-fixed/siri-voice-subtract.md`.

## Attempts Performed

- Writing `.cursor/rules/git-identity-cursor-anonymous.mdc` was blocked by the fail-closed hook. Identity is recorded in USER, MEMORY, STATE, and `memories/git-identity.md`.

## Decisions and Assumptions

- Default currency AUD. Catalog puff counts are manufacturer “up to” claims. Nicotine chips are confirmed strengths only.
- VapeFree is a visual-tone reference, not a cloned pet.
- In-app age-gate screen removed; 16+ remains the store rating.
- Siri App Intents can write the snapshot with the app closed. Gemini has no public equivalent; Android uses a headless shortcut / Routine.
- Goal pacing: hourly allowance is ceil(goal / 24). Unused from the previous hour adds onto this hour (used 1 of 2 → 3; unused hour → 4) and the 30/15 rows split from that hour (4 → 2 / 1). Capped by remaining daily goal. No “Credits” label. Home watch banner only appears when Health is enabled and samples are actually arriving.

## Current Working State

- Settings has Redo setup (keeps today’s log and savings).
- Appearance defaults to dark. Settings → Appearance switches Dark / Light.
- Theme style factories now take a `palette` argument and keep a module-level `color` fallback so Fast Refresh cannot crash on a missing `color` binding.
- Timezone: onboarding after nickname + Settings → Day.
- Phase 12: onboarding + Settings connect Health/Fitbit. Fitbit callback route is `app/fitbit.tsx`.
- 2026-09-02: Release build 10 installed on Free Malware (`0.0.1` / `10`). JS bundle is embedded. Unplug is safe.
- Goal pacing stacked on Home. Unused hourly puffs raise this hour and split into 30/15. Watch banner only if Health is on and samples are arriving.

## Next Actions

1. Owner can log a puff with Health connected and check whether a heart/oxygen/breathing shift appears. Unplug is still safe.
2. Owner: in Google Health, share heart rate / oxygen / breathing to Apple Health, then Sync Apple Health in PuffPuffStop and log a puff. Direct Fitbit login stays off until a Fitbit app id exists.
3. Do not store-submit.

## Last Updated

- 2026-09-02 — Owner asked to commit and push phase 12 health, pacing, and watch-metric toggle as Cursor Agent.
