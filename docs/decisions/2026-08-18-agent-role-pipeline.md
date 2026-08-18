# Decision: Adaptive Agent Role Pipeline

## Status

Accepted on 2026-08-18.

## Context

The repository had a detailed `.cursor/` control plane but no native root `AGENTS.md`, no native custom agents, no canonical role catalog, no task-local role handoff model, and no deterministic security controls. A documentation-only or mandatory six-role sequence would either be non-native or impose unnecessary coordination on narrow work.

## Decision

- Use a concise repository-root `AGENTS.md` as the native entry point and keep detailed operating context in `.cursor/`.
- Use `.cursor/instructions/ROLES.md` as the canonical role and stage-gate contract, with thin `.cursor/agents/*.md` adapters.
- Select roles adaptively by task impact and risk. Record every required and skipped role in `docs/workstreams/<task-id>/manifest.md`.
- Require each activated role to complete a task-specific charter and exhaustive plan before action, then produce an evidence-backed handoff.
- Keep non-implementation specialists read-only; `software-engineer-subagent` is the only writable specialist. The lead materializes read-only outputs.
- Return blocking findings to the owning role and require independent security re-verification.
- Use deterministic fail-closed hooks and local permissions as defense in depth. Role identity is never production authorization.
- Reserve production mutations and write-capable credentials for owner-controlled or reviewed CI workflows.

## Consequences

- Narrow work can skip irrelevant roles without silently dropping requirements.
- Consequential releases have explicit traceability, remediation loops, security evidence, and owner handoff.
- Repository policy improves agent resistance but remains changeable by accountable humans and administrators; protected branches, required review, scoped credentials, and organization/provider controls remain necessary.
- Protected governance maintenance requires the documented human break-glass workflow.

## Rejected alternatives

- A strict six-role chain for every task: excessive latency and context overhead for narrow changes.
- `ROLES.md` without native adapters: not a native Cursor role registry.
- Prompt-only security: advisory and not a hard boundary.
- Role artifacts inside application source: mixes delivery process with runtime code.
