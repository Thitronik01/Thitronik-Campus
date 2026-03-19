"use client";

// src/app/[locale]/games/join/page.tsx
// Join flow: enter room code → resolve game → redirect to game with room params

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { PremiumBackground } from "@/components/layout/premium-background";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogIn, QrCode } from "lucide-react";
import Link from "next/link";
import { resolveGameFromRoom } from "@/lib/multiplayer/roomUtils";

export default function JoinGamePage() {
    const t = useTranslations("games.join");
    const router = useRouter();
    const [code, setCode] = useState("");
    const [error, setError] = useState("");

    const handleJoin = () => {
        const trimmed = code.trim().toUpperCase();
        if (trimmed.length < 4) {
            setError("Code zu kurz");
            return;
        }

        const gameId = resolveGameFromRoom(trimmed);
        if (!gameId) {
            setError("Raum nicht gefunden. Prüfe den Code.");
            return;
        }

        setError("");
        router.push(`/games/${gameId}?room=${trimmed}&role=participant`);
    };

    return (
        <PremiumBackground>
            <div className="container mx-auto py-8 flex flex-col items-center justify-center min-h-[70vh]">
                {/* Back Button */}
                <div className="w-full max-w-md mb-8">
                    <Link href="/games">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-10 w-10 border-white/20 text-white hover:bg-white/10"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl"
                >
                    {/* Header */}
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", delay: 0.1 }}
                            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-lime/20 mb-4"
                        >
                            <LogIn className="w-8 h-8 text-brand-lime" />
                        </motion.div>
                        <h1 className="text-3xl font-black text-white mb-2">
                            {t("title")}
                        </h1>
                        <p className="text-white/50 text-sm">
                            {t("enterCode")}
                        </p>
                    </div>

                    {/* Code Input */}
                    <div className="space-y-4">
                        <div>
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => {
                                    setCode(e.target.value.toUpperCase().slice(0, 6));
                                    setError("");
                                }}
                                onKeyDown={(e) => e.key === "Enter" && handleJoin()}
                                placeholder="ABC123"
                                maxLength={6}
                                autoFocus
                                className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white text-center text-3xl font-black tracking-[0.4em] placeholder-white/20 focus:outline-none focus:border-brand-lime/60 focus:ring-1 focus:ring-brand-lime/30 transition-all font-mono"
                            />
                        </div>

                        {error && (
                            <motion.p
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-400 text-sm text-center"
                            >
                                {error}
                            </motion.p>
                        )}

                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button
                                onClick={handleJoin}
                                disabled={code.trim().length < 4}
                                className="w-full py-6 text-lg font-bold bg-brand-lime text-brand-navy hover:bg-brand-lime/90 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                {t("join")} 🚀
                            </Button>
                        </motion.div>
                    </div>

                    {/* QR Alternative */}
                    <div className="mt-8 pt-6 border-t border-white/10 text-center">
                        <div className="flex items-center justify-center gap-2 text-white/40 text-sm">
                            <QrCode className="w-4 h-4" />
                            <span>Oder scanne den QR-Code am Host-Bildschirm</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </PremiumBackground>
    );
}
