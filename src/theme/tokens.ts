export const color = {
  bg: "#FFF6F0",
  surface: "#FFFFFF",
  ink: "#2B2140",
  inkMuted: "#6B6080",
  accent: "#7C6CFF",
  accentMint: "#3ECFB2",
  amber: "#F4B942",
  danger: "#E35D6A",
  blockedBg: "#F3EEF8",
  onAccent: "#FFFFFF",
} as const;

export const space = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 40,
} as const;

export const radius = {
  sm: 12,
  md: 20,
  pill: 999,
} as const;

export const type = {
  title: { fontSize: 28, fontWeight: "800" as const },
  body: { fontSize: 17, fontWeight: "500" as const },
  caption: { fontSize: 13, fontWeight: "500" as const },
} as const;

export const motion = {
  fast: 160,
  loop: 2400,
} as const;

export const tokens = { color, space, radius, type, motion } as const;

export const minTapTarget = 44;
