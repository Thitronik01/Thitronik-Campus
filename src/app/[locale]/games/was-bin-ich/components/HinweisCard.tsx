"use client";

import { motion } from "framer-motion";

interface HinweisCardProps {
  hinweis: string;
  index: number;
  accentColor: string;
}

export function HinweisCard({ hinweis, index, accentColor }: HinweisCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.4, ease: "easeOut" }}
      className="relative rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-4 pl-5 overflow-hidden"
      style={{
        boxShadow: `0 0 20px ${accentColor}20`,
      }}
    >
      {/* Accent left border */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
        style={{ backgroundColor: accentColor }}
      />

      <div className="flex items-start gap-3">
        <span
          className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold"
          style={{
            backgroundColor: `${accentColor}25`,
            color: accentColor,
          }}
        >
          {index + 1}
        </span>
        <p className="text-white/90 text-sm leading-relaxed italic">
          &ldquo;{hinweis}&rdquo;
        </p>
      </div>
    </motion.div>
  );
}
