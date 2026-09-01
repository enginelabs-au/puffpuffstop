---
schema_version: 1
task_id: 20260819-friendly-science-onboarding
title: Friendly science onboarding
source_request: Owner asked for VapeFree-like cartoon visuals, science-backed organs, Science tab, and onboarding rewrite
status: in-progress
risk_tier: 2
created_at: 2026-08-19T06:25:00Z
updated_at: 2026-08-19T06:25:00Z
revision: 1
owner: user-operator
active_role: orchestrating-lead
current_gate: parent-led-implementation
---

# Workstream Manifest: Friendly science onboarding

## 1. Objective

Deliver phase 10: cartoon-friendly UI, 50-year science-grounded organ scores, Science tab, and the specified onboarding changes. Local only.

## 2. Role matrix

| Role | Status | Reason |
|---|---|---|
| product-manager-subagent | skipped | Owner already specified product, copy, and acceptance in the request. |
| ui-ux-developer-subagent | skipped | Visual direction is explicit (VapeFree tone, cartoon organs, physical dials). Parent implements against existing tokens. |
| software-engineer-subagent | required (parent-led) | Domain, catalog, screens, tests. |
| security-engineer-subagent | skipped | No new network auth, payments, or remote data. Science links are outbound HTTPS only. Residuals SEC-P0-001/002/P4-001 unchanged. |
| growth-marketing-subagent | skipped | No acquisition or ads. |
| project-lead-subagent | skipped | No release or production action. Owner checklist stays closed until asked. |

## 3. Non-goals

Store submit, cloning VapeFree assets, inventing nicotine strengths, changing git identity to a personal email.
