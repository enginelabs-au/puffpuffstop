# Agent Governance Operator Setup

Repository controls provide a fail-closed local baseline. They do not make a repository writer, machine administrator, Cursor organization administrator, or provider administrator incapable of changing policy. Complete the external controls below before treating the pipeline as production-enforced.

## Repository baseline

- Trust the workspace only after reviewing `AGENTS.md`, `.cursor/hooks.json`, `.cursor/hooks/policy.mjs`, `.cursor/cli.json`, `.cursor/sandbox.json`, and `.cursor/permissions.json`.
- Keep Node available on `PATH`; policy hooks fail closed when their command cannot run.
- Run:

  ```bash
  node --test .cursor/hooks/policy.test.mjs
  node .cursor/scripts/validate-agent-config.mjs
  bash .cursor/scripts/bootstrap.sh
  ```

- Do not grant a role production authority based on its name, prompt, model, task text, or workstream verdict.

## GitHub controls

Configure the default branch to:

- require pull requests and at least one accountable owner/security review for protected governance files;
- require the `Agent governance / validate` check and future application test/security checks;
- dismiss stale approvals after protected files change;
- block force pushes and branch deletion;
- restrict direct pushes and administrative bypasses as tightly as operations permit.

Add a real user or organization team to `.github/CODEOWNERS` when the accountable reviewer identity is known. Protect at minimum:

```text
/AGENTS.md
/.cursor/
/.cursorignore
/.github/workflows/agent-governance.yml
```

Do not commit a placeholder or invalid code owner.

## Cursor organization controls

Where the account tier supports them:

- distribute equivalent fail-closed hooks at team or enterprise priority;
- enforce sandbox and network policy;
- allowlist approved MCP servers and read-only tools;
- deny state-changing MCP tools for ordinary agents;
- require reviewed plugins rather than trusting plugin presence as enforcement;
- restrict Cloud Agent egress and protected Git scopes;
- keep write-capable production integrations out of general agent sessions.

Project hooks require a trusted workspace and may not run in every early Cloud Agent exploration path. Organization policy must cover those gaps.

The shell policy is intentionally conservative and pattern-based. Unusual inline commands that both reference protected paths and contain shell-like redirection syntax may be blocked even when intended for inspection; prefer the audited bootstrap, validator, and policy-test commands. Conversely, no command-text filter can reliably understand every wrapper, alias, encoded command, or script body, so credential separation and external enforcement remain mandatory.

## Provider and credential controls

- Give normal agents no production credentials, or only read-only, least-privilege, short-lived credentials.
- Store production tokens only in controlled CI/provider secret stores; prefer OIDC and scoped service roles.
- Require reviewed merges for production deployment.
- Configure Vercel production deployment restrictions and separate preview from production access.
- Separate Supabase read-only/preview access from migration credentials; execute remote schema changes through reviewed CI or an owner-controlled workflow.
- Apply equivalent controls to analytics warehouses, email, payments, DNS, OAuth, cloud infrastructure, and other stateful providers.

## Break-glass maintenance

Agents are intentionally blocked from modifying protected governance and enforcement files after installation.

1. An accountable human opens a reviewed maintenance branch outside the agent tool path.
2. The human makes the smallest policy change and documents why.
3. Run policy tests, config validation, bootstrap twice, and application checks.
4. Obtain the protected-file review and merge through the normal branch policy.
5. Revoke temporary access and record any residual risk.

Never disable hooks or expose production credentials merely to make an agent task convenient.
