# 2026-09-01 continuation

## Local iOS device build

- Built and installed Debug PuffPuffStop `0.0.1` (`au.com.enginelabs.puffpuffstop`) on wired iPhone 16 Pro “Free Malware”.
- Expo needs the hardware UDID `00008140-0016406C0CDB001C`, not the Core Device UUID.
- Added `ios.appleTeamId` `256U2M55W7` to `app.json`. Generated `ios/` is gitignored.
- Xcode 26.3 needed `Swift.abs` in `expo-modules-jsi` `JavaScriptCodable+Date.swift`.
- Metro for this install is on port 8082. Not a store submit.
- Runbook: `/memory/runbooks/ios-device-debug-build.md`.

## Quick log from volume and shortcuts

- Added then removed: volume buttons, confirm notification, and Android tile. Those only worked while the app was open.

## Voice log from Siri and Gemini

- Owner asked to drop hardware quick log and use the phone assistant with the screen closed.
- iOS: App Intents `LogPuffIntent` / `UndoPuffIntent` with `openAppWhenRun = false` write `puffpuffstop-snapshot.json` and speak the count.
- Android: headless `VoiceLogActivity` + shortcuts for Gemini / Google Assistant, or a one-time Routine if Gemini has not indexed the app.
- Removed `react-native-volume-manager`. Onboarding/Settings copy is voice-only.
- Assumption: Gemini App Functions remain preview; do not claim “Hey Google” works on every device without a Routine.

## Siri unmatched route

- Phone still had the old App Intent that opened `puffpuffstop://quick-log?action=pending`. Expo Router had no `/quick-log` page.
- Added `app/quick-log.tsx` so that URL logs and redirects home.
- Rebuilt without `react-native-volume-manager`, installed on Free Malware. Launch blocked because the phone was locked.

## Multi-count voice log

- `/quick-log?count=` and Siri `PuffCountChoice` (1–20) log several puffs. Android App Actions custom intents use the same URL.
- JS clamp is 1–99. Siri spoken shortcuts are 1–20 because App Shortcuts require an AppEnum.
- Validation: lint 0, tests 70/70, typecheck 0. Native iOS rebuild succeeded.

## Redo setup and undo-all

- Settings “Redo setup” returns to `/onboarding/nickname` without deleting the daily log or savings.
- Siri/Android can log one, log N, undo one, undo N, or undo all (`action=clear`).
- Wearables/HealthKit/Fitbit not implemented. Phase 12 plan: `docs/plans/phase_12_health-wearables_plan.md`.
- Siri count was an AppEnum 1–20, so “40” matched “4”. Replaced with `PuffCountEntity` that parses the full number. Cap is 999,999.

## Voice undo / reset follow-up

- Owner reported undo and reset still did nothing. Headless native writes were the likely miss: Siri either never hit the undo intent, or JS state overwrote the file.
- Pivot: Siri/Android now open `puffpuffstop://quick-log?action=up|down|clear&count=N&t=…` with `openAppWhenRun = true`. That is the path that already logged correctly.
- JS aliases: `undo`/`remove` → down; `reset`/`clear`/`all` → clear the day. Duplicate URL tokens are ignored so layout + route do not double-apply.
- Extra Siri phrases: remove a puff, undo N, undo all, reset today’s puffs, reset the log.
- Validation: `npm test` 70/70, lint 0, typecheck 0. Debug build installed and launched on Free Malware `00008140-0016406C0CDB001C`.

## Timezone day reset

- Daily `dateKey` now uses the saved IANA timezone. Onboarding adds a step after nickname, prefilled from the phone. Settings → Day can change it.
- The log stays on the same calendar day until 11:59pm in that zone, then rolls. Changing timezone retargets the date label and does not wipe today’s count.
- Older snapshots without `settings.timeZone` get the device zone.
- Validation: `npm test` 75/75, lint 0, typecheck 0. JS-only for the UI path; Metro reload is enough.

## Siri count / undo / reset still failing

