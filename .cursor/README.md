# Agent Instructions

A portable, agent-agnostic control plane for coding agents. This directory is the distributable tree: copy it into a repository as `.cursor/`.

Other clients need their own native adapter (for example a small `CLAUDE.md` for Claude Code or an `AGENTS.md` hierarchy for Codex). Renaming this folder does not make `.mdc` rules, hooks, or permission files native elsewhere.

## Quick start

### 1. Copy into your project

```text
your-project/
  .cursor/          ← this directory
  src/
  package.json
```

### 2. Keep the folder as `.cursor`

Cursor discovers `.cursor/rules/*.mdc`, `.cursor/skills/*/SKILL.md`, `.cursor/agents/*.md`, `.cursor/hooks.json`, and the repository-root `AGENTS.md` natively. Three rules are always-on (`00-core-routing`, `git-privacy-and-secrets`, `karpathy-guidelines`); the planning, sub-agent, blocker, memory, and runbook rules are Agent-Requested and load by description only when relevant.

### 3. Bootstrap the workspace

From the project root:

```bash
node .cursor/skills/launch-pipeline/scripts/preflight.mjs
bash .cursor/scripts/bootstrap.sh
```

Preflight is read-only. Run bootstrap when materialization/repair is needed and implementation is authorized. It seeds missing root instructions, ignore rules, documentation indexes, governance workflow, and Git hooks. It resolves the effective Git hooks path, preserves differing existing hooks, and reports integration required rather than overwriting them.

Copy `.cursor/` into new projects without replacing a consumer's existing preferences, state, memory, custom rules, or hooks. When updating an installed copy, preserve `STATE.md`, `USER.md`, `memory/`, `config/settings.json`, and any `.cursor/PROJECT.md` overlay.

### 4. Start your agent

Cursor loads the repository-root `AGENTS.md` and the always-on rules automatically. The agent reads this directory's `AGENTS.md` once per session, checks `STATE.md`, and reuses what is already in context instead of re-reading control files every turn.

For a raw idea, major change, active-workstream resume, remediation, or closure, invoke:

```text
/launch-pipeline
```

The explicit-only native skill at `skills/launch-pipeline/SKILL.md` routes to `instructions/LAUNCH.md`. After Build or explicit Agent-mode implementation authorization, `scripts/bootstrap.sh` is the first mutating gate.

## What you get

```text
AGENTS.md              # Canonical operating contract — start here
BOOTSTRAP.md           # Session startup / materialization
INSTRUCTIONS.md        # Routes to detailed task modes
USER.md                # Durable preferences (edit this)
STATE.md               # Live objective, phase, plan, blockers
PROJECT.md             # Optional project overlay (local rules, tools, history)
SKILLS.md + skills/    # Repeatable procedures (Vercel, Supabase, git safety, launch)
TOOLS.md               # Capability registry
instructions/          # Project planning, strategy, sub-agents, roles, launch
memory/                # Durable memory, blockers, runbooks, continuations
rules/                 # 3 always-on, 5 Agent-Requested
scripts/bootstrap.sh   # Idempotent workspace materialization
templates/             # Root AGENTS.md, .cursorignore, docs, plan and role templates
config/settings.json   # Optional host-specific settings
```

After bootstrap, the host repo also gets:

```text
AGENTS.md                # Native compact core and routing index (seeded once)
.cursorignore
.githooks/               # git-safety identity and secret checks
.github/workflows/agent-governance.yml
docs/
  plans/
  blueprints/
  decisions/
  handover/
  workstreams/
```

## Core control files

- `AGENTS.md` — detailed operating contract and precedence.
- `BOOTSTRAP.md` — startup/materialization contract.
- `INSTRUCTIONS.md` — detailed instruction registry and activation protocol.
- `USER.md` — durable owner preferences.
- `STATE.md` — current resumable status, plan, workstream, role, and gate.
- `SKILLS.md` — reusable workflow registry.
- `TOOLS.md` — available capability and integration registry.

## Linked workflow directories

