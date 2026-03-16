"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUserStore } from "@/store/user-store";

// Mock Hotspot Interface
interface Hotspot {
    id: string;
    x: number;
    y: number;
    label: string;
    isCorrect: boolean;
    feedback: string;
}

const HIGHLIGHT_HOTSPOTS: Hotspot[] = [
    {
        id: "1",
        x: 25,
        y: 70,
        label: "Bodenblech Karosserie (Korrekt)",
        isCorrect: true,
        feedback:
            "Korrekt! Das Bodenblech oder die Gurtverschraubung sind ideale Massepunkte, da Karosserieteile den besten Kontakt bieten.",
    },
    {
        id: "2",
        x: 60,
        y: 30,
        label: "Plastikverkleidung C-Säule",
        isCorrect: false,
        feedback: "Falsch. Plastikverkleidungen leiten nicht und sind als Massepunkt ungeeignet.",
    },
    {
        id: "3",
        x: 80,
        y: 80,
        label: "Schraube Rückleuchte",
        isCorrect: false,
        feedback:
            "Risiko: Schlechter Kontakt oder Störeinstrahlung der Fahrzeugelektronik. Besser direkt an die Fahrzeugmasse gehen.",
    },
];

export function HotspotQuiz() {
    const [selectedHotspots, setSelectedHotspots] = useState<string[]>([]);
    const [xpEarned, setXpEarned] = useState(0);
    const addXp = useUserStore((state) => state.addXp);

    const handleHotspotClick = (hotspot: Hotspot) => {
        if (selectedHotspots.includes(hotspot.id)) return;

        setSelectedHotspots((prev) => [...prev, hotspot.id]);

        if (hotspot.isCorrect && xpEarned === 0) {
            setXpEarned(20);
            addXp(20);
        }
    };

    return (
        <Card className="border-border bg-white group p-0 overflow-hidden relative w-full max-w-4xl mx-auto">
            <div className="p-6 md:p-8 border-b border-border flex justify-between items-center bg-muted/30">
                <div>
                    <Badge variant="secondary" className="mb-3 bg-brand-sky/10 text-brand-sky hover:bg-brand-sky/20">
                        Interaktive Grafik (H5P-Style)
                    </Badge>
                    <h3 className="text-2xl font-bold text-brand-navy">Wo ist der richtige Massepunkt?</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Wählen Sie den perfekten Massepunkt für das Einbau-Szenario.
                    </p>
                </div>
                <div className="text-right hidden sm:block">
                    <span className="text-lg text-brand-sky font-extrabold">+20 XP</span>
                    <span className="block text-xs text-muted-foreground font-medium">3 Versuche übrig</span>
                </div>
            </div>

            {/* Interaktiver Bildbereich (Fake Background) */}
            <div className="relative w-full h-96 bg-brand-navy overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-sky/20 to-brand-navy"></div>

                {/* Platzhalter-Fahrzeuggrafik */}
                <div className="absolute inset-0 opacity-20 pointer-events-none flex flex-col items-center justify-center">
                    <div className="w-64 h-32 border-4 border-white rounded-t-full mb-4"></div>
                    <div className="w-96 h-24 border-4 border-white rounded-lg flex justify-between px-8">
                        <div className="w-16 h-16 border-4 border-white rounded-full -mb-8 self-end bg-brand-navy"></div>
                        <div className="w-16 h-16 border-4 border-white rounded-full -mb-8 self-end bg-brand-navy"></div>
                    </div>
                </div>

                <span className="text-white/40 text-2xl font-extrabold tracking-widest relative z-10">
                    [FAHRZEUG-HECK]
                </span>

                {/* Render Hotspots */}
                {HIGHLIGHT_HOTSPOTS.map((hotspot) => {
                    const isSelected = selectedHotspots.includes(hotspot.id);
                    const isCorrect = hotspot.isCorrect;

                    return (
                        <button
                            key={hotspot.id}
                            onClick={() => handleHotspotClick(hotspot)}
                            className={`absolute w-14 h-14 -ml-7 -mt-7 rounded-full flex items-center justify-center transition-all z-20 ${isSelected
                                ? isCorrect
                                    ? "bg-brand-lime scale-110 shadow-lg text-brand-navy animate-pulse"
                                    : "bg-brand-red scale-90 opacity-80 text-white"
                                : "bg-brand-sky/80 hover:bg-brand-sky hover:scale-110 text-white shadow-xl ring-4 ring-white/30 cursor-pointer animate-float"
                                }`}
                            style={{ top: `${hotspot.y}%`, left: `${hotspot.x}%` }}
                        >
                            {isSelected ? (isCorrect ? "✓" : "✗") : "?"}
                        </button>
                    );
                })}
            </div>

            {/* Feedback Bereich */}
            <CardContent className="p-6 md:p-8 min-h-[160px] bg-muted/10">
                {selectedHotspots.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
                        <div className="text-4xl opacity-50">👆</div>
                        <p className="text-muted-foreground italic font-medium">
                            Klicken Sie auf ein Plus-Symbol im Bild, um einen Punkt zu validieren.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {selectedHotspots.map((id) => {
                            const hotspot = HIGHLIGHT_HOTSPOTS.find((h) => h.id === id);
                            if (!hotspot) return null;

                            return (
                                <div
                                    key={id}
                                    className={`p-4 rounded-xl flex items-start gap-4 animate-fade-in border shadow-sm ${hotspot.isCorrect
                                        ? "bg-brand-lime/10 border-brand-lime/30"
                                        : "bg-brand-red/5 border-brand-red/20"
                                        }`}
                                >
                                    <div className="mt-1 text-3xl">{hotspot.isCorrect ? "✅" : "⚠️"}</div>
                                    <div className="flex-1">
                                        <h4
                                            className={`font-bold text-base mb-1 ${hotspot.isCorrect ? "text-brand-navy" : "text-brand-red"
                                                }`}
                                        >
                                            {hotspot.label}
                                        </h4>
                                        <p
                                            className={`text-sm leading-relaxed ${hotspot.isCorrect ? "text-foreground" : "text-muted-foreground"
                                                }`}
                                        >
                                            {hotspot.feedback}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}

                        {xpEarned > 0 && (
                            <div className="pt-4 text-center animate-fade-in">
                                <Badge className="text-base px-8 py-3 shadow-md bg-brand-lime hover:bg-brand-lime text-brand-navy border-none">
                                    Super gelöst! +{xpEarned} XP erhalten.
                                </Badge>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
