---
schema_version: 1
task_id: 20260818-puffpuffstop-mobile-mvp
role_id: product-manager-subagent
status: complete
revision: 1
created_at: 2026-08-18T10:46:00Z
updated_at: 2026-08-18T10:46:00Z
---

# Role Plan: product-manager-subagent

## 1. Entry criteria and inherited evidence

- Bootstrap exit 0 and preflight READY.
- Owner brief locks name, audience, onboarding, estimation, home, money, stack, risk tier, and six roles.
- Repository is control-plane plus README tagline; no application yet.

## 2. Scope, non-goals, and requirement coverage

| Requirement ID | Planned disposition | Expected evidence |
|---|---|---|
| PPS-AGE-01 / PPS-AGE-02 | Specify 16+ gate, hard stop, help resources, no tracking | PRD + blueprint |
| PPS-ONB-01–14 | Specify one-question screens, required fields, defaults | PRD |
| PPS-EST-01 | Specify formulas and plan-screen outputs | PRD |
| PPS-HOME-01–04 | Specify organs, log, today strip, recovery rules | PRD |
| PPS-SET-01 / PPS-MNY-01 | Specify settings and local savings only | PRD |
| PPS-SAFE-01 / PPS-SAFE-02 | Wellness + not-kids constraints | PRD + GTM notes |
| PPS-P0-01–07 | Sequence as phase-0 acceptance only | blueprint delivery map + phase-0 plan input |

Non-goals: implement screens, fill brand catalog, publish, spend.

## 3. Dependencies

Public research for competitive and store-policy evidence. No predecessor role.

## 4. Files, interfaces, data, and external systems

- Write via lead: this role directory, blueprint, PRD.
- Data entities (logical): Profile, AgeGateDecision, HabitEstimate, DeviceProfile, BrandCatalogEntry, DailyCommitment, PuffLog, OrganScore, LocalSavingsLedger.
- External systems: none authorized.

## 5. Ownership and concurrency

Lead materializes PM artifacts sequentially. No concurrent writes to the blueprint.

## 6. Ordered tasks

1. Inspect repo and owner brief. Method: read. Output: intake notes in evidence.
2. Public research: Puff Count, Puff Pacer, quit-vaping Reddit literature, App Store age/Kids rules. Method: WebSearch. Output: sources in blueprint §16.
3. Write PRD with unique IDs, acceptance, now/later/excluded. Output: `artifacts/product-requirements.md`.
4. Write STRATEGY-structured blueprint. Output: `docs/blueprints/2026-08-18_puffpuffstop.md`.
5. Record evidence and PASS/CONDITIONAL handoff for UI/UX.

Rollback: documentation-only; delete or revise artifacts if owner changes lock.

## 7. Tool and modality plan

WebSearch and repository read. No Figma, browser login, or analytics query.

## 8. Horizontal full-stack checklist

| Area | Disposition | Rationale |
|---|---|---|
| Product value | owned | PRD and blueprint |
| Experience | reviewed | journeys specified; UX details later |
| Client | reviewed | Expo locked |
| Server and APIs | reviewed | none in v1 offline core |
| Data | reviewed | local-first entities |
| Identity and access | reviewed | age-gate now; Auth later |
| Integrations | not_applicable | no third-party trackers in v1 |
| Security and privacy | reviewed | Security gate later |
| Reliability | reviewed | offline-first |
| Quality | reviewed | phase-0 checks |
| Performance and cost | reviewed | local device |
| Observability | reviewed | no PII logs |
| Measurement and growth | reviewed | after security |
| Delivery | reviewed | local only |
| Documentation and operations | owned | blueprint/PRD |
| Ethics and communications | reviewed | no shame, no kids copy, no clinical claims |

## 9. Risk controls, rollback, and recovery

Do not encode clinical accuracy. Do not recommend Kids Category. Keep money local. If research is incomplete, label limitation rather than invent metrics.

## 10. Validation steps and expected evidence

- Direct inspection of PRD IDs vs owner brief.
- Research links recorded.
- No secret values.
- Downstream can implement age-gate stub without inventing the 16+ rule.

## 11. Outputs and storage paths

Listed in charter §7.

## 12. Gate criteria and downstream handoff

PASS if PRD + blueprint cover locked product and phase map. Downstream UI/UX must preserve question order, required fields, and safety copy.

## 13. Deviations and plan change log

- No Task sub-agent runtime; parent lead executed this role directly. Recorded as provisional process assumption.
