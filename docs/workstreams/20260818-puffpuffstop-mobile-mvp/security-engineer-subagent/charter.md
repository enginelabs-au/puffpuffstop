---
schema_version: 1
task_id: 20260818-puffpuffstop-mobile-mvp
role_id: security-engineer-subagent
status: planning
revision: 1
created_at: 2026-08-18T11:00:00Z
updated_at: 2026-08-18T11:00:00Z
predecessor_handoff: docs/workstreams/20260818-puffpuffstop-mobile-mvp/software-engineer-subagent/handoff.md
---

# Role Charter: security-engineer-subagent

## 1. Role objective

### Mission

Independently review the phase-0 surface for age-gate, privacy, wellness-claim, secret, and future-auth risks. Issue a blocking or conditional verdict from evidence, not from other roles’ claims.

## 2. Inherited request and evidence

- Tier 3 workstream; PM and UX PASS
- Engineering handoff (after implementation) is the primary technical input
- Authorization excludes production, remote DB, and secrets

## 3. Scope, non-goals, and ownership

- In scope: threat model, findings, privacy of under-16 path, secret scan of new files, dependency/config review, residual risks.
- Explicit non-goals: implementing fixes, writing app code, exploiting production, accepting owner risk.
- Owned/write paths or `read-only`: this directory via lead.
- Read-only paths: entire app diff, supabase files, `.env.example`, PRD, UX spec.
- External-system scope: read-only local inspection and safe scanners. No pentest against hosted systems.
- Prohibited actions: source edits, lowering severity without evidence, remote mutation.

## 4. Inherited requirements and vertical responsibilities

PPS-AGE-02 no tracking; PPS-SAFE-01/02; PPS-MNY-01 no payments; PPS-NFR-04 no secrets; PPS-P0-06 no remote apply.

## 5. Assumptions, open questions, and clarification decisions

- `verified` — phase-0 age-gate is client-only.
- `provisional` — empty baseline migration contains no RLS (acceptable if no tables).
- `blocking` — none expected if Engineering stays local.

## 6. Skills, tools, and evidence sources

Policy tests and config validator are control-plane, not app. App review: grep, file inspect, npm audit if available (record if it fails). No paid SAST.

## 7. Outputs and storage paths

`charter.md`, `plan.md`, `evidence.md`, `handoff.md`, `artifacts/threat-model.md`, `artifacts/findings.md`, `artifacts/security-review.md`.

## 8. Horizontal quality coverage

Identity, security/privacy owned. Other areas reviewed for phase-0 blast radius.

## 9. Validation plan and gate criteria

PASS only if no open high/critical finding. CONDITIONAL allowed for documented client-only age-gate residual with owner and due point. BLOCKED for secrets, tracking on block path, payments UI, or remote mutation.

## 10. Risks, blockers, and escalation triggers

Client age-gate bypass. Medical-claim copy. Secret leakage. Escalate to Engineering if any high finding.

## 11. Failure handling and recovery

Return to Engineering with finding IDs. Replay this gate after fixes.

## 12. Downstream role and handoff conditions

On PASS or eligible CONDITIONAL: `growth-marketing-subagent` (no campaigns). On BLOCKED: Engineering only.
