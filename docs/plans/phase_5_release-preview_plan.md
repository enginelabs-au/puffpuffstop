---
plan: phase_5_release-preview
status: verified
created: 2026-08-18
updated: 2026-08-18
owner: lead-agent
source_phase: docs/plans/phase_4_store-ready_plan.md
workstream: docs/workstreams/20260818-puffpuffstop-mobile-mvp/manifest.md
---

# Phase 5: Release-preview packaging

## 1. Objective

Close remaining agent-executable store-preview gaps: Log haptics, Reduce Motion, EAS build profiles, 16+ listing drafts, and a hostable privacy page. Do not submit, advertise, enter secrets, or mutate a remote database.

## 2. Relation to project end-state

Phases 0–4 delivered the local loop and persist. Phase 5 packages release-preview artifacts the owner can use later. Human-only store accounts stay on the final checklist.

## 3. Entry criteria and inherited evidence

Phase 4 verified and committed (`b6ae945`). Owner asked to commit and proceed. Residuals SEC-P0-001/002 and SEC-P4-001 remain.

## 4. Scope

- Haptic on Log and undo (`PPS-HOME-02`).
- Reduce Motion disables the recovering pulse (`PPS-NFR-05`).
- `eas.json` preview/production profiles with no credentials.
- Draft iOS/Android listing copy that forbids kids/medical/wallet claims.
- Hostable `docs/legal/privacy.html` plus optional `EXPO_PUBLIC_PRIVACY_POLICY_URL` (HTTPS only).
- Refresh the final checklist. Do not invent phase 6 unless the owner asks.

## 5. Non-goals

Store submit, `eas build`/`eas submit`, paid ads, OS notification permission, Lottie/Rive asset packs, SQLite rewrite, remote `db push`.

## 6. Current-state audit

No `eas.json`. Log has no haptic. Organ pulse ignores Reduce Motion. Privacy is in-app only. Listing copy is not drafted as store text.

## 7. Assumptions, constraints, risks, and decisions

- Owner request for phase 5 overrides the phase-4 “checklist only” prompt.
- EAS project ID stays an env name until the owner runs `eas init`.
- Hosted privacy URL is unused until the owner publishes a page.

## 8. Dependencies

Phase 4 persist/privacy. `expo-haptics` via Expo SDK 57.

## 9. Architecture and affected systems

Haptics and Reduce Motion are best-effort native wrappers that no-op in Node. Listing/privacy copy stay in domain modules so unit tests can lock forbidden claims.

## 10. Files and paths in scope

`src/ui/haptics.ts`, `src/ui/OrganCard.tsx`, `app/home.tsx`, `app/settings.tsx`, `src/config/env.ts`, `src/domain/store-listing.ts`, `docs/legal/privacy.html`, `docs/store/*.md`, `eas.json`, `.env.example`, checklist/state.

## 11. Supporting documents to create or update

`docs/plans/final_implementation_checklist.md`, workstream manifest, owner handoff, continuation.

## 12. Ordered implementation tasks

1. Write this plan.
2. Haptics + Reduce Motion.
3. Env name + settings HTTPS link.
4. Store listing drafts + hostable privacy HTML.
5. `eas.json` without secrets.
6. Validate and update checklist.

## 13. Adaptive role map

Parent-led. Growth required for listing constraints. Security required for HTTPS URL + no-submit. SWE required. PM/UX inherited.

| Role ID | Required or skipped | Reason | Status |
|---|---|---|---|
| product-manager-subagent | required (inherited) | Locked 16+ / not medical | PASS inherited |
| ui-ux-developer-subagent | required | Haptic + Reduce Motion | complete PASS |
| software-engineer-subagent | required | Packaging + tests | complete PASS |
| security-engineer-subagent | required | HTTPS-only URL; no submit | CONDITIONAL |
| growth-marketing-subagent | required | Listing drafts, no campaigns | complete PASS |
| project-lead-subagent | required | Checklist refresh | CONDITIONAL |

## 14. Test and validation matrix

| Requirement | Validation | Status |
|---|---|---|
| Listing forbids kids/medical/wallet | unit | pending |
| Privacy HTML matches policy constraints | unit | pending |
| HTTPS-only hosted URL | unit | pending |
| Haptic helper no-ops in Node | unit | pending |
| lint/test/typecheck | CLI | pending |

## 15. Security

No secrets in `eas.json`. Hosted policy URL must be HTTPS. Do not call `eas submit`. Residuals unchanged.

## 16. Environment-variable registry

| Variable name | Purpose | Required by phase | Status |
|---|---|---|---|
| EXPO_PUBLIC_PRIVACY_POLICY_URL | Optional hosted policy link | 5 | name only |

## 17. Deferred human-action queue

Unchanged Apple/Google/EAS/legal/Supabase items.

## 18. Rollback

Revert the phase-5 commit. Remove `eas.json` if unused.

## 19. Acceptance criteria

Log can request a haptic. Reduce Motion stops the pulse. Listing drafts exist and fail tests if kids/medical/wallet language appears. Privacy HTML exists. EAS profiles exist without credentials. No store submit.

## 20. Completion evidence

- `npm run lint` 0
- `npm test` 46 pass
- `npm run typecheck` 0
- Phase 4 commit `b6ae945`

## 21. Deviations

Owner authorized a fifth implementation phase after the checklist already existed.

## 22. Next Plan Generation Prompt

Update `docs/plans/final_implementation_checklist.md` only. Do not invent phase 6 unless the owner explicitly asks.
