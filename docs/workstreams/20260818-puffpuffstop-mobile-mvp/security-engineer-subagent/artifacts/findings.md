# Security findings

## SEC-P0-001 — Client-only age gate

- Severity: medium (residual, expected)
- Likelihood: high that a determined under-16 user can tap 16+
- Impact: they would see only the phase-0 placeholder, not a tracker (no logs exist yet)
- Evidence: `app/age-gate.tsx` navigates locally; no server check
- Exploit scenario: tap “Yes, I’m 16+”
- Remediation: keep no persistence until after allow; later add store rating 16+, optional account age, never add under-16 mode
- Verification: code review + future persistence tests that blocked path writes nothing
- Owner: software-engineer-subagent
- Due: phase 4 hardening / first persistence
- Status: open residual, accepted for phase 0 local foundation

## SEC-P0-002 — Expo toolchain npm high (image-size DoS)

- Severity: medium after independent review (npm labels “high”)
- Advisory: GHSA-w3rx-r6r6-pgpr, GHSA-5p2g-fcmc-qvqq — `image-size` <=2.0.2 infinite loops in ICNS/JXL/HEIF parsers
- Evidence: `npm audit` 14 high / 8 moderate / 0 critical, all via Expo/Metro/RN CLI
- Exploit scenario: a developer or CI Metro process parses a crafted image; not a shipped client tracker endpoint
- Remediation: do not `npm audit fix --force`; refresh Expo when upstream patches Metro
- Owner: software-engineer-subagent
- Due: phase 4 dependency refresh
- Status: open residual

## SEC-P0-003 — No RLS because no tables

- Severity: informational / not applicable
- Evidence: `supabase/migrations/20260818120000_baseline.sql` is `SELECT 1`
- Status: closed as N/A until first real schema
