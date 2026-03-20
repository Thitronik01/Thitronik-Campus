"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface ChronikPreviewCardProps {
  count: number;
}

export function ChronikPreviewCard({ count }: { count: number }) {
  const t = useTranslations("Chronik");

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <Link href="/chronik" className="block w-full">
        <Button
          size="lg"
          className="w-full h-24 bg-gradient-to-br from-brand-navy to-brand-navy/80 hover:from-brand-navy/95 hover:to-brand-navy/75 text-white shadow-xl flex flex-col items-center justify-center gap-1 group transition-all hover:scale-[1.02] accent-bar-left border border-white/10"
        >
          <span className="text-2xl group-hover:scale-110 transition-transform">📸</span>
          <div className="flex flex-col items-center">
            <span className="text-xl font-black tracking-tight leading-none">{t("title")}</span>
            <span className="text-[10px] uppercase tracking-widest text-brand-sky font-bold opacity-80 mt-1">
              {t("subtitle", { count })}
            </span>
          </div>
        </Button>
      </Link>
    </motion.div>
  );
}
