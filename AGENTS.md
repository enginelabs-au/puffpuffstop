# AGENTS.md

Native project-wide instructions for this repository. Paths in this file are repository-relative. A leading `/` inside a `.cursor/` control file is relative to `.cursor/`, not to the filesystem root.

## Core constraints

- Git writes use `Cursor Agent <cursoragent@noreply.github.com>` or a GitHub noreply address. Never change git identity with `git config`; never use `--no-verify`.
- Never read, stage, commit, print, or store secrets, credentials, `.env*` (except `.env.example`), private keys, or credential JSON.
- Production deploys, remote database mutation, destructive git, protected control-plane edits, and state-changing MCP tools stay owner/CI-controlled. A hook denial is final: stop, do not work around it.
- Work within the task scope, inspect existing patterns first, make surgical changes, validate with the strongest available checks, and report what remains unverified.
- Operate autonomously; ask only for missing credentials or permissions, consequential decisions with no defensible default, destructive work beyond scope, or safety/privacy concerns.

## Loading policy

- Lead session start: read `.cursor/AGENTS.md` once and check `.cursor/STATE.md` for active work. Run `node .cursor/skills/launch-pipeline/scripts/preflight.mjs` when the host mode permits execution. If Ask Mode has no execution tool, mark preflight unrun and defer it; do not bypass the mode.
- Bootstrap only for required materialization or explicit installation/repair after implementation authorization; `READY` does not require another bootstrap.
- Later turns: reuse what is already in context. Re-read a control file only when it changed, after context loss or compaction, or when a new scope becomes relevant.
- An ordinary bounded change needs no workstream, role pipeline, or phase plan.
- Bounded delegates use the assigned task packet and applicable native instructions. They do not repeat lead startup, shared-state/history reads, or unrelated lifecycle instructions; request missing task evidence within scope.

## Routing index

If `.cursor/PROJECT.md` exists, inspect its concise project constraints and route only the references relevant to this task. Preserve local preferences, state, tooling, and history during shared-template updates.

| Need | Read |
|---|---|
| Detailed contract, precedence, autonomy limits, completion standard | `.cursor/AGENTS.md` |
| Which detailed mode applies (planning, strategy, sub-agents, roles) | `.cursor/INSTRUCTIONS.md` registry |
| Natural-language planning or strategy | `.cursor/INSTRUCTIONS.md` → the matched planning/strategy instruction; no implicit launch |
| User explicitly invokes `/launch-pipeline` or requests that named lifecycle | `.cursor/instructions/LAUNCH.md` |
| Bounded delegation or independent review | `.cursor/instructions/SUBAGENTS.md`; task packet, no mandatory workstream |
| Formal multi-role delivery or consequential stage gates | `.cursor/instructions/ROLES.md` (sections 1–3 plus relevant role sections) |
| Repeatable procedures such as deploys, migrations, git safety | `.cursor/SKILLS.md` → `.cursor/skills/<skill-id>/SKILL.md` |
| Choosing deployment, database, or integration tooling | `.cursor/TOOLS.md` |
| Prior decisions, exact runbooks, unresolved blockers | `.cursor/memory/MEMORY.md` and the files it links |
| Task artifacts | `docs/plans/`, `docs/workstreams/<task-id>/` |

Role names and prompts do not grant authority. Hooks, permissions, sandboxing, CI, and explicit owner approval govern sensitive actions.
