---
plan: phase_0_foundations
status: verified
created: 2026-08-18
updated: 2026-08-18
owner: lead-agent
source_phase: none
workstream: docs/workstreams/20260818-puffpuffstop-mobile-mvp/manifest.md
blueprint: docs/blueprints/2026-08-18_puffpuffstop.md
---

# Phase 0: Foundations

## 1. Objective

Establish the complete PuffPuffStop project map and the verified local foundations required to build later phases: Expo + TypeScript + Expo Router skeleton, design tokens, 16+ age-gate stub, empty brand catalog table, lint/test/typecheck scripts, Supabase project structure with an empty migration baseline, and environment-variable name wiring. No store submit. No later-phase screens unless required to validate the foundation.

## 2. Relation to project end-state

End-state (later, not this phase): a 16+ iOS/Android wellness habit coach with 14-step onboarding, plan math, Snapchat-style Log, cute organ cards, settings, local savings ledger, and optional future Supabase sync. Phase 0 makes that end-state implementable without production, publish, ads, secrets, cards, or remote DB mutation.

## 3. Entry criteria and inherited evidence

- Bootstrap: `bash .cursor/scripts/bootstrap.sh` exit 0 (2026-08-18).
- Preflight: `READY` at 2026-08-18T10:44:25.224Z.
- Owner brief locked; PM `PASS` handoff and PRD exist.
- Blueprint: `docs/blueprints/2026-08-18_puffpuffstop.md`.
- Authorization: local planning + phase 0 only.

## 4. Scope

- Documentation: this plan, workstream, role artifacts for UI/UX, Engineering, Security; Growth and Project Lead after product + security evidence.
- Application: Expo Router app that renders an age-gate stub and a blocked under-16 state.
- `src/theme/tokens.ts` design tokens.
- `src/data/brands.ts` empty typed catalog.
- Foundation math helpers + tests (`daysIn`, `puffsPerDay`, `historyDays`, `commitmentPuffs`, age-gate evaluator) because they validate the locked contract without building later screens.
- `supabase/config.toml` + empty baseline migration.
- `.env.example` names only.
- npm scripts: `lint`, `test`, `typecheck`.

## 5. Non-goals

- Full onboarding, plan, home, settings, animations, notifications.
- Filling the brand catalog.
- Remote `supabase db push`, Vercel deploy, EAS submit, ads, IAP, Bluetooth.
- Secret values, card UI, real-money accounts.
- Generating phase 1+ plan files before phase 0 is verified.

## 6. Current-state audit

| Area | Finding |
|---|---|
| Application | None. README is name + tagline only. |
| Control plane | Present and validated (77 files). |
| Docs | Indexes exist; no prior product blueprint/plan. |
| CI | `.github/workflows/agent-governance.yml` for agent config, not the app. |
| Supabase | No `supabase/` directory yet. |
| Node | v22.14.0, npm 10.9.7 in this environment. |

## 7. Assumptions, constraints, risks, and decisions

- `daysIn`: day=1, week=7, month=30, year=365 (provisional).
- Expo SDK and Router versions come from the current official template; pin what the generator installs.
- Age-gate stub is client-side only; Security must record that as a residual risk, not a PASS of a server control.
- Empty brand table means length 0 with stable TypeScript types, not placeholder brand rows.
- Risk: cute UI vs kids-app confusion — copy on the stub must say 16+ / not for children.
- Risk: organ math not implemented in phase 0 (correct).

## 8. Dependencies

- PM contract (done) → UI/UX spec → Engineering implementation → Security review → Growth (no campaigns) → Project Lead.
- npm registry for Expo packages.
- No owner credentials required to finish phase 0.

## 9. Architecture and affected systems

Local Expo client with Expo Router file routes. Domain modules under `src/`. Future SQLite and Supabase are reserved; phase 0 does not open a hosted project. No production systems.

Whole-project map (detail later):

| Phase | Slug | Implements |
|---|---|---|
| 0 | foundations | this plan |
| 1 | onboarding-plan | PPS-ONB-*, PPS-EST-01–05 |
| 2 | home-ritual | PPS-HOME-* |
| 3 | settings-savings | PPS-SET-*, PPS-MNY-01 |
| 4 | hardening | a11y, notifications opt-in, store-copy drafts, residual security; still no publish unless newly authorized |

## 10. Files and paths in scope