- Root cause: App Shortcuts only donate parameterized phrases for AppEntity values after `updateAppShortcutParameters()`. That was never called, so Siri kept matching “log a puff” and optional counts defaulted to 1. Undo/reset phrases were also losing to that match.
- Fix: required count entity, suggested values 1–120 plus “all”, donate on launch, write `puffpuffstop-voice-pending.json` so JS applies even if the URL is dropped. Siri now speaks a confirmation.
- Rebuilt and launched on Free Malware. Validation: `npm test` 76/76, lint 0, typecheck 0.

## Reduce by N puffs

- Owner asked to reduce by a number, not only “undo”. Siri phrases now include reduce N, reduce by N, and subtract N. JS/Android treat `reduce` as down.
- Reinstalled on Free Malware.

## Log-N was clearing the day

- Siri donated “log all puffs” because count entity 0 meant “all”, and JS treated any `count=all` as wipe — including add.
- Removed “all” from log counts. Add verbs (`log`/`add`/`include`) never clear. Subtract verbs take a number off. `reset 5` subtracts; `reset today's puffs` still clears the day.
- Siri intents now write the snapshot with the app closed (`openAppWhenRun = false`) so they can run on the lock screen after the app has been opened once.
- Reinstalled on Free Malware.

## Single puff wiped the day

- Siri treats “a puff” like “all puffs”, so “log a puff” ran the clear-today intent.
- Removed every “all puffs” clear phrase. Wipe only via “reset today's log” or “clear today's log”.
- Reinstalled on Free Malware.

## Subtract / undo / reset still failing after add worked

- Add wrote the snapshot, so the native down/clear path was not the bug. Siri preferred the donated “log N puffs” shortcut for any “VERB N puffs” phrase.
- Subtract is now a different sentence: “take away N in PuffPuffStop”, “take N off”, “take one off”. AppEnum “undo / subtract / reset in PuffPuffStop” handles the verbs without a count.
- Wipe: “reset in PuffPuffStop” or “reset today's log”. Avoid “undo N puffs” — it still matches log.
- Validation: `npm test` 76/76, lint 0, typecheck 0. Debug reinstalled and launched on Free Malware.

## Subtract still failing after phrase split

- Owner: add works, subtract / undo / reset still do not.
- Known Siri bug: without an explicit `@AppShortcutsBuilder`, only the first `AppShortcut` is recognized. Ours started with log, so every other phrase ran log or did nothing.
- First shortcut is now `VoiceAdjustIntent` with AppEnum `log|add|undo|subtract|reset`. Counted undo/log are later shortcuts. JS hydrates disk every 2s when a native write already applied.
- Reinstalled and launched on Free Malware.

## Dark mode default

- Owner asked for dark as the default, with Light / Dark in Settings.
- `settings.theme` persists in the snapshot. Old snapshots without the field become dark.
- ThemeProvider + `useThemedStyles` so screens update live. `app.json` `userInterfaceStyle` is dark for the next native build.
- Validation: `npm test` 77/77, lint 0, typecheck 0.

## Remove still failing — separate count type

- Owner: removing puffs still does not work.
- App Shortcuts cannot use `Int` in a phrase; log and undo both used `PuffCountEntity`, so Siri merged them onto log.
- Undo is now donated first. Remove-N uses `RemoveCountEntity`. Remove/reset open the app. Fresh uninstall/reinstall flushed Siri and cleared local data on the phone.
- URL `action=down` launches on device. Owner still has to confirm spoken Siri.

## Theme crash / “app is buggy”

- Device Metro showed `ReferenceError: Property 'color' doesn't exist` in `AppTabs`, `ChipGroup`, `OnboardingFrame`, and `_layout`. Fast Refresh kept old module-level `StyleSheet.create({ color.xxx })` after the `color` import was removed.
- Packager on 8082 had also died, so the phone kept the crashed bundle.
- Fix: factory param renamed to `palette` with a module-level `color` fallback; Metro restarted via `expo run:ios --device … -p 8082`.
- Validation: `npm test` 77/77, lint 0, typecheck 0. Fresh device bundle: `iOS Bundled 4059ms` (1873 modules), no `ReferenceError` after launch.

