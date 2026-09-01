# 2026-08-25 continuation

## Home Log overlap

- Simulator screenshot showed the old 84×84 floating Log sitting on the Mouth card (`AXFrame` `{{159, 664}, {84, 84}}`). Expo Go was still on a stale bundle (3 tabs, full-width Mouth).
- Forced a fresh Expo Go open of `exp://192.168.1.118:8081`. Log is now a same-height tab pill in `src/ui/AppTabs.tsx` (Home · Log · Science · Settings).
- After reload: Mouth `94.51%` fully visible; disclaimer ends ~y=597; Log tab at y=780. No overlap.
- Expo Go’s developer gear still covers part of “Hey friend”; that is Expo chrome, not the Log control.

## Separate Log above tabs

- Owner wanted the circular Log back above the menu, not inside the tab row.
- Log is a 72px circle in the Home footer, above Home / Science / Settings. Footer is in layout flow so Mouth and the disclaimer stay clear (disclaimer ends ~y=597; Log at y=692; tabs at y=780).
