"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";

interface XPBurstProps {
  xp: number;
  accentColor: string;
  show: boolean;
}

interface Particle {
  id: number;
  angle: number;
  distance: number;
  size: number;
  delay: number;
}

export function XPBurst({ xp, accentColor, show }: XPBurstProps) {
  // Generate random particles on mount
  const particles = useMemo((): Particle[] => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      angle: (360 / 12) * i + Math.random() * 20 - 10,
      distance: 40 + Math.random() * 60,
      size: 4 + Math.random() * 6,
      delay: Math.random() * 0.15,
    }));
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <div className="relative inline-flex items-center justify-center">
          {/* XP text */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: [0.5, 1.3, 1], opacity: [0, 1, 1] }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-3xl font-extrabold z-10"
            style={{ color: accentColor }}
          >
            +{xp} XP
          </motion.div>

          {/* Particles */}
          {particles.map((p) => {
            const rad = (p.angle * Math.PI) / 180;
            const tx = Math.cos(rad) * p.distance;
            const ty = Math.sin(rad) * p.distance;

            return (
              <motion.div
                key={p.id}
                initial={{ scale: 0, opacity: 1, x: 0, y: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [1, 0.8, 0],
                  x: tx,
                  y: ty,
                }}
                transition={{
                  duration: 0.7,
                  delay: p.delay,
                  ease: "easeOut",
                }}
                className="absolute rounded-full"
                style={{
                  width: p.size,
                  height: p.size,
                  backgroundColor: accentColor,
                }}
              />
            );
          })}
        </div>
      )}
    </AnimatePresence>
  );
}
