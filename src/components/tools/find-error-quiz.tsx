"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, RefreshCcw, Hand } from "lucide-react";

// The generated background image for the wiring diagram
const DIAGRAM_SRC = "/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fwiring_diagram_error_1772976138497.png&w=1920&q=75"; // We'll put the real path once copied to public or via direct import. In next.js we can serve from a URL if we want, or just require it. For simplicity we will embed the raw base64 or move the file.
// Let's use standard Next.js path if we move it, or just use the absolute file path for now since it's an MVP.
// We will use the absolute file path for the MVP:
const IMAGE_URL = "/wiring_diagram_error.png";

interface Hotspot {
    id: string;
    x: number; // percentage (0-100)
    y: number; // percentage (0-100)
    width: number; // percentage
    height: number; // percentage
    isError: boolean;
    description: string;
}

const HOTSPOTS: Hotspot[] = [
    {
        id: "error-1",
        x: 65, y: 35, width: 8, height: 8,
        isError: true,
        description: "Fehler gefunden: Das Massekabel (schwarz) wurde an den Pluspol der Zentrale angeschlossen!"
    },
    {
        id: "error-2",
        x: 25, y: 70, width: 10, height: 10,
        isError: true,
        description: "Fehler gefunden: Der CAN-Bus Stecker steckt im falschen Port (Sirenenausgang)."
    },
    {
        id: "decoy-1",
        x: 40, y: 40, width: 15, height: 15,
        isError: false,
        description: "Das ist die WiPro III Zentrale. Hier sieht alles gut aus."
    },
    {
        id: "decoy-2",
        x: 80, y: 80, width: 12, height: 12,
        isError: false,
        description: "Das ist die Fahrzeugbatterie. Verkabelung scheint intakt."
    }
];

export function FindErrorQuiz() {
    const [foundErrors, setFoundErrors] = useState<string[]>([]);
    const [clickedDecoys, setClickedDecoys] = useState<string[]>([]);
    const [activeFeedback, setActiveFeedback] = useState<{ message: string, isErrorDesc: boolean } | null>(null);

    const totalErrors = HOTSPOTS.filter(h => h.isError).length;
    const isComplete = foundErrors.length === totalErrors;

    const handleHotspotClick = (hotspot: Hotspot) => {
        if (hotspot.isError) {
            if (!foundErrors.includes(hotspot.id)) {
                setFoundErrors([...foundErrors, hotspot.id]);
                setActiveFeedback({ message: hotspot.description, isErrorDesc: true });
            }
        } else {
            if (!clickedDecoys.includes(hotspot.id)) {
                setClickedDecoys([...clickedDecoys, hotspot.id]);
                setActiveFeedback({ message: hotspot.description, isErrorDesc: false });
            }
        }
    };

    const resetQuiz = () => {
        setFoundErrors([]);
        setClickedDecoys([]);
        setActiveFeedback(null);
    };

    return (
        <Card className="border-border shadow-md">
            <CardHeader className="bg-brand-navy text-white rounded-t-xl pb-6">
                <div className="flex justify-between items-start">
                    <div>
                        <Badge className="mb-2 bg-brand-red text-white border-none hover:bg-brand-red/80">Fehlersuche</Badge>
                        <CardTitle className="text-2xl text-white">Finde den Fehler</CardTitle>
                        <CardDescription className="text-white/70 mt-1">
                            Klicken Sie auf die verdächtigen Stellen im Schaltplan. Finden Sie alle {totalErrors} Einbaufehler.
                        </CardDescription>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold text-brand-lime">{foundErrors.length} / {totalErrors}</div>
                        <div className="text-sm text-white/70 uppercase tracking-wider">Gefunden</div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0 border-b border-border relative bg-black/5" style={{ minHeight: '400px' }}>

                {/* Image Container with relative positioning for hotspots */}
                <div className="relative w-full overflow-hidden bg-slate-900 group">
                    <img
                        src={IMAGE_URL}
                        alt="Schaltplan"
                        className="w-full h-auto max-h-[600px] object-contain object-center opacity-90 transition-opacity"
                    />

                    {/* Overlay Instruction */}
                    {foundErrors.length === 0 && clickedDecoys.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                            <div className="bg-black/60 text-white px-6 py-3 rounded-full backdrop-blur-md flex items-center gap-3 animate-pulse">
                                <Hand className="w-5 h-5 text-brand-sky" />
                                Klicken Sie auf Fehler im Bild
                            </div>
                        </div>
                    )}

                    {/* Hotspot Render Loop */}
                    {HOTSPOTS.map((hotspot) => {
                        const isFoundError = foundErrors.includes(hotspot.id);
                        const isClickedDecoy = clickedDecoys.includes(hotspot.id);

                        return (
                            <div
                                key={hotspot.id}
                                onClick={() => handleHotspotClick(hotspot)}
                                className={`absolute cursor-pointer transition-all duration-300 border-2 rounded-lg z-20 hover:bg-white/10
                                    ${isFoundError ? 'border-brand-lime bg-brand-lime/20' : ''}
                                    ${isClickedDecoy ? 'border-amber-400 bg-amber-400/20' : ''}
                                    ${!isFoundError && !isClickedDecoy ? 'border-transparent hover:border-brand-sky/50' : ''}
                                `}
                                style={{
                                    left: `${hotspot.x}%`,
                                    top: `${hotspot.y}%`,
                                    width: `${hotspot.width}%`,
                                    height: `${hotspot.height}%`,
                                }}
                            >
                                {/* Indicator Dot (only show when found or debug mode) */}
                                {(isFoundError || isClickedDecoy) && (
                                    <div className="absolute -top-3 -right-3 bg-background rounded-full p-0.5 shadow-md">
                                        {isFoundError ? (
                                            <CheckCircle2 className="w-6 h-6 text-brand-lime bg-brand-navy rounded-full" />
                                        ) : (
                                            <AlertCircle className="w-6 h-6 text-amber-500 bg-brand-navy rounded-full" />
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </CardContent>

            <CardContent className="p-6 bg-card flex flex-col sm:flex-row justify-between items-center gap-4">

                <div className="flex-1">
                    {activeFeedback ? (
                        <div className={`p-4 rounded-xl text-sm md:text-base font-medium border flex items-start gap-3 w-full
                            ${activeFeedback.isErrorDesc
                                ? 'bg-brand-lime/10 border-brand-lime/30 text-foreground dark:text-brand-lime'
                                : 'bg-muted border-border text-muted-foreground'}`
                        }>
                            {activeFeedback.isErrorDesc ? <CheckCircle2 className="w-5 h-5 shrink-0 text-brand-lime mt-0.5" /> : <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />}
                            {activeFeedback.message}
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-sm italic">
                            Untersuchen Sie den Plan sorgfältig. Es gibt {totalErrors} versteckte Fehlerquellen, die in der Praxis oft zu Supportfällen führen.
                        </p>
                    )}
                </div>

                <div className="flex gap-3 w-full sm:w-auto shrink-0 mt-4 sm:mt-0">
                    <Button variant="outline" onClick={resetQuiz} className="gap-2">
                        <RefreshCcw className="w-4 h-4" /> Neustart
                    </Button>
                    {isComplete && (
                        <Button className="bg-brand-lime text-brand-navy hover:bg-brand-lime/90 font-bold">
                            Modul Abschließen (+100 XP)
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
