# PuffPuffStop product requirements

Task: `20260818-puffpuffstop-mobile-mvp`  
Status: specified for phase 0; later requirements are contract, not implementation  
Updated: 2026-08-18

## 1. Product statement

PuffPuffStop is a 16+ iOS/Android wellness habit coach that helps teens and young adults cut down and stop vaping. It is cute and teen-friendly. It is not a kids app, not a medical device, and not a payments product.

Primary JTBD: “When I want to quit vaping without being shamed or sold a paywall, help me see my habit, commit to a daily cut-down, and feel organs recover as I stay under my cap.”

Tagline (locked): Break the cycle, reclaim your lungs.

## 2. Users

- Primary: people 16+ who currently vape and want to taper.
- Secondary later: 18+ users who may opt into a licensed real-money savings product they own.
- Excluded: under 16 (hard stop); under 13 never in scope.

## 3. Priority legend

- P0: phase 0 foundation
- P1: onboarding + plan screen
- P2: home logging + organs
- P3: settings, privacy, local savings
- P4: store-ready hardening (no publish in this authorization)
- Later: sync, auth, 18+ money
- Excluded: listed in non-goals

## 4. Functional requirements

### Age and safety

| ID | Priority | Requirement | Acceptance |
|---|---|---|---|
| PPS-AGE-01 | P0 | Age gate is the first screen. User must affirm 16+. | Under 16 cannot reach nickname or later screens. |
| PPS-AGE-02 | P0 | Under-16 path is a hard stop with help resources and no tracking. | No analytics, puff logs, or profile writes after block. Help copy is non-clinical. |
| PPS-SAFE-01 | P0 | Wellness coach, not a medical device. Organ percentages are motivational estimates. | Every organ/plan surface shows an on-screen disclaimer. No diagnosis, treatment, or “clinically proven organ recovery” copy. |
| PPS-SAFE-02 | P0 | Not a kids app. | No Kids Category, no under-13, no “for kids/children” name, subtitle, screenshots, or store description. |
| PPS-SAFE-03 | P1 | Shame-free tone. Over-cap is amber, not scolding. | Copy review: no “you failed”, no guilt stack. |

### Onboarding (one question per screen)

Rotary dials 0–999 plus single-select period chips: days / weeks / months / years.

| ID | Screen | Required | Notes | Acceptance |
|---|---|---|---|---|
| PPS-ONB-01 | Age gate 16+ | yes | see PPS-AGE-01 | First route after launch when ungated |
| PPS-ONB-02 | Optional nickname | no | default “friend” | Empty → store `friend` |
| PPS-ONB-03 | How long have you been vaping (est.)? | yes if must cut | dial + period | durationCount 0–999 and one period |
| PPS-ONB-04 | How often do you vape (est.)? | yes if must cut | dial + period = puffs per that period | frequencyCount 0–999 and one period |
| PPS-ONB-05 | Device type | no | disposable / pod / refillable | one value or skip if not required |
| PPS-ONB-06 | Brand | yes if must cut | IGET, Alibarbar, Elf Bar, Lost Mary, Geek Bar, Vuse, JUUL, RELX, Other (text), Custom | one selection; Other requires text; Custom sets custom path |
| PPS-ONB-07 | Catalog: puffs per standard device (prefilled, editable). Custom: ml per puff + optional device ml | yes if must cut | empty catalog in phase 0 | catalog path shows editable integer; custom path shows ml/puff |
| PPS-ONB-08 | Nicotine strength chips + Other | no | chips TBD in UX; Other is text/number | stored as strengthLabel + optional numeric mg |
| PPS-ONB-09 | Optional typical device cost | no | savings math only | numeric local currency amount or skip; never a payment field |
| PPS-ONB-10 | When do you vape most? | no | multi-select triggers | 0+ selections stored |
| PPS-ONB-11 | Strictness | yes if must cut | Chill / Steady / Strict | exactly one |
| PPS-ONB-12 | Motivation | yes if must cut | Low / Medium / High / All-in | exactly one |
| PPS-ONB-13 | Quit window | yes if must cut | 2 weeks / 1 month / 3 months / 6 months / I’m not sure | exactly one |
| PPS-ONB-14 | Daily cut-down puff count | yes if must cut | Commitment = max(0, estimatedPuffsPerDay − cutDownPerDay) | shows computed commitment before finish |

“Must cut” means the user intends a reduction plan (default path). Required if you must cut: 1–4, 6–7, 11–14.

### Estimation

