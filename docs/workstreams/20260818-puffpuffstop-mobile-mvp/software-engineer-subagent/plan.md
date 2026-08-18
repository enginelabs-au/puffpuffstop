---
schema_version: 1
task_id: 20260818-puffpuffstop-mobile-mvp
role_id: software-engineer-subagent
status: active
revision: 1
created_at: 2026-08-18T11:00:00Z
updated_at: 2026-08-18T11:00:00Z
---

# Role Plan: software-engineer-subagent

## 1. Entry criteria and inherited evidence

UI/UX PASS. Phase-0 plan T1–T5. npm available (Node 22).

## 2. Scope, non-goals, and requirement coverage

| Requirement ID | Planned disposition | Expected evidence |
|---|---|---|
| PPS-P0-01 | Expo Router app | `app/_layout.tsx`, typecheck |
| PPS-P0-02 | `src/theme/tokens.ts` | tests |
| PPS-P0-03 | age-gate domain + screens | tests + routes |
| PPS-P0-04 | empty `BRAND_CATALOG` | tests |
| PPS-P0-05 | scripts | lint/test/typecheck 0 |
| PPS-P0-06 | supabase baseline | files |
| PPS-P0-07 | `.env.example` | names only |
| PPS-EST-01–04 | `src/domain/estimation.ts` | tests |

## 3. Dependencies

npm registry. UX token names.

## 4. Files, interfaces, data, and external systems

See charter owned paths. No hosted systems.

## 5. Ownership and concurrency

Sole writer of application paths until Engineering handoff.

## 6. Ordered tasks

1. Scaffold Expo (temp dir merge).
2. Add domain modules + tests.
3. Implement age-gate routes per design spec.
4. Add supabase + env example.
5. Run lint/test/typecheck; fix until green.
6. Write technical-design, test-report, evidence, handoff.

Rollback: remove generated app files; keep docs.

## 7. Tool and modality plan

create-expo-app, npm, eslint, tsc, jest. No MCP deploys.

## 8. Horizontal full-stack checklist

| Area | Disposition | Rationale |
|---|---|---|
| Product value | reviewed | PRD |
| Experience | reviewed | UX spec |
| Client | owned | Expo |
| Server and APIs | not_applicable | none |
| Data | owned | empty catalog + future sqlite reserved |
| Identity and access | owned | local age-gate only |
| Integrations | not_applicable | |
| Security and privacy | reviewed | no tracking on block |
| Reliability | owned | offline screens |
| Quality | owned | scripts |
| Performance and cost | reviewed | static |
| Observability | reviewed | no PII logs |
| Measurement and growth | not_applicable | no events yet |
| Delivery | reviewed | local |
| Documentation and operations | owned | README pointer |
| Ethics and communications | reviewed | stub copy |

## 9. Risk controls, rollback, and recovery

Do not write `.env`. Do not call supabase CLI push. Preserve control-plane files.

## 10. Validation steps and expected evidence

`npm run lint`, `npm test`, `npm run typecheck`. Inspect `.env.example` and migration.

## 11. Outputs and storage paths

See charter.

## 12. Gate criteria and downstream handoff

All PPS-P0 verified. Residual: client-only gate.

## 13. Deviations and plan change log

None yet.
