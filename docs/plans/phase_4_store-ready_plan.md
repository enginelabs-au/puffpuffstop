---
plan: phase_4_store-ready
status: draft
created: 2026-08-18
updated: 2026-08-18
owner: lead-agent
source_phase: docs/plans/phase_3_settings-savings_plan.md
workstream: docs/workstreams/20260818-puffpuffstop-mobile-mvp/manifest.md
---

# Phase 4: Store-ready hardening

## 1. Objective

Harden the local app for later store review: persist onboarding/log/savings on device, optional signed-in sync, animation polish, privacy policy copy, and the final implementation checklist. Do not implement until phase 3 is verified. This still does **not** authorize production deploy, App Store/Play submit, ads, secrets, or remote DB mutation.

## 2. Relation to project end-state

Phases 0–3 deliver the usable local loop. Phase 4 prepares release artifacts and remaining human-only actions.

## 3. Entry criteria

Phase 3 verified. SEC-P0 residuals still documented. Owner must separately approve any store or production action.

## 4. Scope (when executed)

- Replace in-process stores with SQLite or equivalent.
- Replay security review after persistence and any first real migration.
- Generate `docs/plans/final_implementation_checklist.md` with env names and owner-only store/account steps.

## 5. Non-goals

Publishing, paid ads, card processing, holding funds.

## 22. Next Plan Generation Prompt

After this phase is verified, create `docs/plans/final_implementation_checklist.md` only. Do not invent another implementation phase.