- `instructions/` — launch, strategy, planning, subagent, and role contracts.
- `agents/` — native specialist adapters.
- `skills/` — native discoverable and slash-invokable workflows.
- `rules/` — three always-on rules (core routing, git safety, coding discipline) and five Agent-Requested rules loaded by description.
- `memory/` — durable index, continuations, blockers, fixed blockers, and runbooks.
- `templates/` — phase, workstream, role, evidence, handoff, and checklist schemas.
- `scripts/` — bootstrap and configuration validation.
- `hooks/` — deterministic security policy and tests.
- `config/` — configuration map and optional host adapter settings.

## Runtime configuration

These files remain at `.cursor/` root because Cursor discovers them at exact paths:

- `hooks.json`
- `cli.json`
- `sandbox.json`
- `permissions.json`
- `mcp.json` when added

See `config/README.md` for ownership and placement. Do not move native runtime files into `config/` or rely on undocumented symlink behavior.

`settings.json` is a compatibility symlink to `config/settings.json`; it is not a required native project runtime file.

## Loading model

- Cursor automatically loads repository-root `AGENTS.md`.
- `00-core-routing.mdc`, `git-privacy-and-secrets.mdc`, and `karpathy-guidelines.mdc` are `alwaysApply: true` and injected every turn; `project-planning`, `subagent-orchestration`, `blocker-governance`, `memory-governance`, and `runbook-governance` are `alwaysApply: false` with descriptions, so the agent pulls them in only when relevant.
- Instructions already in context are reused; a new message does not trigger a re-read of the core files.
- Cursor discovers `agents/*.md` and `skills/*/SKILL.md`.
- `/launch-pipeline` is explicit-only and does not silently auto-start from ambient requests.
- Files under `instructions/` are loaded through the root router, `INSTRUCTIONS.md`, `STATE.md`, or a native skill such as `/launch-pipeline`.
- If `PROJECT.md` exists, inspect its concise project constraints and route only the references relevant to the current task. Never replace local state, preferences, tools, or memory with template defaults during updates.

Do not open roles as disconnected workflows. Every activated role consumes the workstream manifest, charter, plan, predecessor handoff, core context, and canonical role contract before acting.

## Customize

Edit these files to match the host project:

- `USER.md` — standing directives and platform preferences
- `STATE.md` — reset or resume active work
- `memory/MEMORY.md` — durable decisions and architecture notes
- `PROJECT.md` — local rules, extra skills, runbooks, and other overlay files
- `config/settings.json` — optional editor/host settings

Do not store passwords, tokens, or API keys in any of these files. Git writes must use `Cursor Agent <cursoragent@noreply.github.com>` or a GitHub noreply address; repository `.githooks/` and `skills/git-safety/SKILL.md` block private-email attribution and secret files.

## Included skills

| Skill | Purpose |
|---|---|
| `launch-pipeline` | Start, resume, remediate, or close the complete linked product-delivery pipeline |
| `git-safety` | Force Cursor anonymous git identity and block secrets from git |
| `vercel-deploy-workflow` | Deploy Next.js to Vercel via Git or CLI |
| `supabase-linked-migrations` | Ship SQL migrations to a linked Supabase project |

Add your own under `skills/<skill-id>/SKILL.md` and register them in `SKILLS.md`.

## Validation

```bash
node .cursor/skills/launch-pipeline/scripts/preflight.mjs
node --test .cursor/skills/launch-pipeline/scripts/preflight.test.mjs
bash .cursor/scripts/bootstrap.sh
node --test .cursor/hooks/policy.test.mjs
node .cursor/scripts/validate-agent-config.mjs
node .cursor/skills/launch-pipeline/scripts/validate-launch.mjs
```

Launch validation classifies every `.cursor` file as native, routed, indexed, compatibility, generated history, or project-local and fails on orphaned control-plane files.

Production authority, secret access, destructive operations, and external mutation remain controlled by hooks, permissions, sandboxing, CI, provider policy, and explicit owner approval.

## License

MIT — see the repository `LICENSE` file.
