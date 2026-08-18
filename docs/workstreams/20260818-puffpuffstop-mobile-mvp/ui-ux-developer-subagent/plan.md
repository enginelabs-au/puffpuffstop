---
schema_version: 1
task_id: 20260818-puffpuffstop-mobile-mvp
role_id: ui-ux-developer-subagent
status: complete
revision: 1
created_at: 2026-08-18T10:55:00Z
updated_at: 2026-08-18T10:55:00Z
---

# Role Plan: ui-ux-developer-subagent

## 1. Entry criteria and inherited evidence

PM handoff `PASS`, PRD, blueprint, phase-0 plan. No existing UI source. No Figma.

## 2. Scope, non-goals, and requirement coverage

| Requirement ID | Planned disposition | Expected evidence |
|---|---|---|
| PPS-P0-02 | Token spec | design-specification.md |
| PPS-P0-03 / PPS-AGE-01/02 | Age-gate + blocked screens | flow matrix + copy |
| PPS-ONB-02–14 | Later map only | flow matrix; not phase 0 build |
| PPS-HOME-* | Later map only | flow matrix |
| PPS-SAFE-01/02 | Copy + visual tone | design spec |
| PPS-NFR-05 | A11y rules | accessibility-specification.md |

## 3. Dependencies

PM contract. No visual source files.

## 4. Files, interfaces, data, and external systems

This role directory only. Token names Engineering must implement: `color`, `space`, `radius`, `type`, `motion`.

## 5. Ownership and concurrency

Lead materializes UX files after this plan. Engineering must not start stub UI until design-specification exists.

## 6. Ordered tasks

1. Audit empty UI surface.
2. Specify tokens and voice (teen-cute, not preschool).
3. Specify age-gate and blocked states including help resources layout.
4. Map remaining 13 onboarding screens, plan, home, settings as later.
5. Write a11y spec.
6. Evidence + handoff.

## 7. Tool and modality plan

Markdown specifications. No Figma. No screenshots until Engineering builds the stub.

## 8. Horizontal full-stack checklist

| Area | Disposition | Rationale |
|---|---|---|
| Product value | reviewed | follows PRD |
| Experience | owned | this role |
| Client | reviewed | Expo |
| Server and APIs | not_applicable | none in phase 0 |
| Data | reviewed | no writes on block |
| Identity and access | reviewed | age-gate |
| Integrations | not_applicable | |
| Security and privacy | reviewed | |
| Reliability | reviewed | offline stub |
| Quality | reviewed | |
| Performance and cost | reviewed | static screens |
| Observability | reviewed | no tracking on block |
| Measurement and growth | reviewed | |
| Delivery | not_applicable | |
| Documentation and operations | owned | specs |
| Ethics and communications | owned | no shame, no kids, no clinical |

## 9. Risk controls, rollback, and recovery

If tokens look child-coded, shift type to rounded-grotesk not comic sans; keep 16+ language on first screen.

## 10. Validation steps and expected evidence

Traceability table in evidence.md. Direct spec inspection.

## 11. Outputs and storage paths

See charter.

## 12. Gate criteria and downstream handoff

PASS if Engineering can build the stub without inventing layout, copy, or tokens.

## 13. Deviations and plan change log

Parent lead executed this role (no Task runtime).
