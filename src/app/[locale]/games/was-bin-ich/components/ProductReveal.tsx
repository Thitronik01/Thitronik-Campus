"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Lightbulb } from "lucide-react";
import { useTranslations } from "next-intl";
import type { WasBinIchProduct } from "../data/products";
import { XPBurst } from "./XPBurst";

interface ProductRevealProps {
  product: WasBinIchProduct;
  earnedXP: number;
  wasSkipped: boolean;
  onNext: () => void;
  isLastRound: boolean;
}

export function ProductReveal({
  product,
  earnedXP,
  wasSkipped,
  onNext,
  isLastRound,
}: ProductRevealProps) {
  const t = useTranslations("games.wasBinIch");

  return (
    <div className="flex flex-col items-center gap-6">
      {/* XP Burst (only shown when not skipped) */}
      {!wasSkipped && earnedXP > 0 && (
        <div className="h-16 flex items-center justify-center">
          <XPBurst xp={earnedXP} accentColor={product.accentColor} show />
        </div>
      )}

      {/* Flip card reveal */}
      <motion.div
        initial={{ rotateY: 90, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden"
        style={{
          boxShadow: `0 0 40px ${product.accentColor}30`,
          borderColor: `${product.accentColor}40`,
        }}
      >
        {/* Product header */}
        <div
          className="p-6 text-center"
          style={{
            background: `linear-gradient(135deg, ${product.accentColor}15, ${product.accentColor}05)`,
          }}
        >
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="text-6xl block mb-3"
          >
            {product.emoji}
          </motion.span>

          <h3
            className="text-2xl font-extrabold"
            style={{ color: product.accentColor }}
          >
            {product.name}
          </h3>

          <Badge
            variant="outline"
            className="mt-2 border-white/20 text-white/60"
          >
            Art.-Nr. {product.artikelNummer}
          </Badge>
        </div>

        {/* Fun Fact */}
        <div className="p-5 border-t border-white/10">
          <div className="flex items-start gap-3">
            <Lightbulb
              className="w-5 h-5 mt-0.5 flex-shrink-0"
              style={{ color: product.accentColor }}
            />
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-wider mb-1"
                style={{ color: product.accentColor }}
              >
                {t("funFact")}
              </p>
              <p className="text-white/80 text-sm leading-relaxed">
                {product.funFact}
              </p>
            </div>
          </div>
        </div>

        {/* Status badge */}
        <div className="px-5 pb-5">
          {wasSkipped ? (
            <Badge className="bg-white/10 text-white/50">{t("skipped")}</Badge>
          ) : (
            <Badge
              style={{
                backgroundColor: `${product.accentColor}20`,
                color: product.accentColor,
              }}
            >
              +{earnedXP} XP {t("earned")}
            </Badge>
          )}
        </div>
      </motion.div>

      {/* Next / Finish button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Button
          onClick={onNext}
          className="font-bold px-8 py-3 text-base"
          style={{
            backgroundColor: product.accentColor,
            color: "#0a1628",
          }}
        >
          {isLastRound ? t("showResults") : t("nextRound")}
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </motion.div>
    </div>
  );
}
