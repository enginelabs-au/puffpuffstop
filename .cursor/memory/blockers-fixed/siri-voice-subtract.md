# Siri cannot subtract / undo / reset

## Resolution

- Owner confirmed 2026-09-01 that add/remove via Siri is working well after build 8.
- Counted remove uses `RemoveCountChoice` AppEnum. One-puff remove is a dedicated intent. Phrases donate from, in, and to.

## What failed

- AppEntity suggestions listed numbers and asked how many.
- Missing “remove a puff from App” let “stop” fall through to Maps.

## Files

- `plugins/quick-log/LogPuffIntent.swift`
- `plugins/quick-log/PuffCountChoice.swift`
- `app.json`
