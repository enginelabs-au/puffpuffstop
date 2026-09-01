---
schema_version: 1
task_id: 20260901-quick-log-hardware
title: Voice log from Siri and Gemini
source_request: Owner dropped volume-button quick log because it needs the app open, and asked for Siri / Gemini locked-phone logging instead
status: in-progress
risk_tier: 2
created_at: 2026-09-01T08:40:00Z
updated_at: 2026-09-01T09:10:00Z
revision: 2
owner: user-operator
active_role: orchestrating-lead
current_gate: parent-led-implementation
---

# Workstream Manifest: Voice log

## 1. Objective

Replace hardware quick log with native-assistant logging. Siri App Intents write the local snapshot without opening the app. Android exposes a headless Log puff action for Gemini / Google Assistant or a one-time Routine.

## 2. Role matrix

| Role | Status | Reason |
|---|---|---|
| product-manager-subagent | skipped | Owner specified remove hardware log and ask for Siri / Gemini. |
| ui-ux-developer-subagent | skipped | Copy-only Settings and onboarding against existing tokens. |
| software-engineer-subagent | required (parent-led) | Remove volume path; native snapshot writers; tests. |
| security-engineer-subagent | skipped | Local snapshot write only. Exported Android activity is on-device. No new network. |
| growth-marketing-subagent | skipped | No acquisition. |
| project-lead-subagent | skipped | No production or store action. |

## 3. Non-goals

Store submit, Gemini App Functions KSP, personal git identity.
