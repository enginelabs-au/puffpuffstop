# Product Pipeline Launcher

## Role and objective

This file is the canonical practical entry point for starting, resuming, and closing product work in this repository. Read-only preflight is its first executable gate when the host permits execution; bootstrap is a conditional materialization gate after Build or existing implementation authorization. The launcher connects the operating contract, instruction router, adaptive roles, phase plans, skills, tools, memory, state, workstreams, validation, and owner handoff into one parent-agent workflow.

The filename is `LAUNCH.md`. Invoke the native project skill as `/launch-pipeline`; do not ask the user to attach the entire `.cursor/` tree manually.

## Activation

Activate only when the user explicitly invokes `/launch-pipeline` or explicitly asks to run that named lifecycle. The invocation can cover a new idea, major change, existing launched workstream, remediation, or closure.

A natural-language request for planning, strategy, a feature, or a resume does not silently invoke this launcher. Route those requests through `/INSTRUCTIONS.md` and load only matched task guidance. An active phase may continue under its existing recorded contract without reopening the complete launch process.

## Native discovery and routing

Cursor loads or discovers these surfaces without manual attachment:

- repository-root `AGENTS.md` — native project-wide router;
- `/rules/*.mdc` — three always-on rules plus Agent-Requested rules that load by description;
- `/agents/*.md` — native custom subagents;
- `/skills/*/SKILL.md` — native discoverable and slash-invokable skills;
- `/hooks.json`, `/cli.json`, `/sandbox.json`, and `/permissions.json` — native runtime and security configuration at required paths.

Files under `/instructions/` are ordinary Markdown, not native auto-loaded instructions. They must be reached through repository-root `AGENTS.md`, `/INSTRUCTIONS.md`, an active instruction entry in `/STATE.md`, or the `/launch-pipeline` skill. This launcher is the explicit bridge.

## Required launch graph

The parent remains the sole orchestrator. Reuse instructions already in context. On explicit activation:

1. Read repository-root `AGENTS.md` and `/AGENTS.md` if needed.
2. Read this file, `/STATE.md`, and `/INSTRUCTIONS.md` for the launch and current work.
3. Run the read-only `/skills/launch-pipeline/scripts/preflight.mjs` when execution is permitted.
4. Load only the matched instructions: `/instructions/STRATEGY.md`, `/instructions/PROJECT_PLANNING.md`, `/instructions/SUBAGENTS.md`, and/or `/instructions/ROLES.md`.
5. Load `/USER.md`, `/SKILLS.md`, `/TOOLS.md`, `/memory/MEMORY.md`, relevant blockers, plans, workstream evidence, skills, runbooks, source, and tests only when the selected mode needs them.

Native `/rules/*.mdc` already injected by the client are not reread. Do not sweep every active blocker, skill, memory, or role body. A delegated task receives a bounded packet; the parent owns shared state and launch preflight.

## Read-only preflight and bootstrap cornerstone

Every explicit invocation—new idea, major change, resume, remediation, or closure—runs this read-only check when a permitted execution tool is available:

```bash
node .cursor/skills/launch-pipeline/scripts/preflight.mjs
```

Ask Mode may not expose execution. In that case inspect available files, report preflight as not run, and defer execution until a capable mode before mutation. Do not bypass mode limits or claim a verified status. Preflight reads configuration health, materialization status, live state, and a lifecycle-mode hint without changing repository or external state. A `BLOCKED` preflight stops routing until the reported control-plane defect is repaired. `MATERIALIZATION_REQUIRED` is carried into the launch plan; it does not authorize a write while in Ask or Plan Mode.

After Build or explicit implementation authorization, read `/BOOTSTRAP.md` and run the resolved `/scripts/bootstrap.sh` only if preflight reports `MATERIALIZATION_REQUIRED`, or installation/repair is explicitly in scope. Required materialization must finish before work that depends on those artifacts. A `READY` workspace proceeds without another bootstrap. The script:

- resolves the repository and agent configuration roots;
- creates `docs/blueprints/`, `docs/plans/`, `docs/decisions/`, `docs/handover/`, and `docs/workstreams/`;
- seeds `docs/README.md`, `docs/plans/README.md`, and `docs/workstreams/README.md` only when absent;
- creates required agent, instruction, hook, memory, rule, script, skill, template, and config directories;
- preserves existing non-empty project content, hook files, and an existing `core.hooksPath`; handles linked worktrees through Git metadata;
- repairs the optional settings compatibility link when safe;
- validates required control-plane files and deterministic policy configuration.

If bootstrap fails, stop the launch before downstream mutation, preserve the failure evidence in state/continuation records when possible, repair only the missing or invalid artifact, rerun bootstrap, and continue only after it exits successfully.

## Intake contract

Extract from the user request and repository:

- idea or requested change;
- target user and problem;
- desired outcome and definition of success;
- known constraints, exclusions, references, and multimodal evidence;
- expected platform, environments, integrations, and delivery target when known;
- safety, privacy, security, legal, budget, timing, and production constraints;
- owner decisions already made.

