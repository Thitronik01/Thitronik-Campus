"use client";

import { CommunityChat } from "@/components/community/community-chat";
import { PremiumBackground } from "@/components/layout/premium-background";
import { RoleGuard } from "@/components/auth/role-guard";

export default function CommunityPage() {
    return (
        <RoleGuard requiredRole="user">
            <PremiumBackground blurAmount="10px" overlayOpacity="bg-brand-navy/40">
                <div className="container mx-auto py-6 px-4">
                    <CommunityChat />
                </div>
            </PremiumBackground>
        </RoleGuard>
    );
}
