---
plan: phase_10_friendly-science-onboarding
status: verified
created: 2026-08-19
updated: 2026-08-19
owner: lead-agent
source_phase: docs/plans/phase_9_app-identity-journey_plan.md
workstream: docs/workstreams/20260819-friendly-science-onboarding/manifest.md
---

# Phase 10: Friendly science onboarding

## 1. Objective

Make PuffPuffStop feel cartoon-friendly, ground organ scores on a 50-year usage horizon with cited research, add a Science tab, and rewrite onboarding inputs (physical dials, product catalog, currencies, back gestures). Remove the in-app 16+ notice; store rating remains 16+.

## 2. Relation to project end-state

Phases 0–9 delivered the local habit loop. This phase is owner-requested product polish before any store submit.

## 3. Entry criteria

Phases 0–9 verified on `main`. Owner specified visuals, science, and onboarding changes.

## 4. Scope

- Friendlier visual language (pastel, rounded, cartoon organs). VapeFree is a tone reference, not a clone.
- Animated organ characters that decay or heal with score.
- 50-year lifetime organ model; few years of vaping stay high.
- Science tab with peer-reviewed links.
- Remove in-app age-gate screen.
- Physical rotary dials with exponential ticks and tap-to-type (999 / 999,999).
- Product-level vape catalog with manufacturer-claimed puffs and confirmed nicotine only.
- Frequency copy: singular periods, “a”, “puff/s”.
- All-currency picker. Back arrow plus edge swipe on onboarding.
- New trigger and quit-window options.

## 5. Non-goals

Store submit, ads, remote DB, cloning VapeFree’s pet or screenshots, inventing nicotine strengths.

## 6. Assumptions

- Default currency AUD (AU bundle).
- Organ percents stay motivational estimates, not diagnoses.
- Catalog puff counts are manufacturer “up to” claims.

## 7. Validation

`npm run lint`, `npm test`, `npm run typecheck`.

## 8. Next plan

Only after this phase is verified. Do not invent phase 11 unless the owner asks.
