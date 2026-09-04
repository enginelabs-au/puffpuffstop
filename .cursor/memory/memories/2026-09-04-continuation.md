# 2026-09-04 continuation

## Intra-day organ ease, usage metric, reduce-by, shade log

- Owner: recover organs when hourly usage eases, not only at day roll; show a usage metric on profile; add Reduce-by after quit-by (1–999,999) and in Settings; add Notification Center log/undo without unlocking.
- Hourly ease: last 60 min has fewer logs than the prior 60 min (and the prior hour was not empty). Awards one `easeTicks` per clock hour. Organ scores gain `HOUR_EASE_RECOVERY` (0.12), less than a full goal day. Home shows recovering organs plus “Usage is easing this hour…”
- Profile Score: Hourly usage card — this hour, last hour, and whether today’s clock hours are generally higher / easing / steady.
- Cut-down step retitled Reduce by; dial max 999,999; continue requires at least 1. Settings Goals uses the same dial.
- Shade card `puffpuffstop-shade` with Log puff / Undo, `opensAppToForeground: false`, sticky/list-only. Needs notification permission. iOS lock-screen actions depend on system settings; Android shows shade buttons.
- Validation: `npm test` 128/128, typecheck 0, lint 0. Release build 35. Shade actions do not require unlock; each tap uses the notification date so Log can fire more than once.
- Owner: skip Control Center; commit and push as Cursor Agent.
