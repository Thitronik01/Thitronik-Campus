"use client";

import { RoleGuard } from "@/components/auth/role-guard";
import { KahootQuiz } from "@/components/interactive/kahoot-quiz";

export default function KahootPage() {
    return (
        <RoleGuard requiredRole="user">
            <KahootQuiz />
        </RoleGuard>
    );
}