## Voice example copy

- Owner asked to drop the long Hey Siri list on onboarding.
- Onboarding and Settings now show two spaced lines: `Hey (Assistant), Log a puff on PuffPuffStop` and `Hey (Assistant), Remove a puff on PuffPuffStop.`
- Validation: `npm test` 77/77, lint 0, typecheck 0.

## Multi-count Siri logged 1

- Owner: Siri said “logging X puffs” but the day only went up by 1.
- Cause: `PuffCountEntity` often bound id=1 while Siri still spoke the requested number.
- Fix: counted log/remove use separate AppEnums (`LogCountChoice` / `RemoveCountChoice`) for 1–120 plus 150/200/250/300/400/500/750/1000. 40 is a real case so it should not collapse to 4.
- Copied Swift into `ios/PuffPuffStop/`, built, installed, launched. Did not uninstall.
- Validation: `npm test` 77/77, lint 0, typecheck 0. Debug app installed on Free Malware.

## Remove still failed after multi-count add worked

- Log uses `openAppWhenRun = false` and works. Remove opened the app, then JS replayed the last `quick-log` add URL and put the count back.
- Remove also lacked “puffs” / “on” phrases, so “remove 5 puffs” could miss or hit log.
- Fix: undo/remove/reset stay closed; donate “remove a puff on …” and “remove N puffs”; skip initial quick-log URL.
- Reinstalled Debug on Free Malware without wiping data. `npm test` 77/77, lint 0, typecheck 0.

## Remove still failed — phrase collision

- “Remove a puff” / “remove N puffs” is the same shape as log, so Siri never ran undo.
- Donated undo is now AppEnum “Undo/Subtract/Reset/Clear in PuffPuffStop”. Counted remove is “take N off”.
- Onboarding example is “Undo in PuffPuffStop”.
- Debug reinstalled. Did not uninstall.

## Counted undo only removed 1

- VoiceVerb “Undo in PuffPuffStop” matched “undo 5” and always wrote count 1.
- Counted “take N off” / “undo N” is now the first shortcut. Verb enum is reset/clear only.
- Onboarding example is “Take 5 off in PuffPuffStop”. Debug reinstalled.

## Siri searched Google for remove

- App Shortcuts only match donated phrases that include the app name. “Remove 5 puffs” with no PuffPuffStop becomes a web search.
- Donated counted: remove/undo/take off/subtract/reduce N. One: remove/undo/subtract/take one off. Reset/clear stay separate.
- Onboarding/Settings hint: say PuffPuffStop; those verbs all work.
- Debug reinstalled. Did not uninstall.

## Android Assistant parity with Siri

- Capabilities now target headless `VoiceLogActivity` (not `MainActivity`) for log, undo/remove/take off/subtract/reduce, and reset/clear.
- Query patterns include the same verbs plus `in/on puffpuffstop`. Count extra accepts Int/Long/Double/Float.
- Settings hint: same phrases as Siri; Routine fallback if Gemini has not indexed the app.
- Needs an Android rebuild / prebuild to copy plugin XML and Kotlin. Not device-verified.

## Counted log fell back to +1

- Siri only donated “log N puffs”. “Log 5 in PuffPuffStop” matched the one-puff shortcut.
- Counted log is first again, with and without the word “puffs”. JS/Android now read the first digits from messy count strings.
- Debug reinstalled on Free Malware. Did not uninstall.

## Counted log still +1 after phrase fix

- Owner said the donated “log 5 in PuffPuffStop” phrase still did not add 5.
- Replaced AppEnum with string `LogHowManyEntity` / `RemoveHowManyEntity` that parse digits and word numbers from the spoken token.
- Tokened cold-start URLs are applied again; tokenless replays stay skipped.
- Debug reinstalled. Did not uninstall.

