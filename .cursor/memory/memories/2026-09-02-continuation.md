# 2026-09-02 continuation

## Offline Release install

- Owner asked for a build that stays stable after the USB cable is removed.
- Debug 9 needed Metro (8082) and died when unplugged.
- Copied plugin Swift into `ios/PuffPuffStop/`, bumped `ios.buildNumber` to `10`, then:

```bash
npx expo run:ios --device 00008140-0016406C0CDB001C --configuration Release
```

- Result: Build Succeeded, installed `Release-iphoneos/PuffPuffStop.app`. `devicectl` lists `PuffPuffStop` `0.0.1` build `10`.
- Not a store submit. Did not uninstall (local snapshot preserved).
- Runbook: `/memory/runbooks/ios-device-debug-build.md` now documents the Release/unplug path.

## Goal pacing windows

- Owner asked for per-hour / 30-min / 15-min breakdowns when the daily goal is below usual puffs, plus a live yellow/green hour tracker.
- Domain: `src/domain/pacing.ts`. 24-hour day, `Math.ceil`. Example: 50 usual → 25 goal → 2 / 1 / 1.
- Onboarding cut-down, Settings Goals, plan, and Home show the breakdown. Home/Settings chips are mint while the window still has room, amber when that slot is used. Copy: tracks logs only, does not ask you to vape.
- Daily log now stores `puffAt` timestamps. Old snapshots default to `[]`. Voice writers in `plugins/quick-log/VoiceSnapshot.swift` / `.kt` keep the same list.
- Validation: `npm test` 90/90, typecheck 0, lint 0. Release build 11 installed on Free Malware. Not a store submit.

## One-line pacing strip

- Owner asked to put the green windows on one line next to the daily goal: `2/25 | Hour: 0/2 (timer) | 30 Min: 0/1 (timer) | 15 Min: 0/1 (timer)`.
- Home and Settings now use a compact horizontal strip. Mint/amber still mark open vs used. Release build 12 installed.
- One line overflowed. Stacked the goal and three windows vertically (full width, no sideways scroll). Release build 13.

## Vaping-relevant watch metrics

- Home no longer lists steps, energy, sleep, or VO2. Only heart rate, HRV, oxygen, and breathing.
- A row appears only when the last puff has a watch sample in the 20 minutes before and after, and the value moved (3 bpm / 3 ms / 1% / 1 breath).
- Copy is correlation: “around that log”, not a diagnosis. Native HealthKit/Health Connect write `effects`; Fitbit uses minute heart/SpO2 when the API allows.
- Validation: tests 90/90. Release build 14.

## Pacing unused-hour roll

- Owner: do not show “Credits” or a per-row saved count.
- Do not re-split the daily goal or a rolled hour across 30/15. Keep the original 2 / 1 / 1.
- If the previous hour used 1 of 2, this hour is 3. 30 min and 15 min stay 1.
- Do not bank unused from every empty hour since midnight. Cap at the remaining daily goal.
- Release build 17.

## Fitbit connection check

- Phone snapshot: Apple Health connected (`healthkit`, status ok, last sync 2026-09-02T06:01:36Z). Fitbit account is not connected (`fitbitEnabled` false, no tokens, source list is only healthkit).
- Health sidecar has no heart / HRV / oxygen / breathing samples stored, so nothing from Fitbit (or any watch) is landing in the app yet.
- Direct Fitbit login still needs a Fitbit app id (`EXPO_PUBLIC_FITBIT_CLIENT_ID`).
- Owner is logged into Google Health (Fitbit). That is not this app’s Fitbit OAuth. Path: Google Health → Partner apps → Apple Health (heart rate, oxygen, breathing), then Sync Apple Health and log a puff.
- Settings no longer shows Connect Fitbit when no app id is baked in. Release build 19.
- Recheck 2026-09-02T06:12:24Z: Apple Health still ok and freshly synced. Sidecar still has no heart / HRV / oxygen / breathing samples. Fitbit login remains off (expected).

## Android Health Connect + live banner

- Owner asked to wire Android phones and Android watches, and show a highly visible live indicator when heart / oxygen / breathing move around a puff.
- No Wear OS app (phase 12 non-goal). Wear / Pixel / Fitbit reach the phone through Health Connect.
- `HealthConnectActivity` now answers `puffpuffstop://health-refresh` without a permission dialog when access is already granted. Manifest also queries Health Connect.
- iOS `health-refresh` no longer opens a JS route (AppDelegate returns true).
- Home shows `WatchShiftBanner` under the goal: mint “Watching this log” for 20 minutes, amber card with before → after when a material shift lands. Polls native refresh for 3 minutes after a log.
- Tests 95/95. Release build 20.
- Hour unused now also raises 30/15 from that hour (4 → 2 / 1). Watch banner only if Health is on and vitals are in the snapshot. Release build 21.
- Disconnect was overwritten by the next Health sync. It now persists off, clears samples, and sync cannot turn it back on until Connect. Settings has Show watch metrics. Release build 22.
- Owner asked to commit and push this work as `Cursor Agent <cursoragent@cursor.com>`.

## Daily reset countdown

- Home goal row under Hey is `logged/goal (countdown)` to the 11:59pm local reset, when the puff count returns to zero.
- Domain: `msUntilDayReset` uses the saved timezone. Tests 95/95. Release build 18.
