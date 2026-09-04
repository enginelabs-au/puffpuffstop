# 2026-09-03 continuation

## Pace rings and lenient-rule tips

- Owner asked to visualize roll-over and cut-down: info bubbles on the main tracking numbers and Pacing Intervals, a tap tooltip using banked/borrowed language, and progress rings instead of the old interval chips.
- `PACING_LENIENT_TIP`: unused puffs are banked for upcoming windows; extra puffs are borrowed from the next window; chase the long-term cut-down, not a perfect hour; still log-only / does not ask anyone to vape. Math is unchanged (lookback 3 leftover, overage is debt, no midnight bank of every empty hour).
- Home/Settings: one `InfoTip` on Pacing Intervals only. `PaceRing` shows `used/allowance` and `Next window in: MM:SS`. Green / yellow / red still mean open / used up / over.
- Validation: `npm test` 121/121, typecheck 0, lint 0. Release build 33.
