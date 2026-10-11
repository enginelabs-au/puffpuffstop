---
plan: phase_13_release-prep
status: owner-gated
created: 2026-10-11
updated: 2026-10-11
owner: lead-agent
source_phase: docs/plans/final_implementation_checklist.md
workstream: docs/workstreams/20261011-mobile-store-release/manifest.md
---

# Phase 13: iOS and Android store release preparation

## 1. Objective

Make the existing app reproducibly buildable for iOS and Android store distribution, close native release blockers, and leave a safe path for future EAS-based updates. Do not submit or publish.

## 2. Relation to project end-state

This phase turns the verified local MVP into a release candidate. It does not replace owner-controlled Apple, Google, EAS, legal, privacy-hosting, or signing actions.

## 3. Entry criteria and inherited evidence

- `origin/main` contains the owner-confirmed goal flow and Home cap behavior at `9997054`.
- Local validation previously passed: 142 tests, typecheck, and lint.
- Existing EAS profiles and store listing/privacy drafts exist.
- Preflight reports `READY`.

## 4. Scope

- Resolve Expo SDK 57 dependency compatibility.
- Configure Android Health Connect minimum API requirements.
- Fix Android release resource compilation.
- Build Android release output and verify iOS release settings/archive path.
- Add safe manual future-update automation that builds by default and never submits without an explicit workflow input.
- Update release checklist and owner handoff with exact remaining account actions.

## 5. Non-goals

Store submission, store listing publication, privacy hosting, EAS project creation, signing credential creation, production database changes, analytics, ads, and app behavior redesign.

## 6. Current-state audit

- `expo-doctor` reports SDK-compatible patch updates and TypeScript 6.
- Android native generation succeeds, but release AAB fails because Health Connect requires API 26 and voice-query XML has unescaped apostrophes.
- EAS CLI/project identity and store credentials are not configured.
- The repository has unrelated dirty control-plane changes; this phase must not stage or revert them.

## 7. Assumptions, constraints, risks, and decisions

- Keep Expo SDK 57; apply compatible patch updates only.
- Raise Android minimum API to 26 because the selected Health Connect client requires it.
- Do not force `npm audit fix`; Expo's native toolchain advisories require a coordinated SDK upgrade rather than an unsafe breaking downgrade.
- Use local debug signing only for build verification; release store signing remains EAS/owner-controlled.
- A workflow may run EAS builds only after `EXPO_TOKEN` and project identity are supplied. Submission remains opt-in and disabled by default.

## 8. Dependencies

- Node/npm, Expo SDK 57, Android SDK/build tools, JDK 21, Xcode 26.3.
- Owner EAS/Apple/Google accounts for store-ready signed artifacts.

## 9. Architecture and affected systems

- JavaScript dependency graph and lockfile.
- Expo config plugin chain and generated Android project.
- iOS generated project and Xcode archive settings.
- GitHub Actions workflow for manual EAS build automation.
- Release checklist and workstream evidence.

## 10. Files and paths in scope

`package.json`, `package-lock.json`, `app.json`, `plugins/quick-log/voice_log_queries.xml`, `eas.json`, `.github/workflows/mobile-release.yml`, `docs/plans/final_implementation_checklist.md`, `docs/workstreams/20261011-mobile-store-release/`, `.cursor/STATE.md`, and the continuation memory.

Generated `android/` and `ios/` remain ignored build outputs.

## 11. Supporting documents to create or update

- This plan.
- `docs/workstreams/20261011-mobile-store-release/manifest.md`.
- Release checklist and owner handoff.
- Continuation memory and live state.

## 12. Ordered implementation tasks

1. Apply SDK-compatible dependency updates and install `expo-build-properties`.
2. Configure Android minimum API 26 and repair voice-query XML.
3. Regenerate native projects and build Android release AAB.
4. Run all JS validation and inspect iOS release settings/archive.
5. Add manual EAS build workflow without repository credentials or automatic submission.
6. Run independent security and project-lead release-readiness reviews.
7. Update the final checklist with only remaining owner/CI actions.

## 13. Adaptive role and delegation map

| Role ID | Required or skipped | Reason | Predecessor | Owned paths | Gate evidence | Status |
|---|---|---|---|---|---|---|
| product-manager-subagent | skipped | No product scope change. | existing MVP handoff | none | existing owner lock | skipped |
| ui-ux-developer-subagent | skipped | No UI/UX change. | existing MVP handoff | none | existing UX handoff | skipped |
| software-engineer-subagent | required | Native build and automation implementation. | lead audit | source/config/build files | build logs and validation | in progress |
| security-engineer-subagent | required | Health permissions, signing, CI secrets, store release boundary. | SWE evidence | read-only review | `security-engineer-subagent/handoff.md` | conditional |
| growth-marketing-subagent | skipped | No listing or campaign change. | existing listing drafts | none | existing listing copy | skipped |
| project-lead-subagent | required | Final release reconciliation and owner handoff. | security handoff | read-only review | `project-lead-subagent/handoff.md` | ready with owner actions |

## 14. Test and validation matrix

