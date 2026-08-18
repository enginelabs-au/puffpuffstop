# Phase 4 security review (persistence)

Reviewed: local JSON snapshot persist, age-gate delete path, privacy copy, sync stub, no remote mutation.

## Controls verified

- Snapshot version is rejected when foreign or incomplete.
- Under-16 age-gate calls `deleteLocalData()` and persists an empty snapshot.
- 16+ resume does not rewrite a completed plan; it only routes to home.
- Sync status never opens a network client. Env URL presence does not connect.
- No card, ads, secrets, or remote `db push` added.
- Privacy copy restates 16+, not a kids app, not a medical device, local-only storage.

## New residual

- SEC-P4-001 — local snapshot is not encrypted at rest. Device unlock is the control. Owner must accept before store submit.

## Inherited residuals

- SEC-P0-001 — client age attestation remains bypassable by tapping 16+.
- SEC-P0-002 — Expo/Metro `image-size` toolchain advisories. Not force-fixed.

## Verdict

`CONDITIONAL` — local store-ready hardening may close. Production, store submit, ads, secrets, and remote DB remain unauthorized.
