# Accessibility specification

## Phase 0 (must implement)

- Age-gate question is the screen title / accessibility heading.
- “Yes, I’m 16+” and “No, I’m under 16” are buttons, min 44×44 pt, with distinct accessibility labels.
- Helper and disclaimer text are readable at Dynamic Type / larger system font (allow wrap, no truncate mid-sentence).
- Contrast: ink on cream and white-on-accent must meet WCAG 2.2 AA (≥ 4.5:1 for body).
- No essential information only in color.
- Reduce Motion: phase-0 screens are static; no loops.
- Screen reader on blocked: announce that no profile or tracking was created.

## Later phases (do not implement now)

- Log button: role button, label “Log one puff”, hint “Long press to undo”.
- Organ cards: label “Lungs, 72 percent, motivational estimate”.
- Rotary dial: adjustable / increment-decrement alternatives, not gesture-only.
- Snackbar undo: focusable action within 5s.
- Never rely on haptic-only feedback.
