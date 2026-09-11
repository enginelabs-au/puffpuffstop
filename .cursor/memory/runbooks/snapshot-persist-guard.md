# Snapshot persist guard

## Purpose

Keep the local `puffpuffstop-snapshot.json` unless the owner deletes data in Settings.

## Inputs

- JS persist in `src/data/persist.ts`, `src/data/snapshot.ts`, `src/data/file-driver.ts`
- Device file: Documents/`puffpuffstop-snapshot.json`
- Last-good copy: Documents/`puffpuffstop-snapshot.bak.json`

## What used to wipe people

A failed hydrate left empty in-memory defaults. The next `persistNow()` (often leftover-notice repair on boot) wrote a valid empty v1 file over the real plan.

## Guard

- Vacant boot state does not overwrite a file that still has a plan, logs, streak, or savings.
- `deleteLocalData` is the only explicit empty write (`runExplicitWipe`).
- Hydrate tries the `.bak` file if the primary is junk.
- Thin or slightly malformed v1 files keep what they can.

## Recovery check

```bash
xcrun devicectl device copy from \
  --device 00008140-0016406C0CDB001C \
  --domain-type appDataContainer \
  --domain-identifier au.com.enginelabs.puffpuffstop \
  --source Documents \
  --destination /tmp/puffpuffstop-device-docs
```

If only today’s re-onboard is present, older history is gone.

## Validation

`npm test` covers vacant overwrite, backup hydrate, and soft settings parse.
