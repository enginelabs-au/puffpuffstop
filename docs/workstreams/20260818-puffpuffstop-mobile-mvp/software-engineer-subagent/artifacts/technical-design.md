# Phase 0 technical design

## Stack

- Expo (SDK from official template) + TypeScript + Expo Router
- Unit tests via Jest
- ESLint with Expo config if available, otherwise typescript-eslint
- No SQLite schema yet (reserved)
- Supabase folder only

## Modules

| Module | Responsibility |
|---|---|
| `src/domain/age-gate.ts` | `evaluateAgeGate(isSixteenOrOlder)` → `{ status, trackingAllowed }` |
| `src/domain/estimation.ts` | `daysIn`, `puffsPerDay`, `historyDays`, `commitmentPuffs` |
| `src/data/brands.ts` | `BrandRow` type + empty `BRAND_CATALOG` |
| `src/theme/tokens.ts` | UX token map |
| `app/_layout.tsx` | root providers / stack |
| `app/index.tsx` | redirects to `/age-gate` |
| `app/age-gate.tsx` | stub UI |
| `app/blocked.tsx` | under-16 hard stop |
| `app/foundation.tsx` | post-allow placeholder |

## Data

No persistence in phase 0. Age-gate decision is in-memory navigation only. This is intentional and must be called out to Security.

## Supabase

`supabase/migrations/20260818120000_baseline.sql` is a no-op documented baseline so later CLI timestamps have a history root. `config.toml` is a minimal project stub. Do not link or push.

## Env

`.env.example` lists names from the phase-0 registry. App reads only `EXPO_PUBLIC_APP_ENV` if present, defaulting to `local`.
