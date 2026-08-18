---
plan: phase_4_store-ready
status: verified
created: 2026-08-18
updated: 2026-08-18
owner: lead-agent
source_phase: docs/plans/phase_3_settings-savings_plan.md
workstream: docs/workstreams/20260818-puffpuffstop-mobile-mvp/manifest.md
---

# Phase 4: Store-ready hardening

## 1. Objective

Harden the local app for later store review: persist onboarding/log/savings on device, privacy-policy copy, light recovery motion, and the final implementation checklist. This still does **not** authorize production deploy, App Store/Play submit, ads, secrets, or remote DB mutation.

## 2. Relation to project end-state

Phases 0–3 delivered the usable local loop. Phase 4 is the last agent-executable implementation phase: data survives reload, store-facing copy exists in-app, and remaining owner-only actions live in the final checklist.

## 3. Entry criteria and inherited evidence

Phase 3 verified and committed (`63ff524`). SEC-P0 residuals still documented. Owner asked to commit phase 3 and proceed.

## 4. Scope

- Replace in-process-only stores with a versioned JSON snapshot (SQLite equivalent for this MVP).
- Hydrate before the first route so a completed plan can resume after the age gate.
- Under-16 path deletes and persists empty local data.
- In-app privacy policy. Cloud sync status is informational only; no client connects.
- Light recovering pulse on organ cards.
- Replay security review after persistence.
- Generate `docs/plans/final_implementation_checklist.md`.

## 5. Non-goals

Publishing, paid ads, card processing, holding funds, signed-in sync, OS notifications, remote `db push`.

## 6. Current-state audit

In-process stores were lost on reload. Age-gate always restarted onboarding. No privacy route. No persist driver.

## 7. Assumptions, constraints, risks, and decisions

- A versioned JSON snapshot is the persistence equivalent; Expo File + Paths writes it on device.
- Node unit tests use a memory driver because `expo-file-system` has no document directory in Node.
- Snapshot is not encrypted at rest (SEC-P4-001).
- Growth skipped; no store listing campaign copy.

## 8. Dependencies

Phase 3 stores and privacy delete. `expo-file-system` ~57.0.4.

## 9. Architecture and affected systems

`persist-hook` avoids store/persist import cycles. Stores call `persistNow()` after mutations. Root layout `bootPersist()` installs the file driver when available, then hydrates.

## 10. Files and paths in scope

`src/data/persist*.ts`, `src/data/snapshot.ts`, `src/data/file-driver.ts`, stores, `app/_layout.tsx`, `app/age-gate.tsx`, `app/privacy.tsx`, `app/settings.tsx`, `src/ui/OrganCard.tsx`, `src/domain/privacy-policy.ts`, `src/config/sync.ts`, workstream security artifacts, this plan, final checklist.

## 11. Supporting documents to create or update

- `docs/plans/final_implementation_checklist.md`
- `docs/workstreams/.../security-engineer-subagent/artifacts/phase-4-review.md`
- Manifest, owner handoff, STATE, continuation

## 12. Ordered implementation tasks

1. Snapshot capture/restore + memory persist driver + tests.
2. Wire store mutations and delete to persist.
3. File driver + root hydrate.
4. Age-gate resume/delete paths.
5. Privacy screen, sync stub, recovering pulse.
6. Security replay + final checklist.

## 13. Adaptive role map

Parent-led. Required: SWE, Security (persistence replay), Project Lead (closure). PM/UX inherited. Growth skipped (no campaigns or store submit).

| Role ID | Required or skipped | Reason | Status |
|---|---|---|---|
| product-manager-subagent | required (inherited) | Locked 16+ / not medical / local money | PASS inherited |
| ui-ux-developer-subagent | required (inherited) | Privacy route + recovering pulse | PASS inherited |
| software-engineer-subagent | required | Persist, routes, tests | complete PASS |
| security-engineer-subagent | required | Persistence replay | CONDITIONAL |
| growth-marketing-subagent | skipped | No listings, ads, or campaigns this phase | skipped |
| project-lead-subagent | required | Final checklist + owner handoff | CONDITIONAL |

## 14. Test and validation matrix

| Requirement | Validation method | Expected evidence | Status |
|---|---|---|---|
| Snapshot round-trip | unit | `snapshot.test.ts` | verified |
| Delete persists empty | unit | `privacy.test.ts` | verified |
| File driver unused in Node | unit | `file-driver.test.ts` | verified |
| Privacy copy constraints | unit | `privacy-policy.test.ts` | verified |
| Sync never connects | unit | `sync.test.ts` | verified |
| Lint/typecheck | CLI | 0 / 0 | verified |

## 15. Security, privacy, reliability, accessibility, and performance checks

See `artifacts/phase-4-review.md`. Residuals SEC-P0-001, SEC-P0-002, SEC-P4-001.

## 16. Environment-variable registry

No new names. Existing: `EXPO_PUBLIC_APP_ENV`, `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_PROJECT_REF`, `EAS_PROJECT_ID`.

## 17. Deferred human-action queue

Store accounts, listings, hosted privacy URL, legal review, Supabase project, EAS, ads — all in the final checklist. Not blocking local close.

## 18. Rollback

Revert the phase-4 commit. Delete `puffpuffstop-snapshot.json` on device if needed.

## 19. Acceptance criteria

Completed onboarding survives reload after age-gate. Under-16 clears persisted data. Privacy policy is readable in-app. No payment or sync client. Final checklist exists.

## 20. Completion evidence

- `npm run lint` 0
- `npm test` 40 pass
- `npm run typecheck` 0
- Phase 3 commit `63ff524`

## 21. Deviations and follow-ups

Used a versioned JSON snapshot instead of SQLite. Equivalent for local MVP; SQLCipher/SQLite remains a later option if encryption-at-rest is required.

## 22. Next Plan Generation Prompt

Create `docs/plans/final_implementation_checklist.md` only. Do not invent another implementation phase.
