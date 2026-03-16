"use client";

import { RoleGuard } from "@/components/auth/role-guard";
import { FindErrorQuiz } from "@/components/tools/find-error-quiz";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function FindErrorQuizPage() {
    return (
        <RoleGuard requiredRole="user">
            <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
                <div className="flex items-center gap-4 border-b border-border pb-6">
                    <Link href="/tools">
                        <Button variant="outline" size="icon" className="h-10 w-10 shrink-0">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-3 text-brand-navy">
                            <span className="text-4xl drop-shadow-sm">🔍</span> Finde den Fehler
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Interaktives Training zur Fehlerdiagnose und Schaltplan-Analyse
                        </p>
                    </div>
                </div>

                <div className="mt-8">
                    {/* The Hotspot Tool created previously */}
                    <FindErrorQuiz />
                </div>
            </div>
        </RoleGuard>
    );
}
