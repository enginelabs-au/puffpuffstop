# PuffPuffStop design specification

Phase 0 implements only §3 (tokens) and §4 (age-gate stub). Later sections are binding for future phases, not a license to build them now.

## 1. Voice and visual tone

- Cute, warm, slightly glossy. Think enamel pins and mint soda, not a pediatric cartoon.
- Never use “kids”, “children”, “little lungs for little ones”, or mascot baby-talk.
- Always 16+ on the first screen. Tagline may appear in small type: “Break the cycle, reclaim your lungs.”
- Over-cap: amber, calm. Recovery: soft green. Never red-alert shame.

## 2. Information architecture

```text
Launch
 └─ Age gate (phase 0)
     ├─ I’m 16 or older → (phase 1) Onboarding 2…14 → Plan → Home
     └─ I’m under 16 → Blocked (help, no continue)
Home (phase 2)
 ├─ Organ cards
 ├─ Log (center)
 └─ Today strip
Settings (phase 3)
```

Single root tab later: Home. Settings is a gear, not a second tab competing with Log.

## 3. Design tokens (phase 0)

Implement as `src/theme/tokens.ts`.

| Token | Value (logical) | Use |
|---|---|---|
| `color.sky` | `#00B8F8` icon sky | splash / adaptive |
| `color.bg` | `#D8F4FC` sky wash | screen |
| `color.surface` | `#FFFFFF` | cards |
| `color.ink` | `#163047` | primary text |
| `color.inkMuted` | `#4A6A80` | secondary |
| `color.accent` | `#7A6BA8` metallic lavender | primary buttons |
| `color.accentMint` | `#2EC4A8` | recovery / 16+ confirm |
| `color.amber` | `#F4B942` | over-cap |
| `color.danger` | `#E35D6A` | destructive only (delete later); not over-cap |
| `color.blockedBg` | `#E4EEF8` | under-16 screen |
| `space.xs/sm/md/lg/xl` | 4 / 8 / 16 / 24 / 40 | spacing |
| `radius.sm/md/pill` | 12 / 20 / 999 | cards / Log |
| `type.title` | 28 / 800 | headlines |
| `type.body` | 17 / 500 | body |
| `type.caption` | 13 / 500 | disclaimer |
| `motion.fast` | 160ms | press |
| `motion.loop` | 2400ms | later organ loops |

Dark-mode keys may exist as comments or unused exports; do not theme-switch in phase 0.

## 4. Age-gate stub (phase 0 build)

**Screen: Age gate** (`/age-gate` or index)

- Full-bleed cream background.
- Wordmark: PuffPuffStop.
- Question: “Are you 16 or older?”
- Helper: “This wellness coach is for teens and young adults. It is not a kids app and not a medical device.”
- Primary pill: “Yes, I’m 16+” → `allowed` (phase 0 may land on a tiny placeholder “Foundation ready” that is not Home).
- Secondary text button: “No, I’m under 16” → `/blocked`.
- Both targets ≥ 44×44 pt.
- No analytics, no nickname field, no skip.

**Screen: Blocked**

- Title: “PuffPuffStop isn’t available yet for you.”
- Body: “If you are under 16, we won’t track anything or start a profile.”
- Help (static, non-clinical): “Talk with a trusted adult. If you need to talk to someone now, contact local youth support or emergency services in your area.”
- Optional later: region-specific resource links. Phase 0 may show placeholder labels without network fetch.
- No back-to-app continue, no Log, no organs.

**Placeholder after allow (phase 0 only)**

- “You’re in. Onboarding comes next.”
- No organ cards, no Log. Prevents accidental phase-2 implementation.

## 5. Later screens (do not build in phase 0)

Onboarding: one question, large type, rotary 0–999 (center value, swipe/drag), period chips in a single row, Continue disabled until valid if required.

Home: five horizontal organ cards with loop animation + N% and caption disclaimer under the row. Center 72–88 pt circular Log, drop shadow, “Log” label. Today strip above Log: `logged / commitment`. Undo snackbar 5s “Undo puff” or long-press Log.

Plan: stats list + disclaimer + CTA “See my organs”.

Settings: grouped list, privacy first-class.

## 6. Copy rules

- Disclaimer (plan/organs): “These organ percentages are motivational estimates, not medical measurements or diagnoses.”
- Over-cap: “Over today’s commitment” — not “You failed.”
- Savings: “Estimated money not spent. Not a bank account.”
