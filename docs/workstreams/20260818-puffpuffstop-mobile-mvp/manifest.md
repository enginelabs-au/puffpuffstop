---
schema_version: 1
task_id: 20260818-puffpuffstop-mobile-mvp
title: PuffPuffStop mobile MVP foundations
source_request: Owner-locked PuffPuffStop product launch brief on enginelabs-au/puffpuffstop branch cursor/agent-control-plane
status: phase-1-verified
risk_tier: 3
created_at: 2026-08-18T10:45:00Z
updated_at: 2026-08-18T11:05:00Z
revision: 3
owner: user-operator
active_role: orchestrating-lead
current_gate: phase-2-plan-draft
---

# Workstream Manifest: PuffPuffStop mobile MVP foundations

## 1. Objective and requested outcome

Create and verify phase-0 foundations for PuffPuffStop, a 16+ iOS/Android vaping-cessation wellness habit coach. This turn produces the adaptive six-role workstream, strategy blueprint, phase-0 plan, and a local Expo skeleton. It does not publish, deploy, spend, or mutate remote data.

## 2. Source request and project context

- Product name: PuffPuffStop. Tagline: “Break the cycle, reclaim your lungs.”
- Audience: teens and young adults 16+. Teen-friendly and cute. Not a kids app.
- Inspiration: Puff Count tap-to-log taper + Snapchat-style single circular Log button. Do not clone Puff Count IAP/social.
- Stack: Expo + TypeScript + Expo Router, offline-first SQLite, later Supabase Auth/Postgres/RLS, Lottie or Rive.
- Authorization: local planning artifacts and phase-0 foundations only.

## 3. Scope and non-goals

In scope now:

- Workstream, blueprint, phase-0 plan, and all six role artifacts in pipeline order.
- Expo app skeleton, design tokens, age-gate stub, empty brand table, lint/test/typecheck.
- Supabase project structure + empty migration baseline and environment-variable name wiring.

Non-goals now:

- Later-phase onboarding/home/settings screens except what is required to validate the foundation.
- Production deploy, App Store/Play publish, paid ads, secret values, card processing, remote database mutation.
- Flutter, Bluetooth auto-count, IAP paywall on the tracker, Kids Category, under-13 flows.

## 4. Risk classification

- Impacted domains: product, experience, mobile client, local data, future identity/privacy, store reputation, ethical growth.
- Product/user impact: new public-facing cessation coach for 16+ users.
- Data, privacy, identity, or compliance impact: age-gate, wellness/health-adjacent estimates, later auth; no under-13 tracking.
- Security/abuse exposure: age-gate bypass, medical-claim drift, future account isolation, money-feature creep.
- Production/infrastructure impact: none authorized this phase; local/repo only.
- Reversibility: planning and skeleton are reversible; store/medical claims are not.
- Release significance: high for later phases; this phase is foundations only.
- Selected tier and evidence: Tier 3, owner-locked. Teen-adjacent wellness, age-gate, future identity/privacy, reputation-sensitive store copy.

## 5. Role routing matrix

Every canonical role must appear. A skipped role requires a specific reason.

| Role ID | Required or skipped | Reason/evidence | Predecessor | Owned paths | Status | Handoff |
|---|---|---|---|---|---|---|
| `product-manager-subagent` | required | New product, locked PRD, acceptance, metrics | intake | `docs/workstreams/20260818-puffpuffstop-mobile-mvp/product-manager-subagent/` (lead materializes) | complete PASS | `product-manager-subagent/handoff.md` |
| `ui-ux-developer-subagent` | required | Age-gate, 14-step onboarding, home organs, Log button | PM handoff | `.../ui-ux-developer-subagent/` plus design artifacts | complete PASS | `ui-ux-developer-subagent/handoff.md` |
| `software-engineer-subagent` | required | Expo/SQLite/Supabase foundations and tests | UI/UX handoff | app source, `supabase/`, configs, tests | complete PASS | `software-engineer-subagent/handoff.md` |
| `security-engineer-subagent` | required | Tier 3; age-gate, privacy, wellness claims, later auth | Engineering handoff | `.../security-engineer-subagent/` read-only | complete CONDITIONAL | `security-engineer-subagent/handoff.md` |
| `growth-marketing-subagent` | required | Launch positioning, 16+ store copy, measurement; no campaigns | Security evidence | `.../growth-marketing-subagent/` | complete PASS | `growth-marketing-subagent/handoff.md` |
| `project-lead-subagent` | required | Tier 3 reconciliation and owner handoff | Growth handoff | `.../project-lead-subagent/` and `delivery/` | complete CONDITIONAL | `delivery/owner-handoff.md` |

