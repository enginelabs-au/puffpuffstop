# SUBAGENTS.md

## Role and activation

Delegate independently useful investigation, implementation, or review while retaining one lead responsible for scope, integration, verification, and the final result. Use delegation when independence or specialist evidence justifies its context, latency, and coordination cost. Do not create a workstream merely because a subagent is available.

## Bounded delegation — default

A task packet is sufficient for ordinary mapping, research, implementation, test design, or independent review. Include:

- objective, non-goals, and acceptance criteria;
- exact repository/worktree and allowed read/write paths, or `read-only`;
- applicable constraints, relevant source references and revision when useful;
- existing decisions and evidence the worker must verify;
- expected output, checks, limitations, and stop/escalation conditions;
- ownership boundaries and the lead responsible for integration.

Supply only context needed for the assignment. Reuse applicable instructions already delivered by the host or parent; do not require a delegate to read every control file or run lead-session preflight/bootstrap. Shared `STATE.md`, history, `/INSTRUCTIONS.md`, `/instructions/LAUNCH.md`, and `/instructions/ROLES.md` are not mandatory inputs for a bounded packet. Read a specific missing instruction or source only when its relevance requires it. Never assume unseen evidence has been verified.

A bounded brief can serve as the charter and concise plan. Return findings or changed paths, validation evidence, assumptions, and unresolved items to the lead. No six-role matrix, persistent role directory, owner handoff document, or exhaustive plan is required. Domain safety constraints still apply, and a material security or release gate must not be disguised as a low-risk bounded task.

## Formal role pipeline — conditional

Load `/instructions/ROLES.md` when the user requests a formal role pipeline, material multi-role handoffs need coordination, or consequential security/release gates apply. `/instructions/LAUNCH.md` participates only when its named lifecycle was explicitly invoked.

The six stable formal role IDs are:

- `product-manager-subagent`
- `ui-ux-developer-subagent`
- `software-engineer-subagent`
- `security-engineer-subagent`
- `growth-marketing-subagent`
- `project-lead-subagent`

For formal assignments, add task/workstream ID, risk tier, manifest, charter, role plan, relevant predecessor handoffs, assigned role-contract sections, gate criteria, and downstream owner to the task packet. Load the common formal contract and only the assigned role body. Preserve its required/skipped-role records, charter/plan/evidence/handoff artifacts, supported verdicts, and remediation rules. Reading domain guidance or invoking a narrow specialist alone does not activate every formal artifact.

## Ownership and handoff

Use disjoint write paths or separate worktrees, read-only reports, and a single integration owner. A worktree does not isolate databases, ports, credentials, or external state. Subagents must not edit shared state, memory, plans, blockers, or manifests without explicit sole ownership. Read-only workers return content for the lead to materialize when persistence is useful.

Within a formal pipeline, respect predecessor evidence and dependency order. `BLOCKED` returns to the owning role; a downstream `CONDITIONAL` is permissible only under the canonical contract. Materialize formal evidence before advancing its gate. Ordinary bounded reports can remain in the task result.

## Lead integration and closure

Inspect each finding and diff, reject unsupported conclusions, resolve conflicts, integrate in dependency order, and run relevant checks on the combined result. Update existing plans and materially changed resumable state; for formal work also record gate status and canonical handoffs. Report incomplete verification honestly. Subagent output is evidence, not authority, and delegation never authorizes external actions or policy bypass.