| ID | Priority | Rule | Acceptance |
|---|---|---|---|
| PPS-EST-01 | P1 | `puffsPerDay = frequencyCount / daysIn(frequencyPeriod)` | unit tests; 0 frequency → 0 |
| PPS-EST-02 | P1 | `historyDays = durationCount * daysIn(durationPeriod)` | unit tests |
| PPS-EST-03 | P1 | `daysIn`: day=1, week=7, month=30, year=365 | documented + tested |
| PPS-EST-04 | P1 | `commitmentPuffs = max(0, estimatedPuffsPerDay − cutDownPerDay)` | unit tests |
| PPS-EST-05 | P1 | Plan screen shows puffs/day, week, month, year; devices/week; optional spend/week; today’s commitment; disclaimer; CTA “See my organs” | later phase; copy locked now |
| PPS-EST-06 | P2 | Organ baseline 35–85% from onboarding, clamp 1–100, never 0 | later; formula weights provisional |

### Home

| ID | Priority | Requirement | Acceptance |
|---|---|---|---|
| PPS-HOME-01 | P2 | Cute organ cards: Lungs, Heart, Brain, Liver, Mouth with loop animation + N% | five cards; animation via Lottie or Rive later |
| PPS-HOME-02 | P2 | Center Snapchat-style circular Log button: +1 puff today, haptic, undo via long-press or 5s snackbar | one primary CTA; undo restores prior counts |
| PPS-HOME-03 | P2 | Today strip: logged / commitment; over cap is amber, not shaming | colors: on-track default, over-cap amber |
| PPS-HOME-04 | P2 | Each log: all organs minus a fraction of a percent; over-cap costs more | never display 0%; clamp 1–100 |
| PPS-HOME-05 | P2 | Local midnight: if logged <= commitment, green plus a smaller fraction; else no recovery | timezone = device local |

### Settings and money

| ID | Priority | Requirement | Acceptance |
|---|---|---|---|
| PPS-SET-01 | P3 | Settings: profile, brand, goals, notifications, privacy, export/delete | each destination exists later |
| PPS-SET-02 | P3 | Export/delete works offline on local data | delete is confirmed; export is a local file |
| PPS-MNY-01 | P3 | v1 Puff Savings is a local estimated money-not-spent ledger only | no card fields, no custody, no payout, no IAP on tracker |
| PPS-MNY-02 | Later | Real money 18+ only, licensed account the user owns | out of this authorization |

## 5. Non-functional requirements

| ID | Priority | Requirement | Acceptance |
|---|---|---|---|
| PPS-NFR-01 | P0 | Expo + TypeScript + Expo Router | phase-0 skeleton |
| PPS-NFR-02 | P1 | Offline-first SQLite | local CRUD without network |
| PPS-NFR-03 | Later | Supabase Auth/Postgres/RLS | structure in phase 0 only |
| PPS-NFR-04 | P0 | No secrets in repo | `.env.example` names only |
| PPS-NFR-05 | P2 | Accessibility: 44pt Log target, Dynamic Type, Reduce Motion fallback, screen-reader names for organs and Log | UX spec + later tests |
| PPS-NFR-06 | P0 | Lint, typecheck, and unit tests in CI-ready scripts | commands pass locally |

## 6. Explicit non-goals

- Flutter rewrite
- Bluetooth or ultrasonic auto-count
- IAP paywall on the tracker
- Cloning Puff Count social/Quit Buddies or subscription walls
- Kids Category or under-13 mode
- Clinical organ diagnostics
- Card processing, custody, or payouts in v1
- Paid ads and store publish in this authorization
- Remote database mutation in this authorization

## 7. Metrics (baselines unknown)

Do not fabricate numbers. v1 stores events locally; remote analytics only after consent + Security review.

| Metric | Type | Baseline | Target | Horizon | Decision |
|---|---|---|---|---|---|
| Age-gate block rate | guardrail | unknown | no under-16 profiles created | always | investigate if any blocked user is later logged |
| Onboarding completion (must-cut required fields) | activation | unknown | TBD after internal dogfood | phase 1–2 | fix drop screens >40% (provisional) |
| Day-1 log used | activation | unknown | TBD | phase 2 | if unused, simplify Log affordance |
| Share of days logged <= commitment | outcome | unknown | TBD | 14 days | product learning, not a medical endpoint |
| Over-cap amber views vs shame-copy complaints | guardrail | unknown | zero shame-copy issues | always | copy fix |

## 8. Downstream instructions

- UI/UX may not drop required questions, add Kids positioning, or hide the disclaimer.
- Engineering may not add payments, IAP, Bluetooth, or remote writes in phase 0.
- Growth may not draft “for kids” metadata or clinical cure claims.
- Security must treat under-16 no-tracking as a blocking control.
