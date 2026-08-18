# PuffPuffStop strategic blueprint

Date: 2026-08-18  
Slug: `puffpuffstop`  
Workstream: `docs/workstreams/20260818-puffpuffstop-mobile-mvp/manifest.md`  
PRD: `docs/workstreams/20260818-puffpuffstop-mobile-mvp/product-manager-subagent/artifacts/product-requirements.md`  
Authorization: local planning + phase-0 foundations only

## 1. Executive decision

**Build.** PuffPuffStop should proceed as a 16+ Expo iOS/Android wellness habit coach: tap-to-log tapering, a single circular Log control, cute organ-recovery feedback, and a local savings ledger. Do not build a medical device, kids app, social clone of Puff Count, IAP-gated tracker, Bluetooth auto-counter, or real-money wallet in v1.

The underserved wedge is not “count puffs.” It is a shame-free, teen-coded (not child-coded) coach that makes cut-down commitments and body-feeling progress obvious, without a paywall on the core tracker.

Phase 0 only materializes foundations. Later phases implement onboarding, home, settings, and store-ready hardening. Production, store publish, ads, secrets, cards, and remote DB writes remain owner-gated.

## 2. Evidence and research method

Performed 2026-08-18 by the parent orchestrator in product-manager mode:

- Repository audit: README name + tagline; control plane; no application source.
- WebSearch of App Store listings for Puff Count and adjacent trackers.
- WebSearch of published analyses of r/QuitVaping / r/QuittingJUUL (not a live Reddit scrape).
- WebSearch of Apple App Store Review Guidelines 1.3 / 2.3.8 and age-rating references.

Not performed: app installs, screenshot capture, Figma inspection, authenticated analytics, paid market reports, legal counsel, clinical literature review beyond public cessation-forum papers.

## 3. Intelligence report

### Problem evidence

Published analyses of quit-vaping Reddit communities (Struik et al., JMIR 2021, PMC8576600; later 2015–2021 subreddit analyses, doi 10.2196/52129) and a University of Iowa student summary of r/QuitVaping and r/QuittingJUUL describe recurring, high-severity themes:

- Intense nicotine withdrawal and nicotine-salt dependence (often JUUL-class devices in older posts; disposables later).
- Social proximity—friends, social media, and devices still in reach.
- Stigma and secrecy from family; peer forums as a safer support space.
- Relapse talk and a desire for day-by-day accountability.
- Relatively few dedicated quit-vaping tools compared with cigarette programs; some posters mention generic quit apps or books.

Inference (not a scrape): 16–24 users want something that feels like their culture (cute, fast, non-lecture) rather than a clinic portal or a children’s learning app.

### Community terminology (from literature + owner brief)

Puffs, disposable vs pod vs refillable, nic strength, cut down / taper, triggers, streak language is common in category apps but shame is a trust risk. This product prefers commitment vs logged, amber over-cap, and organ % as motivational—not “lungs destroyed.”

### Purchasing / trust signals

Puff Count’s listing states some features require a subscription and claims a large install base. That is a competitive signal and a trust hazard: teens hit paywalls on the tracker. Owner brief forbids IAP on the tracker. Trust also depends on honest “not medical” labeling.

## 4. User/problem definition

- Primary user: a 16+ teen or young adult who vapes (often disposables) and wants to cut down without being treated like a child or a patient.
- Problem: vaping is frequent, social, and easy to lose count of; existing tools are either generic adult quit-smoking apps, paywalled counters, or too clinical/shaming.
- Outcome: the user can estimate a baseline, set a daily commitment, log in one tap, see cute organs move, and optionally see estimated money not spent—locally, privately.
- Promise: Break the cycle, reclaim your lungs. Feel progress you can tap, not a lecture you have to buy.

## 5. Competitive landscape and gap

