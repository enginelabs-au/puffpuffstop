# Phase 13 security handoff

## Verdict

CONDITIONAL — no unresolved repository-level release blocker remains after the Android intent hardening and CI workflow remediation. Store submission still requires owner-controlled GitHub/EAS protections and signed-build verification.

## Evidence

- `VoiceLogActivity` is generated with `android:exported="false"`, and the config plugin normalizes an existing activity entry to the same value.
- The Android activity rejects unknown intent actions and rejects payload directions that conflict with the trusted shortcut action before mutating the local snapshot.
- Android release AAB rebuild passed after regeneration.
- Workflow actions are pinned to reviewed SHAs.
- EAS CLI is pinned to `16.28.0` in both `eas.json` and the workflow.
- `EXPO_TOKEN` is step-scoped and never written to the repository.
- Submission is disabled by default, requires `submit=true`, requires the production profile, uses the protected `store-release` environment, and submits captured platform-specific build IDs rather than `--latest`.
- No credential values, signing keys, or service-account files were added.

## Remaining owner controls

- Configure required reviewers and trusted-branch restrictions on the `store-release` GitHub environment.
- Use a least-privilege EAS token and store it only as the GitHub `EXPO_TOKEN` secret.
- Link the EAS project and configure Apple/Google distribution credentials.
- Verify HealthKit/Health Connect consent, local retention/deletion, export behavior, privacy hosting, and final device smoke tests on signed artifacts.
