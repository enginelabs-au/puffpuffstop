---
name: launch-pipeline
description: Runs the named product delivery lifecycle for new ideas, major changes, resumption, remediation, or closure only when the user explicitly invokes /launch-pipeline or requests this named workflow.
disable-model-invocation: true
---

# Launch Pipeline

## Explicit activation

Use only when the user explicitly invokes `/launch-pipeline` or asks to run that named lifecycle. A natural-language request for planning, strategy, implementation, or resume does not implicitly activate this skill. Those requests use the repository router and proportionate task guidance.

## Required context

Reuse repository-root `AGENTS.md` and `.cursor/AGENTS.md` already in context; read missing applicable instructions once. Read `.cursor/instructions/LAUNCH.md`, then only the instruction sections, source, plans, skills, and evidence selected by its current mode. The parent owns routing and shared state. Bounded delegates receive task packets rather than repeating launch startup or scanning shared state/history.

## Preflight and materialization

When a permitted execution tool is available, run from the repository root:

```bash
node .cursor/skills/launch-pipeline/scripts/preflight.mjs
```

Ask Mode may lack execution tools. Then inspect available files, mark preflight **not run**, and defer execution to a capable mode before mutation. Never bypass the host mode or claim a verified `READY` status without evidence. Ask and Plan Mode remain read-only.

- `READY`: continue the selected mode; do not bootstrap again because a session started.
- `MATERIALIZATION_REQUIRED`: include missing artifacts in the plan. After Build or existing explicit implementation authorization, read `.cursor/BOOTSTRAP.md`, run `bash .cursor/scripts/bootstrap.sh`, and require success before dependent work.
- `BLOCKED`: preserve evidence and resolve the reported defect within authorization; do not bypass policy.
- Explicit installation or repair may also justify bootstrap. Preserve existing hook paths and implementations; newly seeded hook files are not proof of activation.

## Procedure

1. Inspect preflight or record its execution limitation; infer intake from the user request and relevant repository evidence.
2. Select new idea, major change, resume, remediation, or closure under `.cursor/instructions/LAUNCH.md`.
3. Ask only for a strict blocker or consequential owner decision lacking a defensible default, using an available question tool or the conversation. Existing implementation authorization remains valid.
4. Present one concise activation summary: mode, preflight, objective, risk/reasons, matched instructions, expected artifacts, any required roles/gates, materialization need, owner decisions, and next action.
5. In Plan Mode, present a reviewable plan and wait for Build unless implementation is already explicitly authorized in the current execution mode. Do not introduce a second approval solely because this skill is active.
6. Materialize missing setup only when needed, then create the applicable blueprint/phase plan and formal workstream records when that pipeline is active.
7. One parent invokes independent workers directly through the host's available delegation tool. Bounded scouts need task packets; formal roles preserve charter, plan, evidence, handoff, required/skipped-role records, and supported verdicts.
8. Verify integrated work; route failed formal gates to their owners and require appropriate re-verification. Update materially changed state and existing plans; continue until completion, a strict blocker, or an actual required owner decision.

## First post-Build action

A pre-Build launch plan includes this conditional gate:

```text
Run or refresh read-only preflight if unrun or installation state changed.
If MATERIALIZATION_REQUIRED (or explicit installation/repair is in scope):

bash .cursor/scripts/bootstrap.sh

Require success before dependent changes. If READY, skip bootstrap and begin
the first approved task. Resolve BLOCKED without bypassing policy.
```

Build authorizes the reviewed local work. Production deploys, publication, spend, secret access, remote database mutation, destructive actions, and risk acceptance remain subject to explicit scope and existing policy. Roles and prompts grant no additional authority.

## Outputs and closure

Create only the outputs required by the selected scope:

- comprehensive strategy: `docs/blueprints/YYYY-MM-DD_<project_slug>.md`;
- phased delivery: `docs/plans/phase_0_foundations_plan.md`, just-in-time later plans, final implementation checklist;
- formal role delivery: `docs/workstreams/<task-id>/manifest.md`, activated role charter/plan/evidence/handoff, and `delivery/owner-handoff.md`;
- resumable state: `.cursor/STATE.md` and concise relevant memory, blocker, continuation, decision, or runbook updates;
- bounded supporting work: findings or changed paths, checks, assumptions, and limitations in the task result.

Before closure apply the relevant criteria in `.cursor/instructions/LAUNCH.md` and, only when formal roles are active, `.cursor/instructions/ROLES.md`. Missing evidence is not a pass; owner acceptance is never inferred from silence.

## Validation

For control-plane changes, run relevant checks using an execution-capable mode:

```bash
node .cursor/skills/launch-pipeline/scripts/preflight.mjs
node --test .cursor/skills/launch-pipeline/scripts/preflight.test.mjs
node --test .cursor/skills/launch-pipeline/scripts/configuration.test.mjs
node .cursor/scripts/validate-agent-config.mjs
node .cursor/skills/launch-pipeline/scripts/validate-launch.mjs
```

Bootstrap is an authorized materialization operation, not a routine read-only validation command. Retain native runtime JSON at `.cursor/` root; do not move it into `config/` or weaken hooks, permissions, sandboxing, CI, or provider policy.

## Related files

- `../../README.md`
- `../../AGENTS.md`
- `../../BOOTSTRAP.md`
- `../../INSTRUCTIONS.md`
- `../../instructions/LAUNCH.md`
- `../../instructions/ROLES.md`
- `../../STATE.md`

## Example invocation

```text
/launch-pipeline
Idea or task: <requested outcome>
Target user/problem: <known context>
Constraints/references: <constraints and attachments>
Existing authorization: <scope already approved, if any>
```
