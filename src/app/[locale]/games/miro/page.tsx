"use client";

import { RoleGuard } from "@/components/auth/role-guard";
import { MiroBoard } from "@/components/interactive/miro-board";

// The AppShell is configured to not wrap this route in the main layout (FULLSCREEN_ROUTES = ["/games/miro"]).
// So this page will take the full screen width and height natively.
export default function MiroBoardPage() {
    return (
        <RoleGuard requiredRole="user">
            {/* The actual fullscreen canvas tool */}
            <MiroBoard />
        </RoleGuard>
    );
}