Resolve missing information from evidence first. Make reversible provisional assumptions when safe and record them. Ask only for strict blockers or consequential decisions under `/AGENTS.md`.

Use an available user-question tool for required clarification, or ask concisely in the host conversation when no such tool exists. Bundle related decisions and do not ask the user to select, open, or execute individual control-plane files.

Before Plan or execution, present one activation summary containing:

- selected lifecycle mode;
- preflight status;
- objective and provisional risk classification;
- activated instructions;
- required and skipped roles with reasons;
- expected artifacts;
- owner decisions or approvals;
- next gate.

The parent Agent loads and routes files automatically from that summary.

## Mode selection

Classify the launch as exactly one operating mode.

### New idea or product

Activate Strategy and Project Planning; add Subagents when independent work warrants delegation and Roles for formal multi-role delivery or consequential gates. Produce an evidence-based blueprint, phase-zero roadmap, task workstream, adaptive role matrix, and owner decision points before application implementation.

### Major feature or migration

Inspect existing product and architecture evidence. Activate Strategy only when product, market, architecture, or launch assumptions need revalidation. Always activate Project Planning and Roles when the change spans phases or domains.

### Resume

Read `/STATE.md`, the active phase plan, the active workstream manifest, the current role charter/plan, the latest predecessor handoff, blockers, and continuation evidence. Resume only at the recorded gate; do not restart discovery or repeat completed work without new evidence.

### Remediation

Read the blocking verdict and finding IDs. Route work to the owning upstream role, invalidate affected downstream gates, implement the bounded remediation, and require independent re-verification before proceeding.

### Closure

Require Project Lead reconciliation, the final implementation checklist when applicable, and `docs/workstreams/<task-id>/delivery/owner-handoff.md`. The owner chooses `APPROVE`, `REQUEST_CHANGES`, or `DO_NOT_PROCEED`.

## Cursor Plan Mode and Build boundary

When the current interaction is in Ask or Plan Mode, keep it read-only. A reviewable plan states scope, materialization status, artifacts, checks, and the next authorized action. Wait for Build if the user has not already authorized implementation; do not create a redundant approval gate after an explicit Agent-mode implementation request.

Each pre-Build launch plan includes:

```text
## First post-Build action

Run or refresh read-only preflight if it could not run or installation state changed.
If MATERIALIZATION_REQUIRED (or installation/repair is explicitly in scope), run:

bash .cursor/scripts/bootstrap.sh

Require successful materialization before dependent changes. If READY, skip
bootstrap and begin the first approved task. Do not run it just because a new
session started. Resolve BLOCKED without bypassing policy.
```

Build approves the reviewed local plan. It does not authorize production deployment, publication, spend, secret access, remote database mutation, risk acceptance, or bypassing a stage gate. Preserve the scope of prior explicit authorization; do not ask again solely because this workflow is active.

For phased or formal role work, materialize the required planning and evidence records before dependent implementation. A bounded task outside that scope needs only proportionate planning and verification.

## New-product launch sequence

For a loose product vision, execute:

1. **Preflight and audit**
   - Run the read-only preflight.
   - Inspect repository, state, tools, skills, integrations, and prior evidence.
2. **Classification**
   - Assign task ID `YYYYMMDD-<descriptive-kebab-slug>`.
   - Classify risk and impacted domains under `/instructions/ROLES.md`.
   - Ask only for unresolved consequential decisions and present the activation summary.
3. **Plan and Build gate**
   - Produce the reviewable Cursor plan without repository mutation.
   - Close that plan with `First post-Build action`, the conditional `bash .cursor/scripts/bootstrap.sh`, and the `READY` skip path.
   - Wait for Build unless implementation was already explicitly authorized in Agent Mode.
4. **Bootstrap**
   - Run `/scripts/bootstrap.sh` only when materialization or explicit installation/repair is needed; otherwise proceed from `READY`.
5. **Workstream**
   - For formal role delivery, create `docs/workstreams/<task-id>/manifest.md` and record all six roles as required or skipped with evidence.
   - A phased single-owner implementation without formal gates may keep ownership and checks in its phase plan.
6. **Strategy**
   - Produce `docs/blueprints/YYYY-MM-DD_<project_slug>.md` when Strategy is activated.
7. **Phase zero**
   - Produce `docs/plans/phase_0_foundations_plan.md`.
   - Map the complete expected lifecycle while detailing only the current phase.
8. **Role planning**
   - For each formal role, materialize `charter.md` and `plan.md`; bounded supporting scouts use their task packets.
9. **Role execution**
   - Launch required roles through direct parent Task delegation in dependency order.
   - Materialize `evidence.md` and `handoff.md` before downstream activation.
10. **Implementation phases**
   - Implement and verify one phase at a time.
   - Generate only the next phase plan after the prior phase is complete.
11. **Remediation**
   - Return failed acceptance, quality, accessibility, privacy, reliability, or security gates to the accountable role and replay invalidated gates.
