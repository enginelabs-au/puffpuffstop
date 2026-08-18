---
plan: phase_6_brand-identity
status: verified
created: 2026-08-18
updated: 2026-08-18
owner: lead-agent
source_phase: docs/plans/phase_5_release-preview_plan.md
workstream: docs/workstreams/20260818-puffpuffstop-mobile-mvp/manifest.md
---

# Phase 6: Brand identity

## 1. Objective

Install the owner-supplied no-cloud icon as the official app icon set and shift the UI toward the icon’s sky blue. Do not submit, advertise, or enter secrets.

## 2. Relation to project end-state

Phases 0–5 delivered the local product and release-preview packaging. Phase 6 replaces placeholder Expo artwork and the cream palette so store and device surfaces match the brand mark.

## 3. Entry criteria and inherited evidence

Phase 5 verified and committed (`32c6ca0`). Owner supplied the icon and asked to proceed.

## 4. Scope

- Keep the original upload under `assets/brand/source/` so later art can live beside it.
- Export Expo-ready PNGs: 1024 app icon (no alpha), Android adaptive pair, monochrome, favicon, splash.
- Retoken screens, splash, and Android adaptive background to the sampled sky blue.
- Refresh the final checklist. Do not invent phase 7 unless the owner asks.

## 5. Non-goals

Store submit, EAS build, ads, Lottie packs, changing product copy to a kids tone.

## 6. Current-state audit

Source file is a 989×1024 JPEG named `.png` with black letterbox. Repo icons are Expo placeholders. Tokens and splash still use cream `#FFF6F0`.

## 7. Assumptions, constraints, risks, and decisions

- Dominant icon sky is `#00B8F8`. Screen `bg` uses a lighter wash so body text stays readable.
- Accent stays lavender-metal to match the slash/frame, not a second neon blue.
- iOS marketing icon is flattened RGB PNG (no alpha).

## 8. Dependencies

Owner artwork. Python Pillow (local, already available).

## 9. Architecture and affected systems

`assets/brand/` is the durable art library. `assets/images/` remains the Expo-facing generated set. Tokens stay the single color source.

## 10. Files and paths in scope

`assets/brand/`, `assets/images/*`, `app.json`, `src/theme/tokens.ts`, screens that inherit tokens, checklist/state.

## 11. Supporting documents

Phase plan, brand folder note, final checklist, continuation.

## 12. Ordered implementation tasks

1. Write this plan.
2. Store master + export script + generated icons.
3. Sky-blue tokens and splash/adaptive colors.
4. Validate and update checklist.

## 13. Adaptive role map

Parent-led. UX required for palette. SWE required for export/config. Growth skipped (no listing rewrite beyond existing drafts). Security skipped (no new data surface).

| Role ID | Required or skipped | Reason | Status |
|---|---|---|---|
| product-manager-subagent | inherited | 16+ / not kids still bind cute art | PASS inherited |
| ui-ux-developer-subagent | required | Icon set + sky tokens | complete PASS |
| software-engineer-subagent | required | Export + app.json | complete PASS |
| security-engineer-subagent | skipped | No new persist/auth/network | skipped |
| growth-marketing-subagent | skipped | No campaigns; listing drafts already exist | skipped |
| project-lead-subagent | required | Checklist refresh | CONDITIONAL |

## 14. Test and validation matrix

| Requirement | Validation | Status |
|---|---|---|
| Tokens use sky wash + locked hex | unit | verified |
| Icon export 1024 / formats | script assertions | verified |
| lint/test/typecheck | CLI | verified |

## 15. Security

No secrets. Icon is local artwork only.

## 16. Environment-variable registry

None new.

## 17. Deferred human-action queue

Unchanged store/legal/EAS items.

## 18. Rollback

Revert the phase-6 commit. Restore previous `assets/images/` from git.

## 19. Acceptance criteria

`app.json` points at 1024 PNG icons derived from the owner mark. UI background is sky-adjacent. Source master is kept for later assets.

## 20. Completion evidence

- `python3 assets/brand/scripts/export-app-icon.py` exported 1024 RGB PNG with no alpha
- `npm run lint` 0
- `npm test` 46 pass
- `npm run typecheck` 0
- Phase 5 commit `32c6ca0`

## 21. Deviations

Owner authorized a sixth implementation phase.

## 22. Next Plan Generation Prompt

Update `docs/plans/final_implementation_checklist.md` only. Do not invent phase 7 unless the owner explicitly asks.
