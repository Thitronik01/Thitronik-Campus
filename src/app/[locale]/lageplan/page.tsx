"use client";

import { PremiumBackground } from "@/components/layout/premium-background";
import { RoleGuard } from "@/components/auth/role-guard";

export default function LageplanPage() {
    return (
        <RoleGuard requiredRole="user">
            <PremiumBackground blurAmount="0px" overlayOpacity="bg-brand-navy/0">
                <div className="w-full h-screen flex flex-col">
                    <iframe
                        src="/lageplan.html"
                        className="flex-1 w-full border-0"
                        title="THITRONIK Lageplan"
                        style={{ minHeight: "calc(100vh - 64px)" }}
                    />
                </div>
            </PremiumBackground>
        </RoleGuard>
    );
}
