---
schema_version: 1
task_id: 20261011-mobile-store-release
title: iOS and Android store release preparation
status: owner-gated
risk_tier: 3
owner: user-operator
active_role: orchestrating-lead
current_gate: owner-release-setup
---

# Mobile store release preparation

## Objective

Prepare the existing Expo app for reproducible iOS and Android store builds, close native build blockers, verify the release artifact paths, and document the owner-only account and credential steps. Store submission remains outside this task.

## Scope and non-goals

In scope: dependency compatibility, Android/iOS native build configuration, release validation, EAS configuration guidance, and future-update automation.

Non-goals: App Store Connect or Play Console submission, publishing a privacy URL, creating store accounts, accepting legal claims, entering credentials, production database changes, or enabling paid distribution.

## Role routing

| Role | Status | Reason |
|---|---|---|
| product-manager-subagent | skipped | Product scope and store positioning are already locked in the existing MVP workstream; this task changes packaging, not behavior. |
| ui-ux-developer-subagent | skipped | No intentional layout or interaction change; native build validation only. |
| software-engineer-subagent | required | Dependency, native configuration, build, test, and CI changes. |
| security-engineer-subagent | required | Store release exposes health permissions, local health-adjacent data, signing, secrets, and CI credential handling. |
| growth-marketing-subagent | skipped | No new positioning, acquisition, or campaign work; existing listing drafts are reused. |
| project-lead-subagent | required | Release-readiness reconciliation and owner handoff. |

## Ownership

| Path/system | Writer | Reviewers | Allowed operation |
|---|---|---|---|
| `package.json`, `package-lock.json`, `app.json`, plugins, native build configuration | orchestrating lead | software engineer, security engineer | compatibility and build fixes |
| `docs/plans/phase_13_release-prep_plan.md` | orchestrating lead | project lead | plan and evidence |
| `docs/workstreams/20261011-mobile-store-release/` | orchestrating lead | required roles | task artifacts and gates |
| `.github/workflows/mobile-release.yml` | orchestrating lead | security engineer, project lead | manual, non-submitting future automation |
| Apple Developer, Google Play, EAS, store consoles | owner/CI only | none | no mutation by agent |

## Gates

1. Local unit, type, lint, and dependency compatibility checks pass.
2. Android release AAB builds without signing credentials; signing remains owner/EAS-controlled.
3. iOS release archive or equivalent native build is verified.
4. Security review has no unresolved release-blocking finding.
5. Project-lead reconciliation identifies remaining owner-only actions.

## Owner-only boundary

The agent may prepare artifacts and workflows but must not submit builds, publish listings, create store accounts, create signing keys, or store credentials in the repository.

## Completion evidence

- `npm test`: 142/142 pass.
- `npm run typecheck`: pass.
- `npm run lint`: pass.
- `npx expo-doctor`: 21/21 checks pass.
- `npx expo install --check`: clean.
- Android Release AAB generated locally at `android/app/build/outputs/bundle/release/app-release.aab`; local debug signing only.
- iOS Release archive generated at `/tmp/PuffPuffStop.xcarchive` with signing disabled.
- `.github/workflows/mobile-release.yml` is manual, build-first, and submission-gated by an explicit owner input plus the protected `store-release` environment.

The app is a release candidate, not a submitted store build. EAS project identity, distribution signing, store accounts, privacy hosting, legal acceptance, and final device smoke tests remain owner-controlled.
