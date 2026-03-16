"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface LevelBadgeProps {
    currentXP: number;
    levelTitle: string;
    nextLevelXP: number;
}

export function LevelBadge({ currentXP, levelTitle, nextLevelXP }: LevelBadgeProps) {
    const progressPercent = Math.min(100, Math.max(0, (currentXP / nextLevelXP) * 100));

    return (
        <Card className="flex flex-col gap-3 p-5 border-border shadow-sm">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold text-brand-navy">{levelTitle}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">Dein aktueller Rang</p>
                </div>
                <div className="text-right">
                    <span className="text-3xl font-extrabold text-brand-sky">{currentXP}</span>
                    <span className="text-sm text-muted-foreground font-medium"> / {nextLevelXP} XP</span>
                </div>
            </div>

            <Progress value={progressPercent} className="h-2.5 mt-2 bg-muted/50" />
        </Card>
    );
}
