"use client";

import { useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Star, HelpCircle } from "lucide-react";
import { useTranslations } from "next-intl";

import { useWasBinIchStore, TOTAL_ROUNDS } from "../store/wasBinIchStore";
import { HinweisCard } from "./HinweisCard";
import { GuessInput } from "./GuessInput";
import { ProductReveal } from "./ProductReveal";
import { ResultScreen } from "./ResultScreen";

export function WasBinIchGame() {
  const t = useTranslations("games.wasBinIch");
  const {
    phase,
    currentRoundIndex,
    totalXP,
    correctCount,
    roundState,
    shuffledProducts,
    lastEarnedXP,
    guess,
    skip,
    nextRound,
    restart,
  } = useWasBinIchStore();

  // ── Client-side initialization to avoid hydration mismatch ──
  // By calling restart in useEffect, we ensure the random shuffling
  // only happens on the client, and the first render matches the server's 'loading' phase.
  useEffect(() => {
    restart();
  }, [restart]);

  const currentProduct = shuffledProducts[currentRoundIndex];
  const visibleHints = currentProduct.hinweise.slice(
    0,
    roundState.revealedHints
  );
  const progressPercent = ((currentRoundIndex + 1) / TOTAL_ROUNDS) * 100;
  const isLastRound = currentRoundIndex >= TOTAL_ROUNDS - 1;

  const handleGuess = useCallback(
    (answer: string): boolean => {
      return guess(answer);
    },
    [guess]
  );

  const handleSkip = useCallback(() => {
    skip();
  }, [skip]);

  const handleNext = useCallback(() => {
    nextRound();
  }, [nextRound]);

  const handleRestart = useCallback(() => {
    restart();
  }, [restart]);

  // ── Loading state ─────────────────────────────────────────────────────
  if (phase === "loading") {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <div className="w-12 h-12 border-4 border-brand-lime/20 border-t-brand-lime rounded-full animate-spin" />
        <p className="text-white/40 animate-pulse">{t("loading", { defaultValue: "Wird geladen..." })}</p>
      </div>
    );
  }

  // ── Finished / Result Screen ──────────────────────────────────────────
  if (phase === "finished") {
    return (
      <ResultScreen
        totalXP={totalXP}
        correctCount={correctCount}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* ── Top Bar: Round + XP ─────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Badge
            className="text-sm px-3 py-1"
            style={{
              backgroundColor: `${currentProduct.accentColor}20`,
              color: currentProduct.accentColor,
              borderColor: `${currentProduct.accentColor}40`,
            }}
          >
            {t("round")} {currentRoundIndex + 1}/{TOTAL_ROUNDS}
          </Badge>
          <Badge className="bg-white/10 text-white/60 text-sm px-3 py-1 gap-1.5">
            <Star className="w-3.5 h-3.5 text-brand-lime" />
            {totalXP} XP
          </Badge>
        </div>

        <div className="flex items-center gap-2 text-xs text-white/40">
          <HelpCircle className="w-3.5 h-3.5" />
          {t("hintsRevealed", { count: roundState.revealedHints, total: 5 })}
        </div>
      </div>

      {/* ── Progress bar ────────────────────────────────────────────── */}
      <Progress
        value={progressPercent}
        className="h-2 bg-white/10"
      />

      {/* ── Mystery product header ──────────────────────────────────── */}
      <motion.div
        key={currentProduct.id}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-4"
      >
        <motion.span
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="text-6xl block mb-3"
        >
          ❓
        </motion.span>
        <h2 className="text-xl font-bold text-white/80">{t("whoAmI")}</h2>
        <p className="text-white/40 text-sm mt-1">{t("readHints")}</p>
      </motion.div>

      {/* ── Hints area ──────────────────────────────────────────────── */}
      {phase === "playing" && (
        <motion.div
          key={`hints-${currentProduct.id}`}
          className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-xl p-6 relative overflow-hidden card-glow"
          style={{
            boxShadow: `0 0 40px ${currentProduct.accentColor}15`,
            borderColor: `${currentProduct.accentColor}20`,
          }}
        >
          {/* Subtle background glow */}
          <div 
            className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 blur-3xl opacity-20 rounded-full"
            style={{ backgroundColor: currentProduct.accentColor }}
          />

          {visibleHints.map((hinweis, i) => (
            <HinweisCard
              key={`${currentProduct.id}-hint-${i}`}
              hinweis={hinweis}
              index={i}
              accentColor={currentProduct.accentColor}
            />
          ))}
        </motion.div>
      )}

      {/* ── Guess input (playing phase) ─────────────────────────────── */}
      {phase === "playing" && (
        <GuessInput
          onGuess={handleGuess}
          onSkip={handleSkip}
          accentColor={currentProduct.accentColor}
        />
      )}

      {/* ── Product reveal (revealed phase) ─────────────────────────── */}
      {phase === "revealed" && (
        <ProductReveal
          product={currentProduct}
          earnedXP={lastEarnedXP}
          wasSkipped={roundState.wasSkipped}
          onNext={handleNext}
          isLastRound={isLastRound}
        />
      )}
    </div>
  );
}
