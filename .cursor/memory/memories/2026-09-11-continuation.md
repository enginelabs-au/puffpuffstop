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
- Release build 42 installed and launched on Free Malware.
- Committed `05995da` and merged over origin `2d20218` without force-push (`b2f9e9d`). Author/committer Cursor Agent. Pushed to `origin/main`.

## Reinstall latest commit on device

- Owner thought the phone had been reverted. Reinstalled `b2f9e9d` as Release **43** (overwrite, no uninstall). Device lists `0.0.1` / `43`. App launched.

## Device check of `2d20218` timed credits

- Owner: build 43 did not show the features they wanted. Asked to revert to the previous commit that had leftover credits over 1 hour / 30 minutes / 15 minutes.
- Installed clean `2d20218` as Release **44**. Rings still only appear when today’s goal is below usual use (Pace fold). Git `main` left on `b2f9e9d`. Not committed. Not pushed.

## Pace hidden when goal equals usual

- Owner: build 44 did not show Pace. `PacingMeter` returned only the `logged/goal` row when `goal >= usual`, so 15/30/60 vanished after the reset.
- `goalPacing.applies` is now `goal > 0`. Tests 133/133. Installed `2d20218` + that fix as Release **45**. Open the Pace fold on Home. Not committed.

## Goal questions in use → reduce → daily goal → quit-by

- Owner: build 45 looked correct except Settings and onboarding goal order.
- Order is now: how many puffs they use, how many to reduce by over a period, the daily goal they want to reach, then when they want zero puffs. Same four questions in Settings → Goals and after motivation in onboarding (`cut-down` → `goal` → `quit-window`).
- Reduce-by still steps today’s cap and cannot go below the destination daily goal.
- Validation: `npm test` 140/140, typecheck 0, lint 0. Release **47** installed on Free Malware. Not committed. Not pushed.

## Daily goal starts the day they set it

- Owner: daily goal is not a number to reach later. It is the puff cap from when they set it (puffs per day).
- Copy no longer says “reach” or “get to” for the daily goal. Quit-by zero still asks when they want to reach zero.
- `summarizePlan` uses the daily goal as today’s cap immediately. Reduce-by steps later days down from that cap. Changing the goal in Settings or onboarding resets today’s cap to the new number.
- Validation: `npm test` 141/141, typecheck 0, lint 0. Release **48** installed on Free Malware. Not committed. Not pushed.

## Home was ignoring Settings daily goal

- Owner: goal settings were not showing on Home. Existing plans still had `cutDownBase` from usual use (e.g. 50) while `goalCount` was the new daily goal (e.g. 20). Home used the old base.
- Home now treats a stored base above the daily goal as stale and uses the daily goal as today’s cap. That repair is persisted. Home and Score re-read the plan on focus and on draft changes.
- Validation: `npm test` 142/142, typecheck 0, lint 0. Release **49** installed on Free Malware. Owner confirmed and asked to commit and push as Cursor Agent.
