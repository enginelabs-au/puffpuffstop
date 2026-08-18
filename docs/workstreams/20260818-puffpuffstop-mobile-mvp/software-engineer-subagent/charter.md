---
schema_version: 1
task_id: 20260818-puffpuffstop-mobile-mvp
role_id: software-engineer-subagent
status: active
revision: 1
created_at: 2026-08-18T11:00:00Z
updated_at: 2026-08-18T11:00:00Z
predecessor_handoff: docs/workstreams/20260818-puffpuffstop-mobile-mvp/ui-ux-developer-subagent/handoff.md
---

# Role Charter: software-engineer-subagent

## 1. Role objective

### Mission

Implement the smallest complete phase-0 foundation: Expo + TypeScript + Expo Router skeleton, design tokens, age-gate stub, empty brand table, lint/test/typecheck, Supabase local structure with empty baseline migration, and environment-variable name wiring.

## 2. Inherited request and evidence

- Manifest, phase-0 plan, PRD, UX design spec PASS
- Predecessor: UI/UX handoff
- Authorization: no remote DB, no store, no secrets

## 3. Scope, non-goals, and ownership

- In scope: app source, tests, eslint/tsconfig, supabase files, `.env.example`, gitignore Expo entries, README brief pointer if needed.
- Explicit non-goals: onboarding 2–14, home, settings, remote push, EAS submit, IAP, Bluetooth.
- Owned/write paths: `app/`, `src/`, `assets/` if needed, `supabase/`, `package.json`, lockfile, Expo/TS/ESLint/Jest configs, `.env.example`, `.gitignore`.
- Read-only paths: `.cursor/` governance, role docs (lead updates those).
- External-system scope: npm install only. No Supabase link/push. No Vercel.
- Prohibited actions: production mutation, secret files, force-push, implementing later screens.

## 4. Inherited requirements and vertical responsibilities

PPS-P0-01–07, PPS-AGE-01/02 stub, PPS-EST-01–04 helpers, PPS-SAFE copy on stub, PPS-NFR-01/04/06.

## 5. Assumptions, open questions, and clarification decisions

- `provisional` — Use current `create-expo-app` template versions.
- `provisional` — Jest + ts-jest or Expo jest preset for unit tests; if Expo jest is heavy, use `tsx` + node:test only if Expo types still typecheck.
- `verified` — Brand catalog is `[]`.
- `blocking` — none.

## 6. Skills, tools, and evidence sources

- `supabase-linked-migrations`: read for file layout; do not push.
- `vercel-deploy-workflow`: not used.
- Tools: npm, npx create-expo-app, eslint, tsc, jest.

## 7. Outputs and storage paths

- Implementation in assigned paths
- `artifacts/technical-design.md`, `artifacts/test-report.md` after verification
- `evidence.md`, `handoff.md`

## 8. Horizontal quality coverage

Client/data/quality owned for phase 0. Identity reviewed (local age-gate). Integrations not_applicable. Delivery local only.

## 9. Validation plan and gate criteria

PASS when lint, test, typecheck exit 0; files match PPS-P0; no secrets; no later-phase screens.

## 10. Risks, blockers, and escalation triggers

create-expo-app on non-empty repo. Hook fail-closed. npm network. Escalate if Expo cannot install.

## 11. Failure handling and recovery

Manual minimal Expo scaffold if generator refuses non-empty directory.

## 12. Downstream role and handoff conditions

Downstream: `security-engineer-subagent` with diff, commands, and residual client-only age-gate note.