| Requirement | Validation method | Expected evidence | Status |
|---|---|---|---|
| Existing behavior remains valid | `npm test` | 142/142 pass | verified |
| Type and lint checks pass | `npm run typecheck`, `npm run lint` | zero errors | verified |
| Expo packages match SDK | `npx expo-doctor` / `npx expo install --check` | 21/21 checks and dependency check pass | verified |
| Android release can bundle | Gradle `bundleRelease` | `android/app/build/outputs/bundle/release/app-release.aab` generated; debug-signed | verified |
| iOS release configuration is valid | Xcode settings/archive | `/tmp/PuffPuffStop.xcarchive` completed with signing disabled | verified |
| No store mutation occurs | workflow inspection | manual workflow; submission requires explicit `submit` input and protected environment | verified |
| No secrets are committed | git safety and diff inspection | no secret values added; credentials remain owner/EAS-controlled | verified |

## 15. Security, privacy, reliability, accessibility, and performance checks

- Preserve 16+ and not-medical copy.
- Preserve local-only health data behavior and export redaction.
- Keep Health Connect and HealthKit permissions explicit and opt-in.
- Do not put signing keys, service accounts, `EXPO_TOKEN`, or App Store Connect keys in the repository.
- Keep workflow submission manual and disabled by default.
- Verify release builds embed the JS bundle and do not depend on Metro.

## 16. Environment-variable registry

| Variable name | Purpose | Scope/environment | Required by phase | Source/provider | Status |
|---|---|---|---|---|---|
| `EAS_PROJECT_ID` | EAS project identity | `app.json` | future cloud build | `@camdouglass-team/puffpuffstop` (`fe183d74-3fd3-4e32-88c7-9d72c4534a9b`) | linked |
| `EXPO_TOKEN` | EAS CI authentication | GitHub Actions secret | future cloud build | owner Expo account | missing |
| `EXPO_PUBLIC_PRIVACY_POLICY_URL` | hosted policy URL | production build | store listing | owner web host | missing |
| `ASC_APP_ID` | App Store Connect app ID | CI submit only | future submit | owner App Store Connect | missing |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Play submission credential | CI submit only | future submit | owner Google Play | missing |

## 17. Deferred human-action queue

| Action | Why agent cannot perform it | Earliest required phase | Blocking now? | Final-checklist destination |
|---|---|---|---|---|
| Add `EXPO_TOKEN` and configure EAS signing | owner account and credentials | cloud build | yes for signed EAS artifact | EAS setup |
| Configure Apple signing/HealthKit capability | Apple account and legal ownership | iOS store build | yes for signed store build | Apple setup |
| Configure Google Play signing/service account | Google account and key material | Android store build/submit | yes for signed store build | Google setup |
| Host privacy policy | owner-controlled web/domain | store submission | yes for listing | Privacy |
| Accept residual risks/legal copy | owner/legal decision | submission | yes for submission | Owner decision |

## 18. Rollback and recovery

- Revert only phase-owned files if a dependency update breaks validation.
- Do not reset or restore unrelated dirty control-plane files.
- Generated native directories can be regenerated from config.
- Keep existing device data; do not uninstall the app.

## 19. Acceptance criteria

- JS validation is green.
- Expo dependency check is green or the exact non-blocking limitation is documented.
- Android release AAB is generated locally or the precise signing/build blocker is documented.
- iOS release settings are verified and an archive path is validated or owner signing is documented as the blocker.
- Future workflow builds only with configured EAS credentials and cannot submit by default.
- Final checklist contains no misleading claim that the app is store-submitted.

## 20. Completion evidence

- `npm test`: 142/142 pass.
- `npm run typecheck`: pass.
- `npm run lint`: pass.
- `npx expo-doctor`: 21/21 checks pass.
- `npx expo install --check`: clean.
- Android: local Release AAB generated at `android/app/build/outputs/bundle/release/app-release.aab`; it is debug-signed and is not a store artifact.
- iOS: unsigned Release archive generated at `/tmp/PuffPuffStop.xcarchive`; distribution signing remains owner/EAS-controlled.
- `.github/workflows/mobile-release.yml`: manual validation → EAS build workflow; submission is explicit and protected.
- Remaining blockers are account, signing, privacy, legal, and owner smoke-test actions listed in the final checklist.

## 21. Deviations and follow-ups

The app remains Expo SDK 57. A future SDK upgrade should be handled as a separate migration, not folded into release preparation. The scoped `expo-modules-jsi@57.1.1` patch is required for this Xcode toolchain and should be removed when an upstream-compatible Expo release is adopted.

## 22. Next Plan Generation Prompt

Read `/AGENTS.md`, `/instructions/PROJECT_PLANNING.md`, `/instructions/ROLES.md`, this completed plan, the active release workstream manifest and role handoffs, completion evidence, current repository state, active blockers, and final checklist. If the release-prep acceptance criteria and required role gates are complete, update `docs/plans/final_implementation_checklist.md` with only remaining owner/CI actions and close this phase; do not create another implementation phase unless new scope is explicitly approved.