## Owner was saying remove

- Counted log was first, so Siri never ran remove. “Remove 5 puffs” was also not donated.
- Counted remove is first again, including “remove N puffs in/on PuffPuffStop”.
- Debug reinstalled. Did not uninstall.

## Full remove / undo / reset variants

- Owner called out that remove, undo, reset, and variants were already requested.
- First shortcut now donates counted remove/undo/reset/subtract/take off/take away/reduce/revert.
- Second shortcut donates the remaining counted variants. One-puff and reset/clear/wipe stay separate.
- Android query list and Settings hint match those verbs.
- Debug reinstalled. Did not uninstall.

## Owner says “N puffs / 1 puff / a puff”

- Those exact shapes were not on the first shortcut. “Remove a puff” could match “Log a puff”.
- New first intent `RemoveSpokenPuffsIntent` donates remove/undo N puffs and N puff. One-puff shortcut donates “remove a puff” / “one puff”. “a”/“an” parse as 1.
- Debug reinstalled. Did not uninstall.

## Owner says “from PuffPuffStop”

- First shortcut only had in/on. “from” was on a later shortcut Siri ignores.
- First shortcut now leads with “remove N puffs from PuffPuffStop”, plus in and on. One-puff and reset also have from.
- Debug reinstalled. Did not uninstall.

## Remove still failed for the exact phrase

- String count entities with empty suggestions likely never bound, so Siri never ran remove.
- Counted remove is back on `RemoveCountChoice` AppEnum. Extra Siri names: “Puff Puff Stop” / “PuffPuff Stop”. Build 3.
- Debug reinstalled. Did not uninstall.

## Add a puff stopped working

- Counted log phrases like “Add N from App” stole “add a puff” and then failed to bind “a”.
- One-puff add is now the second shortcut. Counted log only accepts “N puffs”.
- Installed build 4. Launch failed because the phone was locked. Did not uninstall.

## Siri asked how many

- `requestValueDialog` on the count parameter made Siri ask even after “a puff” or a number.
- Removed those prompts. Count defaults to 1 when Siri does not bind a number.
- Debug reinstalled. Did not uninstall.

## Counted remove still subtracted 1

- Owner confirmed add and remove both run, and Siri no longer asks how many, but “remove 5 puffs” only dropped 1.
- Cause: default count of 1 plus a donated one-puff “Remove a puff from App” shortcut that could steal the counted phrase.
- Build 6: `RemoveHowManyEntity` parses the spoken number (including “a”); `UndoPuffIntent` is not donated. Installed and launched. Did not uninstall.

## Maps + number picker on remove

- Owner: “remove a puff” answered with Maps not-navigating; counted remove listed numbers and asked how many. They say **from** to remove and **in** to add, and want both prepositions on both.
- Cause: AppEntity suggestions are a Siri picker; missing “remove a puff from App” let “stop” hit Maps.
- Build 7: AppEnum for counted remove; dedicated one-puff remove; in+from on add and remove. Installed and launched. Did not uninstall.

## “to PuffPuffStop”

- Owner also says “to” when adding or removing.
- Build 8 donates to on one-puff and counted add/remove. Installed and launched. Did not uninstall.
- Owner confirmed add/remove is working well and asked to push. Blocker moved to `blockers-fixed/`.
- Pushed `905a06f` to `origin/main` as Cursor Agent. Did not store-submit.

## Phase 12 health wearables

- Owner asked to connect Fitbit/smartwatches during onboarding and Settings, capturing as much device data as allowed.
- Implemented Apple Health / Health Connect reads (HR, HRV, rest HR, breathing, SpO2, sleep, steps, energy, exercise, VO2, wrist temp) plus Fitbit OAuth wiring behind `EXPO_PUBLIC_FITBIT_CLIENT_ID`.
- Local snapshot only. Wellness copy, not medical. Tests 81/81, lint 0, typecheck 0.
