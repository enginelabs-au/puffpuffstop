# Project agent router

This file applies project-wide. On every substantive turn, read `.cursor/AGENTS.md` first and follow its complete per-turn context, precedence, autonomy, validation, state, and memory contract.

## Path convention

All paths in this file are repository-relative. Control-plane paths are always written explicitly with the `.cursor/` prefix. A leading `/` inside a `.cursor/` control file follows the configuration-root convention defined by `.cursor/AGENTS.md`; it is not a repository-root path.

## Lightweight routing

Before substantive planning, delegation, implementation, review, or release:

1. Classify the task briefly by work type, reversibility, product/release impact, production impact, data/privacy exposure, and affected domains.
2. Assign the safest proportionate risk tier and identify the evidence needed for completion.
3. Load `.cursor/instructions/ROLES.md` only when role selection, delegation, a predecessor handoff, a security/quality gate, multi-domain reconciliation, or a release stage gate is relevant.
4. For a raw idea, major change, resume, remediation, or closure, invoke `/launch-pipeline` and follow `.cursor/instructions/LAUCH.md`.

For role-governed work:

- create or resume `docs/workstreams/<task-id>/manifest.md`;
- record every required role and every skipped role with an evidence-based reason, plus dependency order and the current gate;
- give each activated role a bounded charter, exact allowed paths, explicit non-goals, and any predecessor handoff;
- require the canonical evidence-backed handoff and verdict before downstream work begins;
- route a failed security or acceptance gate back to the owning role, remediate, and repeat the independent gate; unresolved blocking findings do not advance;
- require Project Lead reconciliation and a final owner handoff, with explicit owner approval before consequential release or production action.

Role names and prompts do not grant authority. Secrets, production access, destructive actions, policy changes, and waivers remain subject to permissions, hooks, CI, provider controls, and explicit owner approval.
