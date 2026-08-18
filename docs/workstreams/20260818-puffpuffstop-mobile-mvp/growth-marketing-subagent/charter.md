---
schema_version: 1
task_id: 20260818-puffpuffstop-mobile-mvp
role_id: growth-marketing-subagent
status: complete
revision: 1
created_at: 2026-08-18T11:27:00Z
updated_at: 2026-08-18T11:27:00Z
predecessor_handoff: docs/workstreams/20260818-puffpuffstop-mobile-mvp/security-engineer-subagent/handoff.md
---

# Role Charter: growth-marketing-subagent

## 1. Role objective

### Mission

Produce an ethical, privacy-aware positioning and measurement plan for PuffPuffStop without campaigns, ads, posts, or spend.

## 2. Inherited request and evidence

PM PRD, blueprint GTM section, Security CONDITIONAL. Owner: no paid ads.

## 3. Scope, non-goals, and ownership

- In scope: 16+ positioning, store-copy constraints, event taxonomy draft, later experiment ideas, Reddit hook concepts (not posts).
- Explicit non-goals: publishing, messaging users, launching ads, changing analytics production, inventing TAM.
- Owned/write paths: this directory via lead (read-only role).
- External-system scope: none. No analytics MCP authenticated.
- Prohibited actions: campaigns, spend, “for kids” copy, clinical cure claims.

## 4. Inherited requirements and vertical responsibilities

PPS-SAFE-01/02, growth metrics with unknown baselines, Security conditions.

## 5. Assumptions, open questions, and clarification decisions

No verified traffic. All numbers remain unknown.

## 6. Skills, tools, and evidence sources

No Vercel skill. Public research already in blueprint. No BigQuery.

## 7. Outputs and storage paths

charter, plan, evidence, handoff, `artifacts/growth-plan.md`, `artifacts/measurement-plan.md`.

## 8. Horizontal quality coverage

Measurement and ethics owned. Product/security reviewed.

## 9. Validation plan and gate criteria

PASS if recommendations trace to PRD, claims have evidence limits, no implied publish/spend approval.

## 10. Risks, blockers, and escalation triggers

Kids-copy drift; medical claims; community spam.

## 11. Failure handling and recovery

Revise drafts only.

## 12. Downstream role and handoff conditions

`project-lead-subagent`.
