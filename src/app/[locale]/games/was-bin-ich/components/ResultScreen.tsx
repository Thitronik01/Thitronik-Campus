"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Trophy, Target, Dumbbell, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { TOTAL_ROUNDS } from "../store/wasBinIchStore";

interface ResultScreenProps {
  totalXP: number;
  correctCount: number;
  onRestart: () => void;
}

function getRating(xp: number): {
  label: string;
  emoji: string;
  icon: React.ReactNode;
  gradient: string;
} {
  if (xp >= 350) {
    return {
      label: "Produktexperte",
      emoji: "🏆",
      icon: <Trophy className="w-8 h-8 text-yellow-400" />,
      gradient: "from-yellow-400/20 to-amber-500/10",
    };
  }
  if (xp >= 200) {
    return {
      label: "Auf einem guten Weg",
      emoji: "🎯",
      icon: <Target className="w-8 h-8 text-sky-400" />,
      gradient: "from-sky-400/20 to-blue-500/10",
    };
  }
  return {
    label: "Noch Luft nach oben",
    emoji: "💪",
    icon: <Dumbbell className="w-8 h-8 text-orange-400" />,
    gradient: "from-orange-400/20 to-red-500/10",
  };
}

export function ResultScreen({
  totalXP,
  correctCount,
  onRestart,
}: ResultScreenProps) {
  const t = useTranslations("games.wasBinIch");
  const rating = getRating(totalXP);
  const maxXP = TOTAL_ROUNDS * 50; // 400

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center gap-8 py-8"
    >
      {/* Trophy / Rating Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className={`w-24 h-24 rounded-full bg-gradient-to-br ${rating.gradient} flex items-center justify-center border border-white/10`}
      >
        <span className="text-5xl">{rating.emoji}</span>
      </motion.div>

      {/* Rating label */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-center"
      >
        <h2 className="text-3xl font-extrabold text-white mb-2">
          {rating.label}
        </h2>
        <p className="text-white/50 text-sm">{t("resultSubtitle")}</p>
      </motion.div>

      {/* Stats cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-2 gap-4 w-full max-w-sm"
      >
        {/* XP Card */}
        <div className="rounded-xl bg-white/5 border border-white/10 backdrop-blur-md p-4 text-center">
          <Star className="w-5 h-5 text-brand-lime mx-auto mb-2" />
          <p className="text-3xl font-extrabold text-brand-lime">{totalXP}</p>
          <p className="text-white/50 text-xs mt-1">{t("totalXP")}</p>
          <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(totalXP / maxXP) * 100}%` }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="h-full rounded-full bg-brand-lime"
            />
          </div>
        </div>

        {/* Hit ratio Card */}
        <div className="rounded-xl bg-white/5 border border-white/10 backdrop-blur-md p-4 text-center">
          <Target className="w-5 h-5 text-brand-sky mx-auto mb-2" />
          <p className="text-3xl font-extrabold text-brand-sky">
            {correctCount}
            <span className="text-lg text-white/40">/{TOTAL_ROUNDS}</span>
          </p>
          <p className="text-white/50 text-xs mt-1">{t("hitRatio")}</p>
          <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${(correctCount / TOTAL_ROUNDS) * 100}%`,
              }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="h-full rounded-full bg-brand-sky"
            />
          </div>
        </div>
      </motion.div>

      {/* Rating badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <Badge className="bg-white/10 text-white/80 text-sm px-4 py-1.5 gap-2">
          {rating.icon}
          {rating.label} {rating.emoji}
        </Badge>
      </motion.div>

      {/* Restart button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <Button
          onClick={onRestart}
          className="bg-brand-lime text-brand-navy hover:bg-brand-lime/90 font-bold px-8 py-3 text-base"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          {t("restart")}
        </Button>
      </motion.div>
    </motion.div>
  );
}
