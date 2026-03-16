"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUserStore } from "@/store/user-store";

// Mock Product Database
const PRODUCTS = [
    { id: "p1", name: "WiPro III", category: "Zentrale", icon: "🔋", price: 349 },
    { id: "p2", name: "Pro-finder", category: "Ortung", icon: "📡", price: 299 },
    { id: "p3", name: "Funk-Magnetkontakt", category: "Sensor", icon: "🧲", price: 79 },
    { id: "p4", name: "Funk-Gaswarner", category: "Sensor", icon: "💨", price: 119 },
    { id: "p5", name: "Funk-Kabelschleife", category: "Zubehör", icon: "🚲", price: 59 },
];

export function SalesAvatarSimulator() {
    const [cart, setCart] = useState<string[]>([]);
    const [showFeedback, setShowFeedback] = useState(false);
    const addXp = useUserStore((state) => state.addXp);

    const REQUIRED_PRODUCTS = ["p1", "p2", "p4", "p5"]; // Expected cart for this persona

    const toggleCart = (id: string) => {
        setCart((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
        setShowFeedback(false);
    };

    const getScore = () => {
        let correct = 0;
        cart.forEach((id) => {
            if (REQUIRED_PRODUCTS.includes(id)) correct++;
        });
        const missed = REQUIRED_PRODUCTS.length - correct;
        const wrong = cart.length - correct;
        return {
            correct,
            missed,
            wrong,
            isPerfect: correct === REQUIRED_PRODUCTS.length && wrong === 0,
        };
    };

    const score = getScore();

    const handleFinish = () => {
        setShowFeedback(true);
        if (score.isPerfect) {
            addXp(150);
        }
    };

    return (
        <Card className="border-border p-0 overflow-hidden bg-gradient-to-br from-background to-muted/30 w-full max-w-5xl mx-auto shadow-sm">
            <div className="p-6 md:p-8 border-b border-border flex justify-between items-center bg-background">
                <div>
                    <Badge variant="secondary" className="mb-3 bg-brand-lime/20 text-brand-navy hover:bg-brand-lime/30">
                        Sales Simulator 3000
                    </Badge>
                    <h3 className="text-2xl font-bold text-brand-navy">Kundenberatung am Avatar</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Wählen Sie die passenden THITRONIK-Komponenten für diesen Kundenbedarf.
                    </p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row">
                {/* Avatar Area */}
                <div className="lg:w-2/5 p-8 border-r border-border bg-background flex flex-col items-center text-center">
                    <div className="relative mb-8">
                        <div className="w-40 h-40 bg-muted/50 rounded-full border-4 border-background shadow-xl flex items-center justify-center text-7xl">
                            🧑🏼‍🦳
                        </div>
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-brand-navy text-white text-sm font-bold px-6 py-2 rounded-full shadow-md whitespace-nowrap">
                            Kunde "Thomas R."
                        </div>
                    </div>

                    <div className="bg-muted/30 p-6 rounded-3xl rounded-tl-none relative border border-border mt-4 shadow-sm text-left">
                        <span className="absolute -top-6 -left-4 text-4xl drop-shadow-sm">💬</span>
                        <p className="text-base text-foreground/90 italic leading-relaxed">
                            "Hallo! Meine Frau und ich fahren einen neuen{" "}
                            <strong className="text-brand-navy">Kastenwagen</strong>. Wir stehen oft{" "}
                            <strong className="text-brand-navy">frei in Südfrankreich</strong> und lassen auch
                            mal unsere teuren <strong className="text-brand-navy">E-Bikes vorm Auto</strong>{" "}
                            stehen. Gegen <strong className="text-brand-navy">Narkosegas</strong> wollen wir uns
                            ebenfalls absichern und wenn der Wagen doch mal gestohlen wird, möchte ich ihn{" "}
                            <strong className="text-brand-navy">orten</strong> können."
                        </p>
                    </div>
                </div>

                {/* Product Selection Area */}
                <div className="flex-1 p-8 flex flex-col bg-muted/10">
                    <div className="flex justify-between items-end mb-6">
                        <h4 className="font-bold text-brand-navy uppercase text-sm tracking-wider">
                            Verfügbare Komponenten
                        </h4>
                        <span className="text-xs text-muted-foreground bg-background px-3 py-1.5 rounded-md border shadow-sm font-medium">
                            Warenkorb: <span className="text-brand-navy font-bold">{cart.length}</span>
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                        {PRODUCTS.map((product) => {
                            const isSelected = cart.includes(product.id);
                            return (
                                <button
                                    key={product.id}
                                    onClick={() => toggleCart(product.id)}
                                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all group ${isSelected
                                        ? "border-brand-navy bg-brand-navy/5 shadow-md"
                                        : "border-border bg-background hover:border-brand-sky/40 hover:shadow-sm"
                                        }`}
                                >
                                    <div
                                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-colors shadow-inner ${isSelected
                                            ? "bg-brand-navy text-white"
                                            : "bg-muted text-muted-foreground group-hover:bg-brand-sky/10"
                                            }`}
                                    >
                                        {product.icon}
                                    </div>
                                    <div className="text-left flex-1">
                                        <div
                                            className={`font-bold text-base mb-0.5 ${isSelected ? "text-brand-navy" : "text-foreground"
                                                }`}
                                        >
                                            {product.name}
                                        </div>
                                        <div className="text-xs text-muted-foreground font-medium">
                                            {product.category}
                                        </div>
                                    </div>
                                    {isSelected && (
                                        <span className="text-brand-navy text-xl font-bold bg-background rounded-full w-6 h-6 flex items-center justify-center shadow-sm">
                                            ✓
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Feedback Area */}
                    <div className="mt-auto pt-4">
                        {!showFeedback ? (
                            <Button
                                size="lg"
                                onClick={handleFinish}
                                disabled={cart.length === 0}
                                className="w-full text-lg py-6"
                            >
                                Angebot prüfen & abschließen
                            </Button>
                        ) : (
                            <div
                                className={`p-6 rounded-2xl border-2 ${score.isPerfect
                                    ? "bg-brand-lime/10 border-brand-lime/30"
                                    : "bg-brand-red/5 border-brand-red/20"
                                    } animate-fade-in shadow-sm`}
                            >
                                <div className="flex gap-5 items-start">
                                    <div className="text-5xl mt-1">{score.isPerfect ? "🤝" : "🤔"}</div>
                                    <div className="flex-1">
                                        <h4
                                            className={`text-xl font-bold mb-2 ${score.isPerfect ? "text-brand-navy" : "text-brand-red"
                                                }`}
                                        >
                                            {score.isPerfect
                                                ? "Abschluss erfolgreich! Kunde kauft."
                                                : "Angebot suboptimal! Kunde zögert."}
                                        </h4>
                                        <p className="text-sm text-foreground/80 mb-4 leading-relaxed">
                                            {score.isPerfect
                                                ? "Perfektes Cross-Selling! E-Bikes sind per Schleife gesichert, Gaswarner schützt vor Narkosegas und Pro-finder sichert den Kastenwagen in Südfrankreich."
                                                : `Sie haben ${score.correct} von ${REQUIRED_PRODUCTS.length
                                                } wichtigen Komponenten angeboten. ${score.missed > 0 ? "Es fehlen elementare Kundenwünsche." : ""
                                                } ${score.wrong > 0 ? "Sie haben Unnötiges angeboten." : ""
                                                }`}
                                        </p>
                                        {!score.isPerfect && (
                                            <Button
                                                variant="outline"
                                                onClick={() => setShowFeedback(false)}
                                            >
                                                Angebot nachbessern
                                            </Button>
                                        )}
                                    </div>
                                    {score.isPerfect && (
                                        <div className="ml-auto flex items-center justify-center flex-col shrink-0 sm:flex-row gap-1 font-bold text-brand-navy bg-brand-lime px-4 py-2 rounded-full shadow-sm text-lg">
                                            <span>+150</span> <span className="text-xs uppercase">XP</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
}
