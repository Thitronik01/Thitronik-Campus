"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUserStore } from "@/store/user-store";

export function DailyChallenge() {
    const [isAnswered, setIsAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const addXp = useUserStore((state) => state.addXp);

    const handleAnswer = (correct: boolean) => {
        setIsAnswered(true);
        setIsCorrect(correct);
        if (correct) {
            // Direct store update + trigger popup event for visual consistency
            addXp(25);
            window.dispatchEvent(
                new CustomEvent("add-xp", {
                    detail: { amount: 25, reason: "Daily Challenge gemeistert" },
                })
            );
        }
    };

    return (
        <Card className="bg-gradient-to-br from-brand-navy to-brand-navy/95 text-white border-none relative overflow-hidden shadow-md">
            {/* Decorative Background Elements */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-brand-lime/20 rounded-full blur-xl pointer-events-none"></div>

            <div className="relative z-10 p-5 md:p-6">
                <div className="flex justify-between items-start mb-5">
                    <div className="flex items-center gap-2.5">
                        <span className="text-3xl drop-shadow-sm">⚡</span>
                        <h3 className="font-bold text-lg md:text-xl">Daily Challenge</h3>
                    </div>
                    <Badge className="bg-white/20 hover:bg-white/30 text-white border-none px-3 py-1 font-bold">
                        +25 XP
                    </Badge>
                </div>

                {!isAnswered ? (
                    <div className="animate-fade-in">
                        <p className="text-white/90 text-sm md:text-base mb-5 leading-relaxed font-medium">
                            Welche Aussage zum Einbau der WiPro III ist KORREKT?
                        </p>
                        <div className="space-y-3">
                            <button
                                onClick={() => handleAnswer(false)}
                                className="w-full text-left p-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all text-sm text-white/90 font-medium"
                            >
                                A) Das NFC-Modul muss ausserhalb des Fahrzeugs (z.B. am Spiegel) montiert werden.
                            </button>
                            <button
                                onClick={() => handleAnswer(true)}
                                className="w-full text-left p-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all text-sm text-white/90 font-medium"
                            >
                                B) Das NFC-Modul kann unsichtbar hinter GFK, Holz oder Kunststoff verbaut werden.
                            </button>
                            <button
                                onClick={() => handleAnswer(false)}
                                className="w-full text-left p-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all text-sm text-white/90 font-medium"
                            >
                                C) NFC funktioniert nur bei metallischen Außenwänden zuverlässig.
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="animate-fade-in py-4 text-center">
                        <div className={`text-6xl mb-4 ${isCorrect ? "text-brand-lime drop-shadow-md" : "text-brand-red opacity-80"}`}>
                            {isCorrect ? "🎉" : "💡"}
                        </div>
                        <h4 className="font-bold text-2xl mb-3">
                            {isCorrect ? "Perfekt!" : "Knapp daneben."}
                        </h4>
                        <p className="text-sm md:text-base text-white/80 mb-6 leading-relaxed max-w-xs mx-auto">
                            Das NFC-Pad funkt problemlos durch Kunststoff, Holz oder GFK bis ca. 10mm Stärke. Es darf NICHT auf oder hinter Blech montiert werden.
                        </p>
                        {isCorrect ? (
                            <span className="inline-block bg-brand-lime text-brand-navy font-extrabold px-5 py-2.5 rounded-full text-sm shadow-lg animate-bounce">
                                +25 XP gesichert
                            </span>
                        ) : (
                            <span className="inline-block bg-white/15 text-white/90 font-bold px-5 py-2.5 rounded-full text-sm">
                                Morgen gibt's eine neue Chance!
                            </span>
                        )}
                    </div>
                )}
            </div>
        </Card>
    );
}
