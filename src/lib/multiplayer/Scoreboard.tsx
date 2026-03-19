"use client";

// src/lib/multiplayer/Scoreboard.tsx
// End-screen component with rankings, confetti, and play-again

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Trophy, RotateCcw, Star } from "lucide-react";
import type { Participant } from "./types";

interface ScoreboardProps {
  participants: Participant[];
  hostName: string;
  isHost: boolean;
  onPlayAgain?: () => void;
}

// Confetti particle component (CSS-only)
function ConfettiParticle({ index }: { index: number }) {
  const colors = ["#C7F464", "#FFD700", "#FF6B9D", "#00C9FF", "#A78BFA", "#4ECDC4"];
  const color = colors[index % colors.length];
  const left = Math.random() * 100;
  const delay = Math.random() * 2;
  const duration = 2 + Math.random() * 2;
  const size = 6 + Math.random() * 8;

  return (
    <motion.div
      initial={{ y: -20, x: 0, opacity: 1, rotate: 0 }}
      animate={{
        y: [0, 400, 600],
        x: [0, (Math.random() - 0.5) * 200],
        opacity: [1, 1, 0],
        rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
      }}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
      style={{
        position: "absolute",
        top: 0,
        left: `${left}%`,
        width: size,
        height: size * 0.6,
        backgroundColor: color,
        borderRadius: 2,
        pointerEvents: "none",
        zIndex: 50,
      }}
    />
  );
}

export function Scoreboard({
  participants,
  hostName,
  isHost,
  onPlayAgain,
}: ScoreboardProps) {
  const t = useTranslations("multiplayer.scoreboard");
  const [showConfetti, setShowConfetti] = useState(true);

  // Sort by score descending
  const ranked = [...participants].sort((a, b) => b.score - a.score);
  const medals = ["🥇", "🥈", "🥉"];

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative max-w-2xl mx-auto">
      {/* Confetti for 1st place */}
      {showConfetti && ranked.length > 0 && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
          {Array.from({ length: 40 }).map((_, i) => (
            <ConfettiParticle key={i} index={i} />
          ))}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-lime/20 mb-4"
          >
            <Trophy className="w-8 h-8 text-brand-lime" />
          </motion.div>
          <h2 className="text-3xl font-black text-white mb-2">
            {t("title")}
          </h2>
          {ranked.length > 0 && (
            <p className="text-brand-lime font-bold">
              {t("winner")}: {ranked[0].name} 🎉
            </p>
          )}
        </div>

        {/* Rankings */}
        <div className="space-y-2 mb-8">
          {ranked.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                i === 0
                  ? "bg-brand-lime/10 border border-brand-lime/30"
                  : i === 1
                  ? "bg-white/8 border border-white/15"
                  : i === 2
                  ? "bg-amber-500/5 border border-amber-500/15"
                  : "bg-white/3 border border-white/5"
              }`}
            >
              {/* Rank */}
              <div className="w-10 text-center text-2xl">
                {i < 3 ? medals[i] : (
                  <span className="text-white/40 text-lg font-bold">{i + 1}.</span>
                )}
              </div>

              {/* Avatar + Name */}
              <div className="flex-1 min-w-0">
                <p className={`font-bold truncate ${
                  i === 0 ? "text-brand-lime text-lg" : "text-white"
                }`}>
                  {p.name}
                </p>
              </div>

              {/* Score */}
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <Star className={`w-4 h-4 ${
                    i === 0 ? "text-brand-lime" : "text-white/40"
                  }`} />
                  <span className={`font-black text-lg ${
                    i === 0 ? "text-brand-lime" : "text-white"
                  }`}>
                    {p.score.toLocaleString()}
                  </span>
                </div>
                <p className="text-white/30 text-xs">Punkte</p>
              </div>
            </motion.div>
          ))}

          {ranked.length === 0 && (
            <div className="text-center py-8 text-white/40">
              Keine Teilnehmer
            </div>
          )}
        </div>

        {/* Play Again (Host only) */}
        {isHost && onPlayAgain && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onPlayAgain}
            className="w-full py-3 rounded-xl font-bold text-lg bg-brand-lime text-brand-navy hover:bg-brand-lime/90 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            {t("playAgain")}
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}
