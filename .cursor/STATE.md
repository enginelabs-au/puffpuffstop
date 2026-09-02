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
- Last integrated validation: `npm test` 121/121; `npm run typecheck` 0; `npm run lint` 0. Release build 31 installed on Free Malware.

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
- `src/domain/pacing.ts`, `src/domain/organs.ts`, `src/ui/PacingMeter.tsx`, `src/ui/OrganFold.tsx`, `app/onboarding/[step].tsx`, `app/home.tsx`
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
- Goal pacing: bases are ceil(goal/24), ceil(hour/2), ceil(hour/4). Unused leftover still rolls (lookback 3). Overage is a debt: 3 of 2 last hour → 0/1 next; more overage can hold 0/0 until baseline returns. Extra puffs never become credit. Yellow = slot used up; red = this slot or the daily goal is exceeded. Numerator is only logs in the current window. 15/30 cannot exceed the hour still open. Cap is remaining daily goal, including untimed logs. No midnight bank of every empty hour. No “Credits” label.
- Pace timers vibrate once when a 15/30/60 window lapses and that window is green (yellow→green or green→green). No vibrate if the new window is yellow or if a log only flips the color.
- Onboarding asks Yes/No for hourly interval pacing after cut-down. Yes opens the Home pace fold on first use; No starts it closed. Missing field on an existing plan defaults to Yes/open. Organs use the same fold, open by default; closed header shows the average of all five organ scores.
- Leftover lock-screen notices default on with hourly pacing. A one-time repair turns them back on if an earlier opt-in default had stored them off. Scheduling uses iOS time-interval triggers and time-sensitive interruption. The 2s voice poll no longer cancels imminent notices. Settings shows the next leftover time. Log puff action remains. Onboarding still asks Yes/No.
- Home shows a one-shot amber banner when timed logs in the last 60 minutes jump vs the hour before (at least 3, +2, and double if the prior hour was not empty). Copy: “Your usage has increased in the last hour.” Tap or 8s dismiss; once per clock hour.

## Current Working State

- Settings has Redo setup (keeps today’s log and savings).
- Appearance defaults to dark. Settings → Appearance switches Dark / Light.
- Theme style factories now take a `palette` argument and keep a module-level `color` fallback so Fast Refresh cannot crash on a missing `color` binding.
- Timezone: onboarding after nickname + Settings → Day.
- Phase 12: onboarding + Settings connect Health/Fitbit. Fitbit callback route is `app/fitbit.tsx`.
- 2026-09-02: Release build 10 installed on Free Malware (`0.0.1` / `10`). JS bundle is embedded. Unplug is safe.
- Goal pacing stacked on Home. Unused hourly puffs raise this hour and split into 30/15. Watch banner only if Health is on and samples are arriving.
- Release build 31: leftover notices actually schedule (repair + time-interval + no 2s cancel).

## Next Actions

1. Owner can tap the top-right score circle on Home to open 7/30/84-day goal stats. Today seeds history; past days start from this install.
2. Owner: in Google Health, share heart rate / oxygen / breathing to Apple Health, then Sync Apple Health in PuffPuffStop and log a puff. Direct Fitbit login stays off until a Fitbit app id exists.
3. Do not store-submit.

## Last Updated

- 2026-09-02 — Leftover lock-screen notices not arriving; Release 31 repair.
