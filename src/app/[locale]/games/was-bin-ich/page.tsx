"use client";

import { PremiumBackground } from "@/components/layout/premium-background";
import { RoleGuard } from "@/components/auth/role-guard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { WasBinIchGame } from "./components/WasBinIchGame";

export default function WasBinIchPage() {
    const t = useTranslations("games.wasBinIch");

    return (
        <RoleGuard requiredRole="user">
            <PremiumBackground>
                <div className="max-w-2xl mx-auto space-y-8 animate-fade-in p-4 md:p-8 pb-20">
                    <div className="flex items-center gap-4 border-b border-border/30 pb-6">
                        <Link href="/games">
                            <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 border-white/20 text-white hover:bg-white/10">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
                                <span className="text-4xl drop-shadow-sm">❓</span> {t("title")}
                            </h1>
                            <p className="text-white/60 mt-1">
                                {t("subtitle")}
                            </p>
                        </div>
                    </div>

                    <div className="mt-8">
                        <WasBinIchGame />
                    </div>
                </div>
            </PremiumBackground>
        </RoleGuard>
    );
}
