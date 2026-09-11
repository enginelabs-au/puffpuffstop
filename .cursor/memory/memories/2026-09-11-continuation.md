# 2026-09-11 continuation

## Goal dial plus snapshot wipe guard

- Owner: onboarding and Settings were missing an explicit puff-goal question after usual use and before reduce-by. App also reset on device; streak and settings looked wiped.
- Device Documents pulled from Free Malware. Current `puffpuffstop-snapshot.json` is a 2026-09-11 re-onboard (50 puffs/day, 3 logs today, one progress day, pot 0). No `.bak` and no older history. Prior streak cannot be restored.
- Likely wipe: failed hydrate left empty in-memory defaults, then `bootPaceReminders` / `persistNow` wrote a valid empty v1 file over the real snapshot. One bad required field used to reject the whole file.
- Persist now refuses to overwrite a file that still has user data with vacant boot defaults. Last good snapshot is copied to `puffpuffstop-snapshot.bak.json`. Hydrate tries the backup if the primary is junk. Thin or slightly malformed v1 files keep what they can instead of discarding everything. Delete all local data is the only explicit empty write.
- New `goal` step (rotary dial + day/week/month/year) sits after quit-window and before reduce-by. Same control in Settings → Goals. Existing plans infer the dial from `cutDownBase` or usual use. Redo setup still prefills answers and keeps logs, streak, settings, and savings.
- Validation: `npm test` 140/140, typecheck 0, lint 0. Release build 38 installed on Free Malware.

## Puff credits visible again

- After the reset, goal equalled usual use (50/50), so hourly leftover rings hid. Puff Savings also hid at $0. An earlier request had removed the Credits label.
- Home now always shows `Puff credits` as unused puffs under today’s goal, and always shows Puff Savings including $0.
- Validation: `npm test` 141/141, typecheck 0, lint 0. Release build 39 installed on Free Malware.

## Credits restored from last commit; goals split

- Owner rejected the invented Home “Puff credits” line. `GoalResetRow` is back to `2d20218`. Leftover unused still shows on pace rings when the period goal is below usual use.
- Goals are now two dials: main/total (`mainGoalCount` + period) and period/current (`goalCount` + day/week/month/year). Reduce-by cannot step today’s cap below the main goal.
- Persist wipe-guard stays. Do not commit or push until the owner confirms the app.
- Validation: `npm test` 141/141, typecheck 0, lint 0. Release build 40 installed and launched on Free Malware. Not committed. Not pushed.

## Replace wrong commit `2d20218`

- Owner: that commit is wrong. Revert to the previous one and pull the new features forward.
- Local `main` reset to `c6a514b` (`git reset --mixed`). Origin still has `2d20218` (behind 1). No force-push.
- Working tree still has the 2d20218 product work plus today’s main/period goals and persist guard. Tests 141/141, typecheck 0, lint 0.
- Next: one replacement commit only after the owner confirms, then push only if they explicitly allow replacing `2d20218` on origin.

## Install clean `c6a514b` on device

- Owner asked to put that commit on the phone. Stashed later work, installed clean `c6a514b` as Release **41**, launched. Device lists `0.0.1` / `41`.
- Did not uninstall (local snapshot kept). Restored the later working-tree files afterward. Not committed. Not pushed.

## Pair c6a514b with goals and persist

- Owner confirmed build 41 (`c6a514b`) and asked to pull forward newer features, then commit and push as Cursor Agent.
- Kept `c6a514b` product files. Added main + period goal dials (onboarding + Settings) and persist wipe-guard. Did not bring `2d20218` organ/savings/line-graph changes.
- Validation: `npm test` 133/133, typecheck 0, lint 0.
