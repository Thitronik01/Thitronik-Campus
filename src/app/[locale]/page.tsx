"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useUserStore } from "@/store/user-store";
import { EventSchedule } from "@/components/dashboard/event-schedule";
import { QRScannerCard } from "@/components/dashboard/qr-scanner-card";
import { CustomerFeedbackCard } from "@/components/dashboard/customer-feedback-card";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { QrCode } from "lucide-react";

import { PremiumBackground } from "@/components/layout/premium-background";
import { ChronikPreviewCard } from "@/components/chronik/chronik-preview-card";

const ISLANDS = [
  { id: "poel", name: "Poel", icon: "🏝️", xp: 50, status: "completed", desc: "Onboarding & Plattform-Tour" },
  { id: "vejroe", name: "Vejrø", icon: "⚓", xp: 100, status: "completed", desc: "Produktschulung WiPro III" },
  { id: "hiddensee", name: "Hiddensee", icon: "🌊", xp: 150, status: "active", desc: "Einbau-Praxis" },
  { id: "samsoe", name: "Samsø", icon: "⛵", xp: 150, status: "locked", desc: "Basisfahrzeuge" },
  { id: "langeland", name: "Langeland", icon: "🗺️", xp: 100, status: "locked", desc: "Beratung & Service" },
  { id: "usedom", name: "Usedom", icon: "🔭", xp: 120, status: "locked", desc: "Konfigurator-Training" },
  { id: "fehmarn", name: "Fehmarn", icon: "🔧", xp: 120, status: "locked", desc: "Support & Fehleranalyse" },
];

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function DashboardPage() {
  const { name, level, levelName, xp, xpToNext } = useUserStore();
  const xpPct = Math.min(100, Math.round((xp / xpToNext) * 100));
  const t = useTranslations("Index");

  return (
    <PremiumBackground>
      <motion.div variants={fadeUp} className="p-4 md:p-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column (Check-in Action) */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div variants={fadeUp}>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg" className="w-full h-24 bg-gradient-to-br from-brand-navy to-brand-navy/80 hover:from-brand-navy/95 hover:to-brand-navy/75 text-white shadow-xl flex flex-col items-center justify-center gap-2 group transition-all hover:scale-[1.02] accent-bar-left border border-white/10">
                    <QrCode className="w-8 h-8 text-brand-sky group-hover:scale-110 transition-transform" />
                    <span className="text-xl font-black tracking-tight">Event Check-in</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md p-0 overflow-hidden border-none bg-transparent shadow-none">
                  <DialogHeader className="sr-only">
                    <DialogTitle>Event Check-in</DialogTitle>
                    <DialogDescription>
                      Scannen Sie einen QR-Code oder geben Sie einen Code ein, um am Event teilzunehmen.
                    </DialogDescription>
                  </DialogHeader>
                  <QRScannerCard />
                </DialogContent>
              </Dialog>
            </motion.div>

            <motion.div variants={fadeUp}>
              <Link href="/community">
                <Button size="lg" className="w-full h-24 bg-gradient-to-br from-brand-navy to-brand-navy/80 hover:from-brand-navy/95 hover:to-brand-navy/75 text-white shadow-xl flex flex-col items-center justify-center gap-2 group transition-all hover:scale-[1.02] accent-bar-left border border-white/10">
                  <span className="text-2xl group-hover:scale-110 transition-transform">💬</span>
                  <span className="text-xl font-black tracking-tight">Community Chat</span>
                </Button>
              </Link>
            </motion.div>

            <motion.div variants={fadeUp}>
              <Link href="/ansprechpartner">
                <Button size="lg" className="w-full h-24 bg-gradient-to-br from-brand-navy to-brand-navy/80 hover:from-brand-navy/95 hover:to-brand-navy/75 text-white shadow-xl flex flex-col items-center justify-center gap-2 group transition-all hover:scale-[1.02] accent-bar-left border border-white/10">
                  <span className="text-2xl group-hover:scale-110 transition-transform">👤</span>
                  <span className="text-xl font-black tracking-tight">Ansprechpartner</span>
                </Button>
              </Link>
            </motion.div>

            <motion.div variants={fadeUp}>
              <Link href="/haendler">
                <Button size="lg" className="w-full h-24 bg-gradient-to-br from-brand-navy to-brand-navy/80 hover:from-brand-navy/95 hover:to-brand-navy/75 text-white shadow-xl flex flex-col items-center justify-center gap-2 group transition-all hover:scale-[1.02] accent-bar-left border border-white/10">
                  <span className="text-2xl group-hover:scale-110 transition-transform">🗺️</span>
                  <span className="text-xl font-black tracking-tight">Unsere Händler</span>
                </Button>
              </Link>
            </motion.div>

            <motion.div variants={fadeUp}>
              <Link href="/lageplan">
                <Button size="lg" className="w-full h-24 bg-gradient-to-br from-brand-navy to-brand-navy/80 hover:from-brand-navy/95 hover:to-brand-navy/75 text-white shadow-xl flex flex-col items-center justify-center gap-2 group transition-all hover:scale-[1.02] accent-bar-left border border-white/10">
                  <span className="text-2xl group-hover:scale-110 transition-transform">🏢</span>
                  <span className="text-xl font-black tracking-tight">THITRONIK Lageplan</span>
                </Button>
              </Link>
            </motion.div>

            <ChronikPreviewCard count={5} />
          </div>

          {/* Right Column (Focus: Event Schedule) */}
          <div className="lg:col-span-3">
            <motion.div variants={fadeUp}>
              <EventSchedule />
            </motion.div>
          </div>
        </div>

        {/* Full-width Customer Feedback Section */}
        <motion.div variants={fadeUp}>
          <CustomerFeedbackCard />
        </motion.div>
      </motion.div>
    </PremiumBackground>
  );
}
