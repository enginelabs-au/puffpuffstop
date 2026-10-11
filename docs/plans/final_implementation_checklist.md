---
document: final_implementation_checklist
status: open
created: 2026-08-18
updated: 2026-10-11
---

# Final Implementation Checklist

## 1. Completion declaration

- [x] All planned agent-executable phases (0–13) are implemented.
- [x] JavaScript validation passes (`lint` 0, `test` 142/142, `typecheck` 0).
- [x] Expo dependency validation passes (`expo-doctor` 21/21 and `expo install --check`).
- [x] Android Release AAB bundles locally without store signing credentials.
- [x] iOS Release archive completes locally with signing disabled.
- [x] Unverified results are listed below.

## 2. Outstanding defects or unverified items

| Item | Impact | Evidence/status | Required action | Owner |
|---|---|---|---|---|
| SEC-P0-001 client age-gate | In-app 16+ notice removed | Store rating remains 16+ | Owner sets 16+ in App Store / Play | Owner |
| SEC-P0-002 Expo `image-size` advisories | Toolchain DoS in Metro | `npm audit` 10 high / 8 moderate / 0 critical | Refresh Expo later; do not force-fix | Owner |
| SEC-P4-001 unencrypted local snapshot | On-device JSON readable if filesystem is accessed | `src/data/persist.ts` | Accept device lock or add encryption later | Owner |
| No simulator/device runtime recording | Persist/haptics/reminders unproven on a physical device | Node tests use memory/no-op drivers | Run iOS/Android smoke after a native rebuild | Owner |
| Local Android artifact is debug-signed | A store upload must use Play App Signing/EAS credentials | `android/app/build/outputs/bundle/release/app-release.aab` | Configure EAS/Play signing and build through EAS | Owner |
| Local iOS archive is unsigned | An App Store upload needs Apple distribution signing and provisioning | `/tmp/PuffPuffStop.xcarchive` | Configure Apple credentials in EAS and build a signed archive | Owner |
| EAS project is linked but unsigned CI is not configured | CI builds need an Expo token; store artifacts still need owner signing | `@camdouglass-team/puffpuffstop`, project ID `fe183d74-3fd3-4e32-88c7-9d72c4534a9b` | Add `EXPO_TOKEN`, configure signing, then run a signed build | Owner |
| No hosted privacy URL | Store listings need a public policy page | `docs/legal/privacy.html` ready to host | Publish HTTPS URL and set `EXPO_PUBLIC_PRIVACY_POLICY_URL` | Owner |
| Listing drafts unpublished | Copy is local only | `docs/store/ios-listing.md`, `docs/store/android-listing.md` | Paste only after residual acceptance | Owner |

## 3. Role and stage-gate closure

| Role ID | Required or skipped | Final verdict or skip reason | Handoff/evidence |
|---|---|---|---|
| product-manager-subagent | required | PASS (inherited PRD lock) | `product-manager-subagent/handoff.md` |
| ui-ux-developer-subagent | required | PASS (haptic + Reduce Motion) | `ui-ux-developer-subagent/handoff.md` |
| software-engineer-subagent | required | PASS phases 0–5 | `software-engineer-subagent/handoff.md` |
| security-engineer-subagent | required | CONDITIONAL | `docs/workstreams/20261011-mobile-store-release/security-engineer-subagent/handoff.md` |
| growth-marketing-subagent | required for listing drafts | PASS drafts only; no campaigns | `docs/store/` |
| project-lead-subagent | required | CONDITIONAL until owner completes EAS/signing/store actions | `docs/workstreams/20261011-mobile-store-release/project-lead-subagent/handoff.md` |

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
| EAS_PROJECT_ID | Expo | `app.json` non-secret project ID | Build profiles | Yes | `eas project:info` shows `@camdouglass-team/puffpuffstop` |
| EXPO_PUBLIC_PRIVACY_POLICY_URL | Owner web | EAS / `.env` | HTTPS hosted policy | No | Settings shows hosted link |
| EXPO_PUBLIC_SENTRY_DSN | Sentry (optional) | Reserved unused | Crash reporting later | No | Leave empty until approved |
| EXPO_PUBLIC_FITBIT_CLIENT_ID | Fitbit developer app | EAS / local `.env` | Direct Fitbit OAuth; Health still works without it | No | Connect Fitbit in Settings exchanges a PKCE code |
| EXPO_TOKEN | Expo | GitHub Actions secret only | Authenticate future EAS builds/submissions | No | Manual workflow reaches EAS |
| ASC_APP_ID | App Store Connect | EAS/CI configuration | Identify the iOS store app for submission | No | EAS submit in protected environment |
| GOOGLE_SERVICE_ACCOUNT_JSON | Google Play | EAS/CI secret manager only | Authenticate Android submission if not using EAS-managed credentials | No | EAS submit in protected environment |

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
| Enable HealthKit on the App ID | Apple Developer | Capability + provisioning | Connect Apple Health on device without codesign failure |
| Create Fitbit developer app | Fitbit | Owner login; redirect `puffpuffstop://fitbit` | Set `EXPO_PUBLIC_FITBIT_CLIENT_ID` |

## 6. Production integrations and dashboard actions

### Deployment

- [x] Create/link the EAS project and commit only its non-secret `extra.eas.projectId`.
- [ ] Add `EXPO_TOKEN` to GitHub Actions; the workflow is manual and builds by default.
- [ ] Configure the protected GitHub `store-release` environment before enabling submission.
- [ ] Configure Apple distribution and Google Play signing credentials in EAS.
- [ ] Production submit only after store accounts, privacy URL, legal review, and residual acceptance.
- [x] `.github/workflows/mobile-release.yml` validates first, builds with EAS, and submits only when the owner explicitly enables `submit`.

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

- Release plan: `docs/plans/phase_13_release-prep_plan.md`
- Release workstream: `docs/workstreams/20261011-mobile-store-release/manifest.md`
- Validation: `npm test` 142/142; `npm run typecheck` 0; `npm run lint` 0.
- Expo validation: `npx expo-doctor` 21/21; `npx expo install --check` clean.
- Android artifact: `android/app/build/outputs/bundle/release/app-release.aab` (local debug signing only; SHA-256 `9cfee80099484f2dd911e5b226f34f56437c8daea8f021e401a88dc7b1178b8a`).
- iOS artifact: `/tmp/PuffPuffStop.xcarchive` (unsigned local archive).
- Automation: `.github/workflows/mobile-release.yml` (manual, build-first, protected submission gate).
- This checklist is not store-submit authorization.