Skipped roles: none. Decision owner: parent orchestrator, following the owner-locked brief.

## 6. Requirement traceability

| Requirement ID | Requirement | Source | Owner role | Acceptance evidence | Status |
|---|---|---|---|---|---|
| PPS-P0-01 | Expo + TypeScript + Expo Router skeleton | owner brief | software-engineer-subagent | app boots locally; typecheck | verified |
| PPS-P0-02 | Design tokens | owner brief | ui-ux-developer-subagent / software-engineer-subagent | token module + tests | verified |
| PPS-P0-03 | Age-gate stub 16+ with under-16 hard stop | owner brief | software-engineer-subagent | stub screen + unit tests | verified |
| PPS-P0-04 | Empty brand catalog table | owner brief | software-engineer-subagent | typed empty table + tests | verified |
| PPS-P0-05 | Lint, test, typecheck pass | owner brief | software-engineer-subagent | command evidence | verified |
| PPS-P0-06 | Supabase project structure + empty migration baseline | owner brief | software-engineer-subagent | `supabase/` files exist; no remote push | verified |
| PPS-P0-07 | Environment-variable name wiring | owner brief | software-engineer-subagent | `.env.example` names only | verified |
| PPS-AGE-01 | 16+ age gate; under 16 hard stop, help resources, no tracking | owner brief | product-manager-subagent | PRD + later implementation | specified |
| PPS-SAFE-01 | Wellness coach, not medical device; organ % disclaimer | owner brief | product-manager-subagent | PRD + copy rules | specified |
| PPS-SAFE-02 | Not a kids app; no under-13; no Kids Category; no kids store copy | owner brief | product-manager-subagent / growth-marketing-subagent | PRD + GTM constraints | specified |
| PPS-ONB-01 | One-question-per-screen onboarding screens 1–14 | owner brief | product-manager-subagent / ui-ux-developer-subagent | PRD + design spec | verified |
| PPS-EST-01 | Estimation formulas and plan-screen math | owner brief | product-manager-subagent | PRD formulas | verified |
| PPS-HOME-01 | Cute organ cards with loop animation and N% | owner brief | ui-ux-developer-subagent | design spec (later impl) | specified |
| PPS-HOME-02 | Center Log button +1, haptic, undo | owner brief | ui-ux-developer-subagent | design spec (later impl) | specified |
| PPS-MNY-01 | v1 local estimated savings only; no card/custody/payout | owner brief | product-manager-subagent / security-engineer-subagent | PRD + threat model | specified |

## 7. Dependency and gate order

1. Intake / classification (this manifest)
2. `product-manager-subagent` → product contract
3. `ui-ux-developer-subagent` → build-ready experience spec for phase 0 + later-phase map
4. `software-engineer-subagent` → implement and verify phase 0 only
5. `security-engineer-subagent` → independent security/privacy verdict
6. `growth-marketing-subagent` after product + security evidence; planning only, no campaigns
7. `project-lead-subagent` → owner handoff
8. Owner decision for later phases

## 8. Path and external-system ownership

