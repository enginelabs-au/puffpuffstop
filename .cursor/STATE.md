# STATE.md

## Current Objective

- Phase 11 voice log: Siri / Gemini instead of volume buttons. Identity stays `Cursor Agent <cursoragent@cursor.com>`.

## Current Status

- Phase 10 verified locally. Phase 11 pivoted from hardware quick log to native-assistant logging.
- Do not publish the app. Do not use the owner's personal Gmail.

## Project Phase

- Phases 0–9 verified on `origin/main`. Phases 10–11 verified locally; owner asked to commit and push.

## Active Plan

- `docs/plans/phase_11_quick-log-hardware_plan.md` (status: verified locally after voice pivot)
- Prior: `docs/plans/phase_10_friendly-science-onboarding_plan.md` (status: verified)
- Closure: `docs/plans/final_implementation_checklist.md` (status: open)

## Active Workstream

- `docs/workstreams/20260901-quick-log-hardware/manifest.md`
- Task ID: `20260901-quick-log-hardware`

## Active Role and Gate

- Parent-led software implementation. Other roles skipped (owner-specified product).
- Last integrated validation: `npm run lint` 0; `npm test` 77/77; `npm run typecheck` 0. Debug build 8 installed. Owner confirmed Siri add/remove works.

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
- `/memory/memories/2026-09-01-continuation.md`
- `docs/plans/phase_11_quick-log-hardware_plan.md`
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

## Current Working State

- Settings has Redo setup (keeps today’s log and savings).
- Appearance defaults to dark. Settings → Appearance switches Dark / Light.
- Theme style factories now take a `palette` argument and keep a module-level `color` fallback so Fast Refresh cannot crash on a missing `color` binding.
- Device Metro on 8082 was dead and serving a stale mix; rebuilt and relaunched on Free Malware. Fresh bundle had no `ReferenceError`.
- Timezone: onboarding after nickname + Settings → Day.
- Phase 12 health wearables is planned only. No HealthKit/Fitbit code yet.

## Next Actions

1. Do not store-submit. Do not uninstall.
2. Phase 12 wearables stays planned only.

## Last Updated

- 2026-09-01 — Owner confirmed Siri add/remove. Committing and pushing phases 10–11.
