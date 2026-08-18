---
schema_version: 1
task_id: 20260818-puffpuffstop-mobile-mvp
role_id: security-engineer-subagent
status: draft
revision: 1
created_at: 2026-08-18T11:00:00Z
updated_at: 2026-08-18T11:00:00Z
---

# Role Plan: security-engineer-subagent

## 1. Entry criteria and inherited evidence

Engineering handoff with lint/test/typecheck evidence. Do not PASS from placeholders.

## 2. Scope, non-goals, and requirement coverage

| Requirement ID | Planned disposition | Expected evidence |
|---|---|---|
| PPS-AGE-02 | Verify blocked path has no persistence/analytics | source inspect |
| PPS-SAFE-01/02 | Verify stub copy | source inspect |
| PPS-NFR-04 | Secret/path scan | grep + file list |
| PPS-P0-06 | No remote apply; empty baseline | file inspect |
| PPS-MNY-01 | No payment code | grep |
| Client gate residual | CONDITIONAL if only client-side | threat model |

## 3. Dependencies

Completed Engineering implementation.

## 4. Files, interfaces, data, and external systems

`app/`, `src/`, `supabase/`, `.env.example`, `package.json`.

## 5. Ownership and concurrency

Read-only after Engineering freeze of app paths.

## 6. Ordered tasks

1. Read Engineering handoff and diff.
2. Threat-model age-gate, env, supabase stub.
3. Grep for secrets, fetch, analytics, payment.
4. Record findings and verdict.
5. Handoff to Growth only if not BLOCKED.

## 7. Tool and modality plan

Read, Grep, optional `npm audit --omit=dev` (non-blocking if network/advisory noise). No exploit PoCs.

## 8. Horizontal full-stack checklist

Security/privacy/identity owned. Client/data reviewed. Growth/delivery reviewed for unauthorized publish.

## 9. Risk controls, rollback, and recovery

No destructive scans. Findings get stable IDs SEC-P0-NNN.

## 10. Validation steps and expected evidence

Each finding has path + evidence state. Verdict uses ROLES.md semantics.

## 11. Outputs and storage paths

See charter.

## 12. Gate criteria and downstream handoff

See charter §9.

## 13. Deviations and plan change log

Charter written before Engineering complete; evidence waits for implementation.
