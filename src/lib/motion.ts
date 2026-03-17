/**
 * Motion Tokens — Duration and Easing constants for Framer Motion
 *
 * These mirror the CSS custom properties in globals.css but are available
 * as TypeScript constants for use in Framer Motion transitions.
 */

// ── Duration (seconds) ────────────────────────────────
export const duration = {
  instant: 0.1,
  fast: 0.15,
  normal: 0.2,
  slow: 0.3,
  slower: 0.5,
} as const;

// ── Easing Curves ─────────────────────────────────────
export const ease = {
  outExpo: [0.16, 1, 0.3, 1] as const,
  inOut: [0.4, 0, 0.2, 1] as const,
  spring: [0.34, 1.56, 0.64, 1] as const,
  out: "easeOut" as const,
  in: "easeIn" as const,
} as const;

// ── Spring Presets (for Framer Motion spring transitions) ──
export const spring = {
  snappy: { type: "spring" as const, stiffness: 300, damping: 25 },
  gentle: { type: "spring" as const, stiffness: 200, damping: 20 },
  bouncy: { type: "spring" as const, stiffness: 400, damping: 15 },
} as const;
