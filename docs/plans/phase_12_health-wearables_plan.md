---
plan: phase_12_health-wearables
status: implementing
created: 2026-09-01
updated: 2026-09-01
owner: lead-agent
source_phase: docs/plans/phase_11_quick-log-hardware_plan.md
---

# Phase 12: Optional local health context (not medical)

## 1. Objective

Let the owner opt in during onboarding and Settings to read watch signals from Apple Health / Health Connect, and optionally a direct Fitbit login when `EXPO_PUBLIC_FITBIT_CLIENT_ID` is set. Stay 16+ wellness, not a medical device.

## 2. Why not Fitbit or a watch app first

- Apple Watch and most Wear OS / Fitbit devices already write into HealthKit or Health Connect.
- A Fitbit Web API needs OAuth credentials, a privacy review, and a remote account.
- A native watchOS / Wear complication is a second app binary and store listing.
- Read-from-Health is the one path that works with the phone locked after a one-time permission.

## 3. Useful parameters we can actually read

| Signal | Why it is relevant to vaping | Typical source | Honesty |
|---|---|---|---|
| Heart rate around a log | Nicotine often raises HR for minutes | HealthKit / Health Connect | Correlation only |
| Heart-rate variability (HRV) | Often falls after nicotine / stress | Nightly or spot samples | Sparse on many watches |
| Resting heart rate (day / week) | Can drift up with heavier use | Daily Health summary | Slow trend, not per puff |
| Respiratory rate (sleep) | Some watches estimate overnight | Sleep session | Not per puff |
| SpO2 | Occasional spot or sleep | Not on every device | Noisy |
| Sleep duration / awakenings | Nicotine can fragment sleep | Sleep analysis | Night-level only |
| Steps / active energy | Context for “elevated HR from a walk vs a puff” | Activity | Confounder, not a vape signal |

Do **not** claim diagnosis, withdrawal treatment, or that HRV between puffs is a clinical measure. Watches do not timestamp a puff; we can only compare Health samples near a log time.

## 4. Non-goals this phase

watchOS/Wear apps, writing vape events into Health, remote upload, ads, medical claims, Fitbit developer-console signup.

## 5. Acceptance (when implemented)

- Opt-in Settings toggle. Permission copy says wellness context, not medical.
- iOS HealthKit + Android Health Connect read of HR, HRV, oxygen, and breathing around a puff (Wear / Pixel / Fitbit via Health Connect; no Wear app).
- Home shows a large live banner when those signals move around a log. Silent `health-refresh` on both OS.
- Denied / unavailable states do not block logging.
- Privacy policy names the Health types. Local snapshot only.

## 6. Deferred

Fitbit partner API, watch complications, per-puff HRV math, store submit of Health entitlements.
