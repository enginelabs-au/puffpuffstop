# Security findings

## SEC-P0-001 — Client-only age gate

- Severity: medium (residual, expected)
- Likelihood: high that a determined under-16 user can tap 16+
- Impact: a determined under-16 user can still enter the local coach by tapping 16+
- Evidence: `app/age-gate.tsx` navigates locally; no server check
- Exploit scenario: tap “Yes, I’m 16+”
- Remediation: store rating 16+, never add under-16 mode; blocked path now deletes and persists empty local data
- Verification: `privacy.test.ts` persists an empty snapshot after delete; age-gate under-16 calls `deleteLocalData()`
- Owner: software-engineer-subagent
- Due: store submit / first account age check
- Status: open residual; blocked-path writes are cleared, attestation is still client-only

## SEC-P0-002 — Expo toolchain npm high (image-size DoS)

- Severity: medium after independent review (npm labels “high”)
- Advisory: GHSA-w3rx-r6r6-pgpr, GHSA-5p2g-fcmc-qvqq — `image-size` <=2.0.2 infinite loops in ICNS/JXL/HEIF parsers
- Evidence: `npm audit` 10 high / 8 moderate / 0 critical after Expo FileSystem install, all via Expo/Metro/RN CLI
- Exploit scenario: a developer or CI Metro process parses a crafted image; not a shipped client tracker endpoint
- Remediation: do not `npm audit fix --force`; refresh Expo when upstream patches Metro
- Owner: software-engineer-subagent
- Due: phase 4 dependency refresh
- Status: open residual

## SEC-P0-003 — No RLS because no tables

- Severity: informational / not applicable
- Evidence: `supabase/migrations/20260818120000_baseline.sql` is `SELECT 1`
- Status: closed as N/A until first real schema

## SEC-P4-001 — Local snapshot is unencrypted at rest

- Severity: medium (residual, expected for on-device JSON)
- Likelihood: requires device unlock or filesystem access
- Impact: nickname, plan answers, puff log, settings, and estimated savings can be read from the snapshot file
- Evidence: `src/data/persist.ts` writes a versioned JSON snapshot via a file driver when `expo-file-system` has a document directory
- Remediation: accept OS device lock; optional later SQLCipher/Keychain. Do not sync until RLS and auth exist
- Verification: snapshot parser rejects foreign versions; delete persists empty state
- Owner: software-engineer-subagent / owner
- Due: store submit
- Status: open residual, not waived