| Alternative | Type | Strength | Weakness for this segment |
|---|---|---|---|
| Puff Count: Quit Vaping Now (id 1488580640) | Direct | Tap-to-log, daily limits, taper plans, graphs; large marketed audience | Subscription for some features; social/Quit Buddies; adult-generic brand; not the cute organ-coach wedge |
| Puff Count: Track Puffs (id 6747340986) | Direct name collision | Plans, money saved, mood, widgets | Different publisher; still a conventional tracker |
| Puff Pacer | Direct | One-tap log, pacing countdown, Siri/Watch | Broader nicotine (Zyn, cigarettes); Apple-centric; pacing metaphor vs organ coach |
| Generic quit-smoking apps / NRT programs | Indirect | Clinical credibility | Cigarette-first; not disposable-brand fluent; can feel medical |
| Notes app / spreadsheet | Substitute | Private, free | High friction; no ritual; easy to abandon |
| Do nothing / “I’ll just stop” | Do-nothing | Zero setup | Withdrawal + social triggers; no feedback loop |

Gap: a 16+ cute organ-coach with rotary estimation, brand-aware device math, Snapchat-simple logging, shame-free over-cap, and no tracker paywall. Do not clone Puff Count IAP or social.

## 6. Unique value proposition and wedge

For 16+ people who want to quit vaping, PuffPuffStop is the cute daily coach that turns a one-tap log into visible organ recovery and a local savings story—without pretending to be a doctor, a kids app, or a bank.

Wedge tests: (1) one-tap Log is the only home verb; (2) organs never show 0% and always show a disclaimer; (3) over-cap is amber; (4) core tracker has no IAP.

## 7. Validation experiments and thresholds

No live experiments in this authorization. Cheapest later tests:

| Experiment | Risk | Pass | Fail |
|---|---|---|---|
| Internal dogfood of age-gate + 14-step onboarding | Drop-off | Required path completable in <4 minutes by 3 uninvolved testers 16+ | Testers skip or cannot complete required fields |
| Log + undo paper-prototype / later build | Ritual friction | 5/5 testers find Log without instruction | Testers look for a form |
| Disclaimer comprehension | Medical-claim risk | 5/5 say organs are motivational not clinical | Any tester thinks the app diagnoses lungs |
| Store-copy review | Kids Category / 2.3.8 | Zero “kid/child” claims; 16+ clear | Any kids-category implication |

Do not treat Puff Count’s marketed 800k users as our TAM.

## 8. Product requirements document

Canonical PRD: `docs/workstreams/20260818-puffpuffstop-mobile-mvp/product-manager-subagent/artifacts/product-requirements.md`.

Summary:

- Age gate 16+ first; under 16 hard stop + help + no tracking.
- 14 one-question screens; rotary 0–999; period chips; required-if-must-cut = 1–4, 6–7, 11–14.
- Estimation: `puffsPerDay = frequencyCount / daysIn(period)`; `historyDays = durationCount * daysIn(period)`; `commitment = max(0, puffsPerDay − cutDownPerDay)`.
- Home: five organ cards; center Log; today strip; local midnight recovery if under cap.
- Settings + local estimated savings only.

## 9. MVP scope and non-goals

**v1 required:** age gate, onboarding, plan screen, home log + organs, settings, export/delete, local savings ledger, disclaimers, offline SQLite.

**Required later:** Supabase Auth/Postgres/RLS sync; notifications polish; 18+ licensed real-money account the user owns.

**Excluded:** Flutter, Bluetooth auto-count, IAP on tracker, Puff Count social clone, Kids Category, under-13, card/custody/payout in v1, clinical claims.

Phase 0 implements only foundations listed in §13.

## 10. System architecture and data model

```text
[Expo Router client]
   ├─ Age-gate (local decision)
   ├─ Onboarding / plan (local)
   ├─ Home log + organs (local)
   └─ Settings / export (local)
        │
        ▼
[SQLite / expo-sqlite]  offline source of truth
        │  later
        ▼
[Supabase Auth + Postgres + RLS]  optional sync
```

Logical entities: `AgeGateDecision`, `Profile`, `HabitEstimate`, `DeviceProfile`, `BrandCatalogEntry`, `DailyCommitment`, `PuffLog`, `OrganScoreSnapshot`, `LocalSavingsLedger`. Brand catalog is empty in phase 0.

Rejected alternatives: Flutter (owner lock), Next.js-only (not the mobile ritual), Bluetooth hardware (out of scope), immediate cloud-auth (blocks offline-first).

