"use client";

import { RoleGuard } from "@/components/auth/role-guard";
import { SalesSimulator } from "@/components/games/sales-simulator";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SalesSimulatorPage() {
    return (
        <RoleGuard requiredRole="user">
            <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
                <div className="flex items-center gap-4 border-b border-border pb-6">
                    <Link href="/games">
                        <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 border-white/20 text-white hover:bg-white/10">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
                            <span className="text-4xl drop-shadow-sm">💼</span> Sales Simulator
                        </h1>
                        <p className="text-white/60 mt-1">
                            Trainieren Sie Ihr Verkaufsgespräch in realistischen Kundensituationen mit Fuhrparkleiter Herr Müller.
                        </p>
                    </div>
                </div>

                <div className="mt-8">
                    <SalesSimulator />
                </div>
            </div>
        </RoleGuard>
    );
}
