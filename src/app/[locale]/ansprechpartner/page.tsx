"use client";

import { AnsprechpartnerChat } from "@/components/community/ansprechpartner-chat";
import { PremiumBackground } from "@/components/layout/premium-background";
import { RoleGuard } from "@/components/auth/role-guard";

export default function AnsprechpartnerPage() {
    return (
        <RoleGuard requiredRole="user">
            <PremiumBackground blurAmount="10px" overlayOpacity="bg-brand-navy/40">
                <div className="container mx-auto py-6 px-4 max-w-4xl">
                    <AnsprechpartnerChat />
                </div>
            </PremiumBackground>
        </RoleGuard>
    );
}
