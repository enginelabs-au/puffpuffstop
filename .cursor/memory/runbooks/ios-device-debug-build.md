# Local iOS debug build on a connected iPhone

## Purpose

Install a Debug build of PuffPuffStop on a wired iPhone with `npx expo run:ios --device`. This is not an EAS or App Store submit.

## Inputs

- Wired iPhone with Developer Mode on and trusted
- Xcode + CocoaPods
- Apple Development identity for team `256U2M55W7`
- `ios.bundleIdentifier` and `ios.appleTeamId` in `app.json`

## Commands

```bash
export PATH="/opt/homebrew/bin:$PATH"
# Expo wants the hardware UDID from `xcrun xctrace list devices`, not the Core Device UUID.
npx expo run:ios --device 00008140-0016406C0CDB001C
```

Device used 2026-09-01: iPhone 16 Pro “Free Malware”, hardware UDID `00008140-0016406C0CDB001C`.

## Xcode 26.3 workaround

`expo-modules-jsi@57.0.4` fails with ambiguous `abs` in `JavaScriptCodable+Date.swift`. Change `abs(milliseconds)` to `Swift.abs(milliseconds)` in that file before building.

## Validation

- `xcodebuild` reports Build Succeeded
- `devicectl device info apps` lists `au.com.enginelabs.puffpuffstop`
- App launches and Metro serves the JS bundle

## Caveats

- Generated `ios/` is gitignored
- First launch may require trusting the developer cert on the phone
- Debug builds need Metro running (this install used port 8082)
- Copy `plugins/quick-log/*.swift` into `ios/PuffPuffStop/` before a native rebuild so Siri intents match the plugin sources
