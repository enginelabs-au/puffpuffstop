---
plan: phase_3_settings-savings
status: draft
created: 2026-08-18
updated: 2026-08-18
owner: lead-agent
source_phase: docs/plans/phase_2_home-log_plan.md
workstream: docs/workstreams/20260818-puffpuffstop-mobile-mvp/manifest.md
---

# Phase 3: Settings and puff savings

## 1. Objective

Add settings (profile, brand, goals, notifications toggle, privacy export/delete) and a local **Puff Savings** ledger of estimated money not spent. No card, no custody, no payout. Do not implement until phase 2 is verified and this plan is the active execution step.

## 2. Relation to project end-state

Home logging is the daily habit. Settings lets users edit the commitment inputs. Savings is a motivation meter, not a wallet.

## 3. Entry criteria and inherited evidence

Phase 2 must be verified first. SEC-P0-001/002 remain. 16+ only. No production.

## 4. Scope

- Settings screens from the locked brief.
- Local savings: `$X` per puff under commitment, accumulated, never charged.
- Export/delete local draft + log.

## 5. Non-goals

Cards, IAP, bank linking, store submit, ads, remote sync.

## 6–21. Deferred detail

Fill exhaustive sections at execution time from the phase-0 map and verified phase-2 store. Do not implement in this turn.

## 22. Next Plan Generation Prompt

Read `/AGENTS.md`, the complete core agent context, `/instructions/PROJECT_PLANNING.md`, `/instructions/ROLES.md`, `docs/plans/phase_0_foundations_plan.md`, this completed phase plan, the active workstream, and current repository state. Then generate exactly one next phase plan at `docs/plans/phase_4_store-ready_plan.md`. Do not implement that phase until the plan is written.