12. **Closure**
    - Produce the phased final checklist and, for formal role delivery, Project Lead reconciliation and the owner handoff.
    - Stop at the owner decision or at an explicitly authorized, policy-permitted action.

## Adaptive role order

Use only roles marked required in the manifest, preserving this relative order:

1. `product-manager-subagent`
2. `ui-ux-developer-subagent`
3. `software-engineer-subagent`
4. `security-engineer-subagent`
5. `growth-marketing-subagent`
6. `project-lead-subagent`
7. user/operator/owner

The parent agent launches every required role directly. Do not rely on custom-agent descriptions to guarantee automatic chaining. Do not create six disconnected chats. Read-only role outputs are returned to the parent for verification and materialization.

The complete role responsibilities, triggers, skip criteria, ownership, verdicts, and remediation loops live only in `/instructions/ROLES.md`.

## Role invocation contract

Every role brief must include:

- canonical role ID;
- task ID, risk tier, objective, and delegation reason;
- manifest, charter, role plan, predecessor handoff, and active phase plan;
- required core and detailed instruction files;
- exact read/write paths and external-system boundaries;
- non-goals, prohibited actions, and inherited decisions;
- output paths, evidence requirements, gate criteria, and downstream role.

Direct parent Task targets are:

- `product-manager-subagent`
- `ui-ux-developer-subagent`
- `software-engineer-subagent`
- `security-engineer-subagent`
- `growth-marketing-subagent`
- `project-lead-subagent`

The parent selects the matching custom subagent in its Task call and supplies the complete bounded brief. User-facing slash commands and disconnected role chats are not the orchestration mechanism.

## Canonical outputs

Use these locations:

- strategy: `docs/blueprints/`;
- phase plans and final checklist: `docs/plans/`;
- material decisions: `docs/decisions/`;
- task manifest and role artifacts: `docs/workstreams/<task-id>/`;
- owner handoff: `docs/workstreams/<task-id>/delivery/owner-handoff.md`;
- operational handovers: `docs/handover/`;
- live resumable status: `/STATE.md`;
- durable indexes and decisions: `/memory/MEMORY.md`;
- UTC continuation evidence: `/memory/memories/YYYY-MM-DD-continuation.md`;
- blockers and resolution criteria: `/memory/blockers/`;
- stable procedures: `/skills/`;
- exact historical procedures: `/memory/runbooks/`.

Do not duplicate canonical role bodies, long instructions, secret values, or unverified claims across outputs.

## Resume prompt contract

For an explicit launcher resume, behave as though instructed:

> Read repository-root `AGENTS.md` and `/AGENTS.md` if they are not already in context, `/instructions/LAUNCH.md`, the active phase plan, active workstream manifest, current role charter and plan, latest predecessor handoff, blockers, decisions, and continuation evidence. Verify current repository state against recorded evidence. Resume only from the recorded gate, preserve completed work, route the next required role, and continue until a strict blocker or owner decision.

## Initial idea prompt contract

For an explicit launcher invocation with a raw idea, behave as though instructed:

> Act as the parent orchestrator under repository-root `AGENTS.md` and `/instructions/LAUNCH.md`. Run permitted read-only preflight or mark it unrun in Ask Mode; infer intake from evidence; resolve strict blockers; present one activation summary. Respect the current mode and existing implementation authorization. The plan's `First post-Build action` includes `bash .cursor/scripts/bootstrap.sh` only when materialization or explicit installation/repair is needed, and skips bootstrap when `READY`. Activate Strategy and Project Planning for the new product, with Subagents and Roles only when their criteria apply. Materialize the blueprint and phase-zero plan, plus formal workstream artifacts if activated. Delegate independent tasks with bounded context, preserve role evidence and remediation gates where applicable, and continue until completion, a strict blocker, or an actual required owner decision. Production, publication, spend, secrets, destructive operations, and external mutation retain their policy and authorization boundaries.

## Security and production boundary

Role names, prompts, plans, handoffs, and Build approval are not authorization identities.

The launcher must respect:

- `/hooks.json`;
- `/cli.json`;
- `/sandbox.json`;
- `/permissions.json`;
- `.cursorignore`;
- protected branches, required CI/review, provider permissions, scoped credentials, and explicit owner approval.

These native JSON files remain at the `.cursor/` root because Cursor discovers them at exact documented paths. Organize their purpose through `/config/README.md`; do not move them into `/config/` or replace them with undocumented symlink indirection.

## Validation and completion

A launched workflow is complete only when:

- required instruction files were activated and recorded;
- for formal role delivery, every role is required or skipped with evidence and every activated role has charter, plan, evidence, and handoff artifacts;
- all blocking remediation loops are closed and invalidated gates replayed;
- implementation and integrated checks pass or exact limitations are surfaced;
- no high or critical security finding remains open;
- phase plan, state, memory, blockers, and continuation evidence match reality;
- the final checklist contains remaining human-only work;
- for formal role delivery, Project Lead prepared the owner handoff;
- any required owner decision is recorded rather than inferred; previously authorized bounded work does not create a new approval requirement.
