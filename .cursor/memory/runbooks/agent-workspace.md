# Domain: Agent workspace operating layout

## Purpose

Document the canonical autonomous agent control plane, startup materialization, sequential project planning, instruction routing, and context-preservation layout.

## Canonical paths

- `/AGENTS.md` — operating contract
- `/BOOTSTRAP.md` and `/scripts/bootstrap.sh` — post-Build materialization
- `/skills/launch-pipeline/scripts/preflight.mjs` — read-only launch health check
- `/INSTRUCTIONS.md` and `/instructions/` — instruction routing
- `/instructions/LAUNCH.md` and `/skills/launch-pipeline/SKILL.md` — practical product lifecycle entry
- `/instructions/ROLES.md` and `/agents/` — canonical role behavior and native adapters
- `/STATE.md` — active objective, phase, plan, and instructions
- `/memory/` — durable memory, continuations, blockers, and runbooks
- `/SKILLS.md` and `/skills/` — stable procedures
- `/TOOLS.md` — capability registry
- `/rules/*.mdc` — concise always-applied enforcement
- `docs/blueprints/` — strategy outputs
- `docs/plans/` — sequential phase plans and final checklist
- `docs/decisions/` — material decision records
- `docs/handover/` — operational handovers
- `docs/workstreams/` — task-local role charters, evidence, and handoffs

## Procedure

1. Install the agent configuration directory (for this repository, `.cursor/`) at repository root and keep a concise native `AGENTS.md` at the repository root.
2. Run read-only `node .cursor/skills/launch-pipeline/scripts/preflight.mjs` before selecting a lifecycle mode.
3. When preflight requires materialization or installation/repair is explicitly in scope, run `/scripts/bootstrap.sh` after implementation authorization. Skip bootstrap when ready. From the configuration root, use `bash scripts/bootstrap.sh`.
4. Confirm root documentation directories and indexes exist.
5. Confirm `/settings.json` links to `config/settings.json`.
6. Read `/AGENTS.md` once per session; reuse instructions already in context and re-read a control file only after change, context loss, or a newly relevant scope.
7. Invoke `/launch-pipeline` only when the complete named lifecycle is explicitly requested; natural planning and bounded work route proportionately through `/INSTRUCTIONS.md`.
8. For formal multi-role delivery or consequential release gates, create `docs/workstreams/<task-id>/manifest.md`, record required/skipped roles, and materialize required role artifacts. Ordinary bounded delegates use scoped task packets instead.
9. For new multi-phase projects, create and implement `docs/plans/phase_0_foundations_plan.md`, then generate one next phase plan at a time.
10. Preserve evidence in plans, workstreams, state, continuation logs, blockers, and runbooks according to file roles.

## Validation

- The resolved preflight script reports `READY` or `MATERIALIZATION_REQUIRED`.
- After authorization, the resolved `/scripts/bootstrap.sh` exits successfully.
- Required control files are non-empty.
- Root `docs/` subdirectories exist.
- Root `AGENTS.md` routes into the installed control plane and `docs/workstreams/README.md` explains task artifacts.
- Rules declare a valid activation mode: `00-core-routing.mdc`, `git-privacy-and-secrets.mdc`, and `karpathy-guidelines.mdc` always-on; planning, sub-agent, blocker, memory, and runbook rules Agent-Requested by description.
- Native role adapters, policy configuration, and validator checks pass.
- No secret values are stored in the control plane.