- `package.json`, `package-lock.json`, `tsconfig.json`, `app.json`, `expo-env.d.ts` if generated
- `app/_layout.tsx`, `app/index.tsx`, `app/age-gate.tsx`, `app/blocked.tsx`
- `src/theme/tokens.ts`
- `src/data/brands.ts`
- `src/domain/age-gate.ts`, `src/domain/estimation.ts`
- `src/domain/*.test.ts` or `__tests__/`
- `eslint.config.js` or `.eslintrc.js`
- `supabase/config.toml`, `supabase/migrations/*_baseline.sql`
- `.env.example`, `.gitignore` updates for Expo
- Role artifacts under `docs/workstreams/20260818-puffpuffstop-mobile-mvp/`

## 11. Supporting documents to create or update

- Workstream manifest (exists)
- PM artifacts + blueprint (exist)
- UI/UX, SWE, Security artifacts; Growth + Project Lead after security evidence
- Optional decision record if Expo SDK pin is material
- STATE.md, continuation, MEMORY index

## 12. Ordered implementation tasks

### T0. Role specs before code

- Objective: UI/UX + Engineering charters/plans exist; Security charter/plan may start in parallel as read-only threat model of the proposed surface.
- Dependencies: PM PASS
- Files: workstream role directories
- Validation: artifacts exist and cite PRD IDs
- Completion state: complete

### T1. Scaffold Expo app

- Objective: TypeScript + Expo Router project at repo root without destroying control plane
- Dependencies: T0 Engineering plan
- Files: Expo config, `app/`, package scripts
- Notes: generate in temp if needed; merge into existing repo; keep README tagline
- Validation: `npx tsc --noEmit` after install
- Completion state: complete

### T2. Design tokens

- Objective: cute teen-friendly (not child-coded) tokens
- Files: `src/theme/tokens.ts` + tests
- Validation: unit test exports required keys
- Completion state: complete

### T3. Age-gate stub + empty brand table + estimation helpers

- Objective: validate foundation rules
- Files: domain modules, `app/age-gate.tsx`, `app/blocked.tsx`
- Validation: unit tests for allow/block, no-tracking flag, empty catalog, formulas
- Completion state: complete

### T4. Supabase structure + env names

- Objective: local-only structure
- Files: `supabase/config.toml`, empty baseline migration, `.env.example`
- Notes: do not `db push` or `link`
- Validation: files exist; migration is a documented no-op baseline
- Completion state: complete

### T5. Lint, test, typecheck

- Objective: strongest local checks
- Validation: all three scripts exit 0
- Completion state: complete

### T6. Security + Growth + Project Lead artifacts

- Objective: independent security verdict, then no-campaign growth plan, then owner handoff
- Dependencies: T5 evidence
- Completion state: complete

## 13. Adaptive role and delegation map

Every canonical role from `/instructions/ROLES.md` must be listed as required or skipped with a reason. For required roles, include charter, role plan, predecessor, owned paths, evidence path, gate criteria, and handoff path.

| Role ID | Required or skipped | Reason | Predecessor | Owned paths | Gate evidence | Status |
|---|---|---|---|---|---|---|
| `product-manager-subagent` | required | new product contract | intake | `.../product-manager-subagent/` | PRD + handoff PASS | complete |
| `ui-ux-developer-subagent` | required | age-gate + later journeys | PM handoff | `.../ui-ux-developer-subagent/` | design spec | complete PASS |
| `software-engineer-subagent` | required | Expo/supabase/tests | UX handoff | app, src, supabase | lint/test/typecheck | complete PASS |
| `security-engineer-subagent` | required | Tier 3 | Engineering handoff | `.../security-engineer-subagent/` | threat model + verdict | complete CONDITIONAL |
| `growth-marketing-subagent` | required | 16+ positioning; no campaigns | Security | `.../growth-marketing-subagent/` | growth plan drafts | complete PASS |
| `project-lead-subagent` | required | Tier 3 reconciliation | Growth | `.../project-lead-subagent/`, `delivery/` | owner handoff | complete CONDITIONAL |

## 14. Test and validation matrix

| Requirement | Validation method | Expected evidence | Status |
|---|---|---|---|
| PPS-P0-01 | inspect Expo Router entry + typecheck | `app/_layout.tsx` exists; tsc 0 | verified |
| PPS-P0-02 | unit test tokens | required color/space keys | verified |
| PPS-P0-03 | unit test + screen inspect | 16+ allow; <16 block; no tracking | verified |
| PPS-P0-04 | unit test | `BRAND_CATALOG.length === 0` | verified |
| PPS-P0-05 | npm scripts | lint, test, typecheck exit 0 | verified |
| PPS-P0-06 | file inspect | supabase config + baseline sql | verified |
| PPS-P0-07 | file inspect | `.env.example` names only | verified |
| PPS-EST-01–04 | unit tests | formula fixtures | verified |
| PPS-SAFE-01/02 | copy inspect on stub | 16+ / not medical / not for children | verified |

