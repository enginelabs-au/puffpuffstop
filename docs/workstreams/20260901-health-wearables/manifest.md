---
schema_version: 1
task_id: 20260901-health-wearables
title: Optional watch and Fitbit health context
source_request: Owner asked to connect Fitbit/smartwatches during onboarding, capture as much device data as allowed, and expose settings
status: in-progress
risk_tier: 2
created_at: 2026-09-01T12:52:00Z
updated_at: 2026-09-01T12:52:00Z
revision: 1
owner: user-operator
active_role: orchestrating-lead
current_gate: parent-led-implementation
---

# Workstream Manifest: Health wearables

## 1. Objective

Let the owner opt in to read wellness signals from Apple Health / Health Connect (Apple Watch, Fitbit, Wear OS, and other watches that sync to the phone) and optionally a direct Fitbit account. Show summaries next to the puff log. Stay 16+ wellness, not medical.

## 2. Role matrix

| Role | Status | Reason |
|---|---|---|
| product-manager-subagent | skipped | Owner specified connect-during-onboarding, Settings, and maximum device data. |
| ui-ux-developer-subagent | skipped | Reuse onboarding frame, Settings sections, and existing tokens. |
| software-engineer-subagent | required (parent-led) | Local store, HealthKit/Health Connect plugin, Fitbit OAuth wiring, tests. |
| security-engineer-subagent | skipped this gate | Read-only Health types, local snapshot, no remote upload. Fitbit tokens stay on device and are redacted from export. Not a store submit. |
| growth-marketing-subagent | skipped | No acquisition. |
| project-lead-subagent | skipped | No production or store action. |

## 3. Non-goals

WatchOS/Wear apps, writing vape events into Health, medical claims, store submit of Health entitlements, Fitbit developer-console signup (owner).
