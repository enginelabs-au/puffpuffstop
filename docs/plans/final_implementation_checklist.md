---
document: final_implementation_checklist
status: open
created: 2026-08-18
updated: 2026-08-18
---

# Final Implementation Checklist

## 1. Completion declaration

- [x] All planned agent-executable phases (0–7) are implemented.
- [x] All available automated validation passes (`lint` 0, `test` 47/47, `typecheck` 0).
- [x] Unverified results are listed below.

## 2. Outstanding defects or unverified items

| Item | Impact | Evidence/status | Required action | Owner |
|---|---|---|---|---|
| SEC-P0-001 client age-gate | Under-16 can tap 16+ | Residual | Accept 16+ store rating; no under-16 mode | Owner |
| SEC-P0-002 Expo `image-size` advisories | Toolchain DoS in Metro | `npm audit` 10 high / 8 moderate / 0 critical | Refresh Expo later; do not force-fix | Owner |
| SEC-P4-001 unencrypted local snapshot | On-device JSON readable if filesystem is accessed | `src/data/persist.ts` | Accept device lock or add encryption later | Owner |
| No simulator/device runtime recording | Persist/haptics unproven on a physical device | Node tests use memory/no-op drivers | Run iOS/Android smoke after EAS project exists | Owner |
| No hosted privacy URL | Store listings need a public policy page | `docs/legal/privacy.html` ready to host | Publish HTTPS URL and set `EXPO_PUBLIC_PRIVACY_POLICY_URL` | Owner |
| Listing drafts unpublished | Copy is local only | `docs/store/ios-listing.md`, `docs/store/android-listing.md` | Paste only after residual acceptance | Owner |

## 3. Role and stage-gate closure

| Role ID | Required or skipped | Final verdict or skip reason | Handoff/evidence |
|---|---|---|---|
| product-manager-subagent | required | PASS (inherited PRD lock) | `product-manager-subagent/handoff.md` |
| ui-ux-developer-subagent | required | PASS (haptic + Reduce Motion) | `ui-ux-developer-subagent/handoff.md` |
| software-engineer-subagent | required | PASS phases 0–5 | `software-engineer-subagent/handoff.md` |
| security-engineer-subagent | required | CONDITIONAL | `artifacts/phase-4-review.md`, `artifacts/phase-5-review.md` |
| growth-marketing-subagent | required for listing drafts | PASS drafts only; no campaigns | `docs/store/` |
| project-lead-subagent | required | CONDITIONAL until owner accepts residuals | `delivery/owner-handoff.md` |

- [x] No open `BLOCKED` verdicts. Residuals remain CONDITIONAL.
- [x] Owner handoff links residuals and this checklist.

## 4. Environment variables and secrets still required

Never include secret values.

| Variable name | Provider/source | Destination/environment | Why required | Value supplied? | Validation after supply |
|---|---|---|---|---|---|
| EXPO_PUBLIC_APP_ENV | Owner | EAS / local `.env` | Distinguish local/preview/production | No | App reads `local` default |
| EXPO_PUBLIC_SUPABASE_URL | Supabase | EAS only when sync is approved | Future Auth/Postgres | No | Sync stays not-connected |
| EXPO_PUBLIC_SUPABASE_ANON_KEY | Supabase | EAS, never committed | Future client auth | No | RLS tests after first real schema |
| SUPABASE_PROJECT_REF | Supabase | CI/CLI only | Linked migrations later | No | `supabase link` |
| SUPABASE_ACCESS_TOKEN | Supabase | Secret manager only | CLI if used | No | Never git |
| EAS_PROJECT_ID | Expo | EAS, not git secrets | Build profiles | No | `eas init` then preview build |
| EXPO_PUBLIC_PRIVACY_POLICY_URL | Owner web | EAS / `.env` | HTTPS hosted policy | No | Settings shows hosted link |
| EXPO_PUBLIC_SENTRY_DSN | Sentry (optional) | Reserved unused | Crash reporting later | No | Leave empty until approved |

## 5. Human-only account, permission, billing, or legal actions

| Action | Platform | Reason agent cannot perform | Exact completion evidence |
|---|---|---|---|
| Apple Developer enrollment | Apple | Paid account, identity, 2FA | Team ID and 16+ rating |
| Google Play developer account | Google | Paid account, identity | Play Console app with 16+ / not kids |
| Host `docs/legal/privacy.html` | Owner legal/web | Public HTTPS URL | URL loads; env name set |
| Legal review of wellness copy | Counsel | Not agent-authorizable | Written acceptance |
| Accept SEC residuals | Owner | Consequential release decision | Written accept or remediation |
| Create/link Supabase project | Supabase | Owner credentials | Project ref; no remote push until RLS |
| `eas init` + store credentials | Expo | Owner login | Preview build exists |
| Paid ads / UA spend | Ads platforms | Unauthorized and paid | Do not start unless separately approved |

## 6. Production integrations and dashboard actions

### Deployment

- [ ] `eas init` and preview build only after owner approval
- [ ] Production submit only after store accounts and residual acceptance

### DNS and domains

- [ ] Host the privacy HTML on an HTTPS origin

### OAuth and identity providers

- [ ] None until signed-in sync is a later approved project

### Database and storage

- [ ] Do not `supabase db push` the `SELECT 1` baseline as a real schema

### APIs, webhooks, email, payments, analytics, and other providers

- [ ] No payments. No ads SDK. No analytics on the under-16 path.

## 7. Final smoke tests after manual actions

- [ ] Age-gate → onboarding → plan → home → log (haptic) → undo → settings
- [ ] Kill/reopen persistence; under-16 delete; export JSON
- [ ] Reduce Motion stops organ pulse
- [ ] Hosted privacy URL opens from Settings
- [ ] 16+ rating, not kids, not medical on both stores

## 8. Owner decision

- [ ] Owner approved the handoff.
- [ ] Conditions or requested remediation are recorded in the active workstream.

This checklist is **not** store-submit authorization.

## 9. Final evidence

- Plans: `docs/plans/phase_0_foundations_plan.md` through `docs/plans/phase_7_accessibility-safety_plan.md`
- Blueprint: `docs/blueprints/2026-08-18_puffpuffstop.md`
- Workstream: `docs/workstreams/20260818-puffpuffstop-mobile-mvp/manifest.md`
- Validation: `npm run lint` 0; `npm test` 47 pass; `npm run typecheck` 0
- Commits: phase 5 `32c6ca0`; phase 6 `29bc181`. Phase 7 is local until the owner asks to commit.