## 15. Security, privacy, reliability, accessibility, and performance checks

- No secrets in repo; hook already blocks `.env` (non-example).
- Age-gate block path writes nothing.
- Baseline migration is empty (no remote apply).
- Age-gate buttons meet 44pt target; Reduce Motion not required beyond static stub.
- No network calls in phase 0 client code.

## 16. Environment-variable registry

Never include values.

| Variable name | Purpose | Scope/environment | Required by phase | Source/provider | Status |
|---|---|---|---|---|---|
| `EXPO_PUBLIC_APP_ENV` | Distinguish local/preview/production client behavior | Expo client | 0 (name), 4 (value) | owner / EAS | name only |
| `EXPO_PUBLIC_SUPABASE_URL` | Later Supabase API URL | Expo client | 0 (name), later (value) | Supabase project | name only |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Later Supabase anon key | Expo client | 0 (name), later (value) | Supabase project | name only |
| `SUPABASE_PROJECT_REF` | CLI link identifier | local CLI | later | Supabase dashboard | name only |
| `SUPABASE_ACCESS_TOKEN` | CLI auth if used | local CLI / CI | later | owner secret manager | name only; never commit |
| `EXPO_PUBLIC_SENTRY_DSN` | Optional later diagnostics | Expo client | later | Sentry | reserved, unused |
| `EAS_PROJECT_ID` | Later EAS builds | EAS | later | Expo dashboard | name only |

## 17. Deferred human-action queue

Record actions but do not request them unless they are strict blockers.

| Action | Why agent cannot perform it | Earliest required phase | Blocking now? | Final-checklist destination |
|---|---|---|---|---|
| Create Apple Developer + App Store Connect app | account ownership | 4 / final | no | yes |
| Create Google Play developer account + listing | account ownership | 4 / final | no | yes |
| Host privacy policy / terms | legal + domain | 4 / final | no | yes |
| Create/link Supabase project and enter URL/anon key | owner dashboard + secrets | later sync | no | yes |
| EAS project + store credentials | owner accounts | 4 / final | no | yes |
| Legal review of wellness vs device claims | licensed counsel | 4 / final | no | yes |
| Paid ads / community posts | spend + reputation | after owner approve | no | yes |
| 18+ real-money licensing | regulated | later | no | yes |

## 18. Rollback and recovery

Phase 0 is additive. If the Expo scaffold fails, remove generated app files and keep docs. Do not force-push or reset `--hard`. Do not apply remote migrations.

## 19. Acceptance criteria

- Bootstrap and preflight already succeeded.
- Manifest lists all six roles as required.
- Blueprint and this plan exist.
- PM PASS recorded.
- UI/UX, SWE, Security artifacts exist; Growth and Project Lead exist after security evidence.
- Expo skeleton, tokens, age-gate stub, empty brand table, supabase baseline, `.env.example` exist.
- `lint`, `test`, and `typecheck` pass.
- No store submit, no remote DB mutation, no secrets committed.

## 20. Completion evidence

- `bash .cursor/scripts/bootstrap.sh` exit 0
- `node .cursor/skills/launch-pipeline/scripts/preflight.mjs` READY, exit 0
- `npm run lint` exit 0
- `npm test` exit 0 (12 pass / 0 fail)
- `npm run typecheck` exit 0
- Security CONDITIONAL residuals: SEC-P0-001, SEC-P0-002
- Commit SHA: `51c63bf6b149b08fe9f4b980172417cd5695af7f`

## 21. Deviations and follow-ups

- Task sub-agents unavailable; parent lead executes specialist roles.
- Phase 1 plan must not be written until this plan’s acceptance criteria are verified.

## 22. Next Plan Generation Prompt

Read `/AGENTS.md`, the complete core agent context, `/instructions/PROJECT_PLANNING.md`, `/instructions/ROLES.md`, the original `docs/plans/phase_0_foundations_plan.md`, this completed phase plan, the active workstream manifest and role handoffs, all completion evidence, current repository state, active blockers, and relevant decisions. Confirm this phase and every required role gate are fully implemented and validated. Then generate exactly one exhaustive next phase plan at `docs/plans/phase_1_onboarding-plan_plan.md`. Derive it from the phase-0 roadmap and verified current state, preserve unresolved requirements, include all required plan sections and adaptive role decisions, defer non-blocking human actions to the final phase, and do not implement the next phase until the plan is written. Phase 1 must implement the 14 one-question onboarding screens, estimation, and the plan screen (puffs/day-week-month-year, devices/week, optional spend/week, today’s commitment, disclaimer, CTA “See my organs”) without store publish or remote mutation.
