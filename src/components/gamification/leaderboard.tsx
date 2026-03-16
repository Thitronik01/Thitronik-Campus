"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const LEADERBOARD_DATA = [
    { rank: 1, name: "Reisemobil Center K.", region: "NRW", xp: 12450, trend: "up" },
    { rank: 2, name: "Freizeit-Service G.", region: "Bayern", xp: 11800, trend: "same" },
    { rank: 3, name: "Camper-World (CH)", region: "Schweiz", xp: 10950, trend: "up" },
    { rank: 4, name: "Ostsee Caravans", region: "SH", xp: 9800, trend: "down" },
    { rank: 5, name: "Dein Autohaus", region: "Hessen", xp: 8200, trend: "same" },
];

export function Leaderboard() {
    return (
        <Card className="p-0 overflow-hidden bg-background border-border h-full flex flex-col shadow-sm">
            <div className="p-5 border-b border-border bg-muted/30 flex justify-between items-center">
                <div>
                    <Badge variant="secondary" className="mb-1.5 text-[10px] py-0.5 px-2 bg-brand-sky/10 text-brand-sky hover:bg-brand-sky/20">
                        Gamification Liga
                    </Badge>
                    <h3 className="font-bold text-brand-navy flex items-center gap-2">
                        <span className="text-xl">🏆</span> DACH Top 5
                    </h3>
                </div>
                <span className="text-xs text-muted-foreground underline cursor-pointer hover:text-brand-navy transition-colors">
                    Eigene Region ansehen
                </span>
            </div>

            <div className="flex-1 p-2">
                <table className="w-full text-left text-sm">
                    <tbody>
                        {LEADERBOARD_DATA.map((dealer, idx) => (
                            <tr
                                key={dealer.name}
                                className={`group transition-colors rounded-lg overflow-hidden ${idx < 3 ? "hover:bg-brand-lime/10" : "hover:bg-muted/50"
                                    } ${idx !== LEADERBOARD_DATA.length - 1 ? "border-b border-border/50" : ""}`}
                            >
                                <td className="py-3 px-3 w-10 text-center">
                                    <span
                                        className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-bold text-xs ${idx === 0
                                                ? "bg-yellow-400 text-white shadow-sm"
                                                : idx === 1
                                                    ? "bg-slate-300 text-slate-700 shadow-sm"
                                                    : idx === 2
                                                        ? "bg-amber-600 text-white shadow-sm"
                                                        : "text-muted-foreground bg-muted"
                                            }`}
                                    >
                                        {dealer.rank}
                                    </span>
                                </td>
                                <td className="py-3 px-2">
                                    <div className="font-bold text-foreground group-hover:text-brand-navy transition-colors">
                                        {dealer.name}
                                    </div>
                                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">
                                        {dealer.region}
                                    </div>
                                </td>
                                <td className="py-3 px-3 text-right">
                                    <div className="font-extrabold text-brand-sky">{dealer.xp.toLocaleString()}</div>
                                    <div className="text-[10px] text-muted-foreground font-medium">XP</div>
                                </td>
                                <td className="py-3 pr-4 pl-2 text-center w-8">
                                    {dealer.trend === "up" && <span className="text-brand-lime font-bold text-xs">↑</span>}
                                    {dealer.trend === "down" && <span className="text-brand-red font-bold text-xs">↓</span>}
                                    {dealer.trend === "same" && <span className="text-muted-foreground font-bold text-xs">-</span>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="p-4 border-t border-border bg-muted/20 text-center">
                <p className="text-xs text-muted-foreground">
                    Dein Rang: <strong className="text-brand-navy font-bold">#42</strong> (Noch 450 XP für die Top 20)
                </p>
            </div>
        </Card>
    );
}
