import test from "node:test";
import assert from "node:assert/strict";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync, chmodSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { collectPreflight } from "./preflight.mjs";

const source = resolve(dirname(fileURLToPath(import.meta.url)), "../../../..");
function run(root, command, args) {
  return spawnSync(command, args, { cwd: root, encoding: "utf8", timeout: 30000 });
}
function expectPass(result) {
  assert.equal(result.status, 0, `${result.error ?? ""}\n${result.stdout}\n${result.stderr}`);
}
function populate(root) {
  mkdirSync(root, { recursive: true });
  cpSync(join(source, ".cursor"), join(root, ".cursor"), { recursive: true, verbatimSymlinks: true });
}
function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), "context-config-test-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  populate(root);
  return root;
}
function bootstrap(root) { return run(root, "sh", [".cursor/scripts/bootstrap.sh"]); }
function validate(root, file = ".cursor/scripts/validate-agent-config.mjs") { return run(root, process.execPath, [file]); }
function hashTree(root) {
  const result = {};
  function visit(dir) {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      if (e.name === ".git" || e.name === ".DS_Store") continue;
      const p = join(dir, e.name);
      if (e.isDirectory()) visit(p);
      else if (e.isFile()) result[p.slice(root.length)] = createHash("sha256").update(readFileSync(p)).digest("hex");
    }
  }
  visit(root);
  return result;
}

test("fresh source is materializable; bootstrap becomes ready and is idempotent", (t) => {
  const root = fixture(t);
  assert.equal(collectPreflight(root).status, "MATERIALIZATION_REQUIRED");
  expectPass(bootstrap(root));
  assert.equal(collectPreflight(root).status, "READY");
  const before = hashTree(root);
  expectPass(bootstrap(root));
  assert.deepEqual(hashTree(root), before);
});

test("missing input fails before creating installation outputs", (t) => {
  const root = fixture(t);
  rmSync(join(root, ".cursor/templates/root-agents.md"));
  assert.equal(collectPreflight(root).status, "BLOCKED");
  assert.notEqual(bootstrap(root).status, 0);
  assert.equal(existsSync(join(root, "docs")), false);
  assert.equal(existsSync(join(root, "AGENTS.md")), false);
});

test("empty existing root instructions block instead of being overwritten", (t) => {
  const root = fixture(t);
  writeFileSync(join(root, "AGENTS.md"), "");
  assert.equal(collectPreflight(root).status, "BLOCKED");
  assert.notEqual(bootstrap(root).status, 0);
  assert.equal(readFileSync(join(root, "AGENTS.md"), "utf8"), "");
});

test("existing custom Git hook survives and reports integration required", (t) => {
  const root = fixture(t);
  expectPass(run(root, "git", ["init", "-q"]));
  const hook = join(root, ".git/hooks/pre-commit");
  const body = "#!/bin/sh\n# consumer-owned hook\nexit 0\n";
  writeFileSync(hook, body); chmodSync(hook, 0o755);
  const result = bootstrap(root);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /integration required/);
  assert.equal(readFileSync(hook, "utf8"), body);
});

test("bootstrap resolves configured core.hooksPath", (t) => {
  const root = fixture(t);
  expectPass(run(root, "git", ["init", "-q"]));
  expectPass(run(root, "git", ["config", "--local", "core.hooksPath", ".custom-hooks"]));
  expectPass(bootstrap(root));
  assert.equal(readFileSync(join(root, ".custom-hooks/pre-commit"), "utf8"), readFileSync(join(root, ".githooks/pre-commit"), "utf8"));
  assert.equal(existsSync(join(root, ".git/hooks/pre-commit")), false);
});

test("bootstrap resolves linked-worktree Git hooks", (t) => {
  const base = mkdtempSync(join(tmpdir(), "context-worktree-test-"));
  t.after(() => rmSync(base, { recursive: true, force: true }));
  const main = join(base, "main"); mkdirSync(main);
  expectPass(run(main, "git", ["init", "-q"]));
  expectPass(run(main, "git", ["-c", "user.name=Cursor Agent", "-c", "user.email=cursoragent@noreply.github.com", "commit", "--allow-empty", "-qm", "fixture"]));
  const worktree = join(base, "worktree");
  expectPass(run(main, "git", ["worktree", "add", "--detach", worktree]));
  populate(worktree);
  expectPass(bootstrap(worktree));
  const hooks = run(worktree, "git", ["rev-parse", "--path-format=absolute", "--git-path", "hooks"]);
  expectPass(hooks);
  assert.equal(readFileSync(join(hooks.stdout.trim(), "pre-commit"), "utf8"), readFileSync(join(worktree, ".githooks/pre-commit"), "utf8"));
});

test("native commands/MCP and local runbooks pass; orphaned managed files fail", (t) => {
  const root = fixture(t); expectPass(bootstrap(root));
  mkdirSync(join(root, ".cursor/commands/checks"), { recursive: true });
  writeFileSync(join(root, ".cursor/commands/checks/test.md"), "Run this repository's documented checks.\n");
  writeFileSync(join(root, ".cursor/mcp.json"), '{"mcpServers":{}}\n');
  writeFileSync(join(root, ".cursor/memory/runbooks/local.md"), "# Local procedure\n");
  const result = validate(root, ".cursor/skills/launch-pipeline/scripts/validate-launch.mjs");
  expectPass(result); assert.match(result.stderr, /warning.*local\.md/);
  writeFileSync(join(root, ".cursor/unrouted.md"), "# Orphan\n");
  assert.notEqual(validate(root, ".cursor/skills/launch-pipeline/scripts/validate-launch.mjs").status, 0);
});

test("payload drift is rejected", (t) => {
  const root = fixture(t); expectPass(bootstrap(root));
  const p = join(root, ".cursor/skills/git-safety/payloads/bootstrap.sh");
  writeFileSync(p, readFileSync(p, "utf8") + "\n# stale copy\n");
  const result = validate(root);
  assert.notEqual(result.status, 0); assert.match(result.stderr, /has drifted/);
});

test("project extensions need explicit project-index links", (t) => {
  const root = fixture(t); expectPass(bootstrap(root));
  writeFileSync(join(root, ".cursor/local-context.md"), "# Project facts\n");
  assert.notEqual(validate(root, ".cursor/skills/launch-pipeline/scripts/validate-launch.mjs").status, 0);
  writeFileSync(join(root, ".cursor/PROJECT.md"), "# Project routes\n[Local context](local-context.md)\n");
  expectPass(validate(root, ".cursor/skills/launch-pipeline/scripts/validate-launch.mjs"));
});

test("old user-preference loading mandates are rejected", (t) => {
  const root = fixture(t); expectPass(bootstrap(root));
  const user = join(root, ".cursor/USER.md");
  writeFileSync(user, readFileSync(user, "utf8") + "\nRead every file under the control directory.\n");
  assert.notEqual(validate(root).status, 0);
});

test("required always-on rules and eager-read regression are checked", (t) => {
  const root = fixture(t); expectPass(bootstrap(root));
  const rule = join(root, ".cursor/rules/karpathy-guidelines.mdc");
  const original = readFileSync(rule, "utf8");
  writeFileSync(rule, original.replace("alwaysApply: true", "alwaysApply: false"));
  assert.notEqual(validate(root).status, 0);
  writeFileSync(rule, original);
  const contract = join(root, ".cursor/instructions/SUBAGENTS.md");
  writeFileSync(contract, readFileSync(contract, "utf8") + "\nRead every file under the control directory.\n");
  assert.notEqual(validate(root).status, 0);
});
