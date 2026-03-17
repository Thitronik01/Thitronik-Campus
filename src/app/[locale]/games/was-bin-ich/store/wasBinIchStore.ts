import { create } from "zustand";
import { PRODUCTS, type WasBinIchProduct } from "../data/products";

// ── Types ────────────────────────────────────────────────────────────────────

type GamePhase = "loading" | "playing" | "revealed" | "finished";

interface RoundState {
  revealedHints: number; // 1–5 (how many hints are visible)
  wrongAttempts: number; // resets each round
  wasSkipped: boolean;
}

interface WasBinIchState {
  // ── Game state ──
  phase: GamePhase;
  currentRoundIndex: number; // 0-based index into shuffledProducts
  totalXP: number;
  correctCount: number;
  roundState: RoundState;
  shuffledProducts: WasBinIchProduct[];
  lastEarnedXP: number; // for XP-burst display

  // ── Actions ──
  startGame: () => void;
  guess: (answer: string) => boolean; // returns true if correct
  skip: () => void;
  nextRound: () => void;
  restart: () => void;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const XP_BY_HINT: Record<number, number> = {
  1: 50,
  2: 40,
  3: 30,
  4: 20,
  5: 10,
};

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function normalize(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[.\-_]/g, " ") // normalise dots, hyphens, underscores to spaces
    .replace(/\s+/g, " "); // collapse multiple spaces
}

function isCorrectAnswer(input: string, product: WasBinIchProduct): boolean {
  const normalizedInput = normalize(input);
  if (!normalizedInput) return false;

  // Check exact product name
  if (normalize(product.name) === normalizedInput) return true;

  // Check accepted aliases
  return product.acceptedAnswers.some(
    (alias) => normalize(alias) === normalizedInput
  );
}

const TOTAL_ROUNDS = PRODUCTS.length; // 8

function createInitialRoundState(): RoundState {
  return { revealedHints: 1, wrongAttempts: 0, wasSkipped: false };
}

// ── Store ────────────────────────────────────────────────────────────────────

export const useWasBinIchStore = create<WasBinIchState>((set, get) => ({
  phase: "loading",
  currentRoundIndex: 0,
  totalXP: 0,
  correctCount: 0,
  roundState: createInitialRoundState(),
  shuffledProducts: PRODUCTS, // Start with static data for SSR-Client matching
  lastEarnedXP: 0,

  startGame: () =>
    set({
      phase: "playing",
      currentRoundIndex: 0,
      totalXP: 0,
      correctCount: 0,
      roundState: createInitialRoundState(),
      shuffledProducts: shuffleArray(PRODUCTS),
      lastEarnedXP: 0,
    }),

  guess: (answer: string): boolean => {
    const state = get();
    const product = state.shuffledProducts[state.currentRoundIndex];

    if (isCorrectAnswer(answer, product)) {
      const earnedXP = XP_BY_HINT[state.roundState.revealedHints] ?? 0;
      set({
        phase: "revealed",
        totalXP: state.totalXP + earnedXP,
        correctCount: state.correctCount + 1,
        lastEarnedXP: earnedXP,
      });
      return true;
    }

    // Wrong answer
    const newWrongAttempts = state.roundState.wrongAttempts + 1;
    const shouldRevealNextHint =
      newWrongAttempts >= 3 && state.roundState.revealedHints < 5;

    set({
      roundState: {
        ...state.roundState,
        wrongAttempts: shouldRevealNextHint ? 0 : newWrongAttempts,
        revealedHints: shouldRevealNextHint
          ? state.roundState.revealedHints + 1
          : state.roundState.revealedHints,
      },
    });
    return false;
  },

  skip: () =>
    set({
      phase: "revealed",
      lastEarnedXP: 0,
      roundState: { ...get().roundState, wasSkipped: true },
    }),

  nextRound: () => {
    const state = get();
    const nextIndex = state.currentRoundIndex + 1;

    if (nextIndex >= TOTAL_ROUNDS) {
      set({ phase: "finished" });
      return;
    }

    set({
      phase: "playing",
      currentRoundIndex: nextIndex,
      roundState: createInitialRoundState(),
      lastEarnedXP: 0,
    });
  },

  restart: () => {
    set({
      phase: "playing",
      currentRoundIndex: 0,
      totalXP: 0,
      correctCount: 0,
      roundState: createInitialRoundState(),
      shuffledProducts: shuffleArray(PRODUCTS),
      lastEarnedXP: 0,
    });
  },
}));

export { TOTAL_ROUNDS };
export type { GamePhase, RoundState, WasBinIchState };
