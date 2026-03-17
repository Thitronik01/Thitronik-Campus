/**
 * Framer Motion Variants Library
 *
 * Standardized animation variants for consistent motion across the app.
 * Always pair with useReducedMotion() for accessibility.
 */

import { type Variants } from "framer-motion";
import { duration, ease } from "./motion";

// ── Fade In ───────────────────────────────────────────
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: duration.normal, ease: ease.out },
  },
};

// ── Slide Up (for page transitions, cards) ────────────
export const slideUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: ease.outExpo },
  },
};

// ── Scale In (for modals, dialogs) ────────────────────
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: duration.normal, ease: ease.outExpo },
  },
};

// ── Stagger Container ─────────────────────────────────
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05 },
  },
};

// ── Reduced Motion (accessibility) ────────────────────
export const reducedMotion: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.01 },
  },
};
