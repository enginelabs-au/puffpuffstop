# 2026-09-07 continuation

## Slow organ heal, buy-frequency savings, stepping reduce-by

- Owner: organ heal was too fast (mid-90s to 100 after one no-log day). Research public-health cessation clocks and apply months-to-years rates. Savings from device cost and buy frequency. Reduce-by is a number plus day/week/month/year that steps the next period’s goal. Prompt after a few missed days. Drop the 1–999,999 Settings mention.
- Evidence used as wellness analogy, not medical: Surgeon General 2020 cessation report; IPCRG/McEwen timeline (circulation 2–12 weeks, lung function up to ~10% by 3–9 months, CHD risk ~half at 1 year / ~never at 15 years); taste recovery weeks to ~8 months; liver CYP reversal 2–4 weeks.
- Model: 180 under-goal days add about 1.5 points on average (lungs 1.0, heart 1.6, brain 1.4, liver 1.7, mouth 1.8). One quiet day cannot jump the mid-90s to 100. Hourly ease is 1/24 of that day’s organ rate.
- Savings: cost / period days × unused fraction of usual. $40/week and 0 logs → 40/7. Half usual logs → half that. No cost keeps the old per-puff fallback.
- Reduce-by: today stays; next day/week/month/year drops by the chosen count. Existing users keep today’s commitment, then step. After 3 consecutive misses, Home asks if they want an easier pace.
- Validation: `npm test` 135/135, typecheck 0, lint 0. Release build 36.

## Profile savings tracker and line graphs

- Owner: track money saved on Score as its own series over time; switch all tracking charts from bars to lines.
- Progress days persist `saved`. Range card shows estimated savings for 7/30/84 days plus the all-time pot. The line is cumulative in-range savings.
- Hourly usage, daily puffs vs goal, and savings are SVG polylines (`src/ui/ProgressLines.tsx`). Bar chart component removed.
- Older snapshot days without `saved` are reconstructed from that day’s logs and goal on load. Savings remain an estimate, not real money.
- Validation: `npm test` 136/136, typecheck 0, lint 0. Release build 37 installed on Free Malware. Owner asked to commit and push as Cursor Agent.
