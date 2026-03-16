"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

interface MapIsland {
    id: string;
    name: string;
    icon: string;
    status: "completed" | "active" | "unlocked" | "locked";
    x: number; // Percentage
    y: number; // Percentage
    desc: string;
}

const ISLANDS: MapIsland[] = [
    { id: "poel", name: "Insel Poel", icon: "🏝️", status: "active", x: 15, y: 75, desc: "Tour starten" },
    { id: "vejroe", name: "Vejrø", icon: "⚓", status: "completed", x: 35, y: 50, desc: "WiPro III Grundlagen" },
    { id: "hiddensee", name: "Hiddensee", icon: "🌊", status: "unlocked", x: 25, y: 20, desc: "Einbau Praxis" },
    { id: "samsoe", name: "Samsø", icon: "⛵", status: "unlocked", x: 60, y: 15, desc: "Fahrzeuge & Scanner" },
    { id: "langeland", name: "Langeland", icon: "🗺️", status: "unlocked", x: 75, y: 45, desc: "Service & Avatar" },
    { id: "usedom", name: "Usedom", icon: "🔭", status: "unlocked", x: 80, y: 80, desc: "Verkauf & Konfigurator" },
    { id: "fehmarn", name: "Fehmarn", icon: "🔧", status: "unlocked", x: 50, y: 70, desc: "Diagnose-Board" },
];

export function TreasureMap() {
    const router = useRouter();

    return (
        <div className="relative w-full h-[500px] md:h-[600px] bg-gradient-to-br from-[#E0F2FE] to-[#BAE6FD] rounded-3xl overflow-hidden border border-[#7DD3FC] shadow-inner">
            {/* Fake Water / Topography background elements */}
            <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjUiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAyODRjNyIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2UtZGFzaGFycmF5PSI1LDUiIG9wYWNpdHk9IjAuMSIvPjwvc3ZnPg==')] pointer-events-none"></div>

            <div className="absolute top-4 md:top-6 left-4 md:left-6 bg-white/80 backdrop-blur-sm px-4 py-2.5 rounded-xl text-brand-navy font-bold shadow-sm z-20 flex items-center gap-2">
                Nord-Ostsee Campus <Badge className="bg-brand-sky/20 text-brand-sky hover:bg-brand-sky/30 border-none px-2 shadow-none font-extrabold text-[10px] uppercase tracking-wider">Beta-Map</Badge>
            </div>

            {/* Path connecting islands - just a decorative SVG */}
            <svg
                className="absolute inset-0 w-full h-full pointer-events-none opacity-40 text-brand-sky"
                style={{ zIndex: 1 }}
            >
                <path
                    d={`M ${15}% ${75}% C ${20}% ${65}%, ${30}% ${55}%, ${35}% ${50}% C ${30}% ${40}%, ${28}% ${30}%, ${25}% ${20}% C ${40}% ${15}%, ${50}% ${15}%, ${60}% ${15}% C ${70}% ${30}%, ${72}% ${40}%, ${75}% ${45}% C ${70}% ${60}%, ${60}% ${65}%, ${50}% ${70}% C ${60}% ${75}%, ${70}% ${78}%, ${80}% ${80}%`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray="8 8"
                    className="animate-[pulse_10s_linear_infinite]"
                />
            </svg>

            {ISLANDS.map((island) => {
                const isCompleted = island.status === "completed";
                const isActive = island.status === "active";
                const isLocked = island.status === "locked";

                return (
                    <div
                        key={island.id}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group ${isLocked ? "cursor-not-allowed opacity-60 grayscale" : "cursor-pointer hover:z-30"
                            }`}
                        style={{ left: `${island.x}%`, top: `${island.y}%`, zIndex: isActive ? 20 : 10 }}
                        onClick={() => {
                            if (!isLocked) router.push(`/module/${island.id}`);
                        }}
                    >
                        {/* Status Bubble */}
                        {isActive && (
                            <div className="absolute -top-12 animate-bounce">
                                <Badge variant="secondary" className="shadow-md bg-white text-brand-sky border-brand-sky">Hier lang!</Badge>
                            </div>
                        )}
                        {isCompleted && (
                            <div className="absolute -top-10">
                                <Badge className="shadow-lg px-2.5 py-1 border-none bg-brand-lime hover:bg-brand-lime text-brand-navy font-bold text-sm">
                                    ✓
                                </Badge>
                            </div>
                        )}

                        {/* Island Node */}
                        <div
                            className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-3xl shadow-xl border-4 transition-transform duration-300 group-hover:scale-125
                  ${isCompleted
                                    ? "bg-white border-brand-lime text-black"
                                    : isActive
                                        ? "bg-brand-sky text-white border-white animate-pulse shadow-brand-sky/50"
                                        : isLocked
                                            ? "bg-muted border-white"
                                            : "bg-white border-brand-navy text-brand-navy hover:border-brand-sky"
                                }
              `}
                        >
                            {island.icon}
                        </div>

                        {/* Label Tooltip Style */}
                        <div className="mt-3 bg-white/95 backdrop-blur-sm px-3.5 py-2 rounded-xl shadow-lg border border-border text-center transition-all opacity-90 group-hover:opacity-100 group-hover:-translate-y-2 pointer-events-none">
                            <h4 className="font-bold text-brand-navy text-sm max-md:text-xs whitespace-nowrap">{island.name}</h4>
                            <p className="text-[10px] text-muted-foreground whitespace-nowrap uppercase tracking-wider font-semibold mt-0.5">
                                {island.desc}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
