"use client";

import { PremiumBackground } from "@/components/layout/premium-background";
import { RoleGuard } from "@/components/auth/role-guard";

export default function HaendlerKartePage() {
    return (
        <RoleGuard requiredRole="user">
            <PremiumBackground blurAmount="0px" overlayOpacity="bg-brand-navy/0">
                <div className="w-full h-screen flex flex-col">
                    <iframe
                        src="/haendler-karte.html"
                        className="flex-1 w-full border-0"
                        title="THITRONIK Händlernetz Karte"
                        style={{ minHeight: "calc(100vh - 64px)" }}
                    />
                </div>
            </PremiumBackground>
        </RoleGuard>
    );
}
