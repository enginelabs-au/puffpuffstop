# Snapshot wipe on failed hydrate

## Symptom

App opened on onboarding with default settings. Streak and older progress gone. Owner did not delete data or uninstall.

## Evidence

- 2026-09-11 device Documents copy: only a same-day re-onboard snapshot (50 puffs/day, 3 logs, one progress day). No `.bak`.
- Code: `bootPersist` failure + `persistNow` of empty defaults, often from leftover-notice repair.

## Resolution

Vacant writes cannot replace a snapshot that still has user data. Backup + softer parse added. Verified by persist tests. Older streak on this phone was already overwritten and cannot be restored.