| Path or system | Writer | Read-only reviewers | Allowed operation | Ownership window |
|---|---|---|---|---|
| `docs/workstreams/20260818-puffpuffstop-mobile-mvp/manifest.md` | orchestrating lead | all roles | create/update status | entire workstream |
| `docs/workstreams/.../product-manager-subagent/` | orchestrating lead (PM read-only) | ui-ux, swe, sec, growth, lead | materialize PM artifacts | until PM handoff |
| `docs/blueprints/2026-08-18_puffpuffstop.md` | orchestrating lead | all roles | create | strategy |
| `docs/plans/phase_0_foundations_plan.md` | orchestrating lead | all roles | create/update evidence | phase 0 |
| `docs/workstreams/.../ui-ux-developer-subagent/` | orchestrating lead (UX read-only) | swe, sec | materialize UX artifacts | after PM |
| `app/`, `src/`, `assets/`, `package.json`, test configs | software-engineer-subagent via lead | sec, lead | create/edit phase-0 code | after UX plan |
| `supabase/` | software-engineer-subagent via lead | sec | local structure only | phase 0 |
| `.env.example` | software-engineer-subagent via lead | sec | names only | phase 0 |
| Hosted Supabase / Vercel / stores / ads | none | all | no mutation | unauthorized |
| `.cursor/STATE.md`, continuation, MEMORY | orchestrating lead | project-lead | update | entire workstream |

## 9. Tool and MCP constraints

- Use project-native Node, npm, Expo, ESLint, TypeScript, Jest or equivalent, and local Supabase file layout.
- Supabase skill applies to linked remote migrations; remote `db push` is unauthorized this phase.
- Vercel skill is not activated; no web deploy.
- Cursor Cloud MCP is diagnostics-only.
- No Figma file was supplied; UX evidence is specification-based unless a file becomes available.
- Never store secret values. No production MCP mutations.

## 10. Decisions, clarifications, and provisional assumptions

Label assumptions as `verified`, `provisional`, or `blocking`.

- `verified` — Product name, tagline, 16+ audience, 14 onboarding questions, estimation formulas, organ set, Log interaction, money rules, stack, risk tier, six required roles, phase-0-only authorization.
- `provisional` — Default nickname “friend”; period-to-days conversion uses 7 / 30 / 365; organ baseline 35–85 derived from onboarding history/frequency/strictness/motivation (exact weights later); help-resource list is a non-clinical placeholder set; Expo SDK pinned to the generator’s current stable; brand catalog now has estimation defaults (phase 1).
- `provisional` — Parent lead materializes specialist artifacts because no Task sub-agent runtime is available.
- `blocking` — none for phase 0. Store accounts, Apple/Google credentials, Supabase project linking, and paid ads remain deferred.

## 11. Active blockers and remediation loops

| Finding or requirement | Owner | Status | Invalidated gates | Recheck requirement |
|---|---|---|---|---|
| none | — | — | — | — |

## 12. Artifact and evidence index

- Manifest: this file
- Blueprint: `docs/blueprints/2026-08-18_puffpuffstop.md`
- Phase plan: `docs/plans/phase_0_foundations_plan.md`
- Role directories under `docs/workstreams/20260818-puffpuffstop-mobile-mvp/<role-id>/`

## 13. Residual risks and human actions

- Medical-claim and Kids Category copy drift.
- Age-gate bypass on a client-only stub.
- Future money feature being mistaken for a wallet.
- Human actions deferred: Apple/Google developer accounts, store listings, Supabase project create/link, secret values, legal/privacy review, paid ads.

## 14. Owner decisions and approvals

- Already decided: product lock, stack, risk tier 3, all six roles, local phase-0 authorization.
- Still required later: any production, publish, spend, secret, or remote-DB action.

## 15. Closure

- Final verdict: owner APPROVE for phase 1; phase 1 verified
- Owner handoff: updated
- Closure evidence: phases 0–1 locally verified; phase 2 plan drafted only
- Remaining manual actions: deferred to later phases / final checklist
