---
document: final_implementation_checklist
status: open
created: 2026-08-18
updated: 2026-08-18
---

# Final Implementation Checklist

## 1. Completion declaration

- [x] All planned agent-executable phases (0–4) are implemented.
- [x] All available automated validation passes (`lint` 0, `test` 40/40, `typecheck` 0).
- [x] Unverified results are listed below.

## 2. Outstanding defects or unverified items

| Item | Impact | Evidence/status | Required action | Owner |
|---|---|---|---|---|
| SEC-P0-001 client age-gate | Under-16 can tap 16+ | Residual; blocked path now deletes persisted data | Accept 16+ store rating; no under-16 mode | Owner |
| SEC-P0-002 Expo `image-size` advisories | Toolchain DoS in Metro, not shipped tracker | `npm audit` 10 high / 8 moderate / 0 critical | Refresh Expo later; do not `npm audit fix --force` | Owner / engineering |
| SEC-P4-001 unencrypted local snapshot | On-device JSON readable if filesystem is accessed | `src/data/persist.ts` | Accept device lock or add encryption later | Owner |
| No simulator/device runtime recording | Persist file driver unproven on a physical device | Node tests use memory driver | Run iOS/Android smoke after EAS project exists | Owner |
| No hosted privacy URL | Store listings need a public policy page | In-app `/privacy` only | Publish a 16+ policy URL | Owner |

## 3. Role and stage-gate closure

| Role ID | Required or skipped | Final verdict or skip reason | Handoff/evidence |
|---|---|---|---|
| product-manager-subagent | required | PASS (inherited PRD lock) | `product-manager-subagent/handoff.md` |
| ui-ux-developer-subagent | required | PASS (inherited spec; privacy + pulse added) | `ui-ux-developer-subagent/handoff.md` |
| software-engineer-subagent | required | PASS phases 0–4 | `software-engineer-subagent/handoff.md` |
| security-engineer-subagent | required | CONDITIONAL | `security-engineer-subagent/handoff.md`, `artifacts/phase-4-review.md` |
| growth-marketing-subagent | skipped for phases 1–4 implementation | No campaigns, ads, or store submit | `growth-marketing-subagent/handoff.md` (phase 0 positioning only) |
| project-lead-subagent | required | CONDITIONAL until owner accepts residuals and store actions | `delivery/owner-handoff.md` |

- [x] All `BLOCKED` verdicts have been remediated or were never opened. Residuals remain CONDITIONAL.
- [x] The project-lead owner handoff links every required gate and residual risk.

## 4. Environment variables and secrets still required

Never include secret values.

| Variable name | Provider/source | Destination/environment | Why required | Value supplied? | Validation after supply |
|---|---|---|---|---|---|
| EXPO_PUBLIC_APP_ENV | Owner | EAS / local `.env` | Distinguish local/preview/production | No | App reads `local` default |
| EXPO_PUBLIC_SUPABASE_URL | Supabase | EAS preview/production only when sync is approved | Future Auth/Postgres | No | Sync status stays not-connected |
| EXPO_PUBLIC_SUPABASE_ANON_KEY | Supabase | EAS, never committed | Future client auth | No | RLS tests after first real schema |
| SUPABASE_PROJECT_REF | Supabase | CI/CLI only | Linked migrations later | No | `supabase link` then migration list |
| SUPABASE_ACCESS_TOKEN | Supabase | Secret manager only | CLI if used | No | Never git |
| EAS_PROJECT_ID | Expo | `app.json` / EAS | Build profiles | No | `eas init` then `eas build` |
| EXPO_PUBLIC_SENTRY_DSN | Sentry (optional) | Reserved unused | Crash reporting later | No | Leave empty until approved |

## 5. Human-only account, permission, billing, or legal actions

| Action | Platform | Reason agent cannot perform | Exact completion evidence |
|---|---|---|---|
| Apple Developer enrollment | Apple | Paid account, identity, 2FA | Team ID and 16+ rating in App Store Connect |
| Google Play developer account | Google | Paid account, identity | Play Console app with 16+ / not kids |
| Hosted privacy policy URL | Owner legal/web | Public URL required by stores | URL returns the 16+ / not medical / local-data policy |
| Legal review of wellness copy | Counsel | Not agent-authorizable | Written acceptance of organ-score disclaimer |
| Accept SEC residuals | Owner | Consequential release decision | Written accept or requested remediation |
| Create/link Supabase project | Supabase dashboard | Owner credentials | Project ref; no remote push until schema + RLS reviewed |
| EAS project + store credentials | Expo | Owner login | `EAS_PROJECT_ID` present in EAS, not in git secrets |
| Paid ads / UA spend | Ads platforms | Unauthorized and paid | Do not start unless separately approved |

## 6. Production integrations and dashboard actions

### Deployment

- [ ] `eas init` and preview build only after owner approval
- [ ] Production EAS submit only after store accounts and residual acceptance

### DNS and domains

- [ ] Optional marketing/privacy domain (not required for local MVP)

### OAuth and identity providers

- [ ] None until signed-in sync is a later approved project

### Database and storage

- [ ] Do not `supabase db push` the `SELECT 1` baseline as a real schema
- [ ] First real migration needs RLS and a security re-review

### APIs, webhooks, email, payments, analytics, and other providers

- [ ] No payments. No ads SDK. No analytics on the under-16 path.
- [ ] If money is ever real: 18+ and licensed-account-only, new workstream

## 7. Final smoke tests after manual actions

- [ ] Application health and primary user journey (age-gate → onboarding → plan → home → log → settings)
- [ ] Authentication and authorization (N/A until sync)
- [ ] Data persistence and migrations (kill/reopen app; under-16 delete; export JSON)
- [ ] External integrations and webhooks (none)
- [ ] Error handling, logs, alerts, and rollback (EAS crash reporting only if Sentry approved)
- [ ] Security, privacy, accessibility, and performance acceptance (16+ rating, not kids, not medical)

## 8. Owner decision

- [ ] Owner approved the handoff.
- [ ] Conditions or requested remediation are recorded in the active workstream.

Implementation phases are complete. This checklist is **not** store-submit authorization.

## 9. Final evidence

- Plans: `docs/plans/phase_0_foundations_plan.md` through `docs/plans/phase_4_store-ready_plan.md`
- Blueprint: `docs/blueprints/2026-08-18_puffpuffstop.md`
- Workstream: `docs/workstreams/20260818-puffpuffstop-mobile-mvp/manifest.md`
- Validation: `npm run lint` 0; `npm test` 40 pass; `npm run typecheck` 0
- Security residuals: SEC-P0-001, SEC-P0-002, SEC-P4-001
- Phase 3 commit: `63ff524`. Phase 4 is implemented locally until the owner asks to commit.
