# 2026-10-11 continuation

## Mobile release preparation

- Updated the app to Expo SDK 57-compatible dependency versions and added `expo-build-properties` with Android `minSdkVersion: 26` for Health Connect.
- Fixed Android voice-query resources and shortcut metadata, regenerated native projects, and installed iOS pods.
- Android Release AAB generated at `android/app/build/outputs/bundle/release/app-release.aab`; it is debug-signed for local verification only.
- iOS Release archive completed at `/tmp/PuffPuffStop.xcarchive` with `CODE_SIGNING_ALLOWED=NO`; distribution signing remains owner/EAS-controlled.
- Added `patches/expo-modules-jsi+57.1.1.patch`, clean-install tested through `postinstall`, for Xcode 26 Swift compatibility. Remove it when an upstream-compatible Expo release is adopted.
- Validation: `npm test` 142/142, `npm run typecheck`, `npm run lint`, `npx expo-doctor` 21/21, and `npx expo install --check` all pass.
- Added `.github/workflows/mobile-release.yml`: manual validation, EAS build, and an explicit protected submission gate. No credentials are stored in git.
- Linked EAS project `@camdouglass-team/puffpuffstop` with non-secret project ID `fe183d74-3fd3-4e32-88c7-9d72c4534a9b`; Expo token and store credentials remain unset.

## Remaining owner actions

- Add the `EXPO_TOKEN` GitHub Actions secret.
- Configure Apple distribution/HealthKit and Google Play signing/store credentials in EAS.
- Host the privacy policy at HTTPS, set `EXPO_PUBLIC_PRIVACY_POLICY_URL`, complete store listings/legal acceptance, and run final device smoke tests.
- Do not submit to either store until those actions and residual-risk acceptance are complete.
