"use client";

import { RoleGuard } from "@/components/auth/role-guard";
import { ThitronikMemory } from "@/components/tools/thitronik-memory";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function MemoryQuizPage() {
    return (
        <RoleGuard requiredRole="user">
            <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-20">
                <div className="flex items-center gap-4 border-b border-border pb-6">
                    <Link href="/tools">
                        <Button aria-label="Zurück" variant="outline" size="icon" className="h-10 w-10 shrink-0">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-3 text-brand-navy">
                            <span className="text-4xl drop-shadow-sm">🧠</span> THITRONIK-Memory
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Spielerisches Erlernen von Unternehmenswissen. Finde alle passenden Paare!
                        </p>
                    </div>
                </div>

                <div className="mt-8" style={{ height: 'calc(100vh - 250px)', minHeight: '600px' }}>
                    {/* The Memory Tool created previously */}
                    <ThitronikMemory />
                </div>
            </div>
        </RoleGuard>
    );
}