## 11. Interfaces and integrations

- Phase 0: no network APIs. Env names reserved for later Supabase.
- Later: Supabase Auth + RLS-scoped user tables. No public write without auth.
- Animations: Lottie or Rive assets later; phase 0 tokens only.
- Notifications: OS permission later; never before age-gate pass.
- Analytics: local-first; remote only after consent + Security.

## 12. Security, privacy, reliability, and compliance considerations

- Age-gate is a client control in phase 0; treat bypass as expected and keep under-16 path side-effect free.
- No tracking on the blocked path (PPS-AGE-02).
- Wellness disclaimer on organ/plan surfaces; avoid device-regulation claims.
- COPPA/under-13: out of scope by exclusion; do not collect data from blocked users.
- v1 money is estimated math, not a financial product. Real money 18+ later only.
- Secrets never in git. Remote migrations unauthorized this phase.
- Export/delete is a privacy requirement in P3.

## 13. Delivery phase map

| Phase | Name | Outcome |
|---|---|---|
| 0 | Foundations | Expo skeleton, tokens, age-gate stub, empty brand table, lint/test/typecheck, Supabase structure + empty baseline, env names |
| 1 | Onboarding + plan | Screens 1–14, estimation, plan screen CTA |
| 2 | Home ritual | Log, undo, organs, today strip, midnight recovery |
| 3 | Settings + local savings | Profile/brand/goals/privacy/export/delete; local ledger |
| 4 | Hardening | A11y, notifications opt-in, store metadata drafts, residual security; still no publish unless owner later authorizes |

Human-only later: Apple/Google accounts, listings, privacy policy hosting, Supabase project, secrets, legal review, 18+ money licensing, ads.

## 14. Cultural go-to-market strategy

Planning only. No campaigns in this workstream.

- First reachable audience: 16–24 peers via organic communities that already talk about quitting (r/QuitVaping and similar). Those communities punish ads and “I built an app” spam.
- Trust assets: honest disclaimer, no paywall on logging, cute organs, founder-in-progress notes.
- Reddit hook concepts (do not post unless owner later approves):
  1. Problem-first: “How do you count puffs on a disposable without guessing?” no pitch.
  2. Build journey: estimation math + why we refuse a tracker paywall.
  3. Resource-value: public, non-clinical taper worksheet; restrained disclosure.
- Store copy: 16+, wellness, not for children, not a medical device.
- Paid ads: unauthorized.

## 15. Risks, pivots, and no-build criteria

- **Medical-claim drift** → keep disclaimer; pivot copy if testers infer diagnosis.
- **Kids-app confusion** because the UI is cute → 16+ gate + store copy discipline.
- **Category crowding** → if dogfood shows no differentiation from Puff Count beyond aesthetics, narrow to organ ritual + shame-free commitment before adding features.
- **Age-gate insufficiency** → later consider additional store and OS rating controls; never add under-16 mode.
- **No-build** if owner requires under-16, Kids Category, clinical certification, or v1 payments. None of those are in the locked brief.

## 16. Sources and research limitations

- https://apps.apple.com/us/app/puff-count-quit-vaping-now/id1488580640
- https://apps.apple.com/us/app/puff-count-track-puffs/id6747340986
- https://puffpacer.com/
- https://pmc.ncbi.nlm.nih.gov/articles/PMC8576600/
- https://doi.org/10.2196/52129
- https://www.public-health.uiowa.edu/wp-content/uploads/2020/12/Kamara-Shaw.pdf
- https://developer.apple.com/app-store/review/guidelines/
- https://developer.apple.com/help/app-store-connect/reference/age-ratings

Limitations: no live community scrape, no install-time UX audit, no verified market size, no legal opinion, Puff Count user counts are vendor marketing.

## 17. Handoff into `phase_0_foundations_plan.md`

Create `docs/plans/phase_0_foundations_plan.md` from `.cursor/templates/phase-plan-template.md`. Map phases 0–4 as in §13. Detail only phase 0. Include env-name registry (names only), deferred human actions, next-plan prompt for phase 1 onboarding, and the six-role matrix. Implement only PPS-P0-01–07 plus the age-gate stub needed to validate the foundation.
