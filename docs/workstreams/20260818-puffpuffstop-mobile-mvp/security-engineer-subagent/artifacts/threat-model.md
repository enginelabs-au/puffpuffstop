# Phase 0 threat model

## Assets

- Age-gate decision (local)
- Future profile / puff logs / savings ledger (not persisted yet)
- Env names reserved for later Supabase keys
- Store reputation (16+ / not kids / not medical)

## Actors

- Intended 16+ user
- Under-16 user or someone tapping “16+” falsely
- Local filesystem attacker on a shared device
- Later: synced-account attacker (out of phase 0)

## Trust boundaries

- Device UI ↔ in-memory navigation (only boundary that exists now)
- Repo ↔ npm registry (install time)
- Future: client ↔ Supabase (not connected)

## Attacker goals

- Bypass age-gate to use the coach while under 16
- Cause tracking of a blocked user
- Introduce secrets or payment surfaces
- Misrepresent organs as clinical diagnosis
- Apply empty/hostile SQL to a hosted DB

## Controls observed

- `evaluateAgeGate(false)` sets `trackingAllowed` and `profileWriteAllowed` false
- Blocked screen has no continue, no fetch, no analytics imports
- `.env.example` names only; `.gitignore` ignores `.env`
- Baseline migration is `SELECT 1`; no remote apply
- No payment, IAP, Bluetooth, or network client calls in `app/` or `src/`

## Residual

- Anyone can tap “Yes, I’m 16+”. This is a client honor-system control, not an identity proof.
- Metro/`image-size` high advisories exist in the Expo toolchain (dev DoS parsers).
