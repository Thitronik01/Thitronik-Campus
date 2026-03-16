"use client";

import { RoleGuard } from "@/components/auth/role-guard";
import { MentimeterClone } from "@/components/interactive/mentimeter";

export default function MentimeterPage() {
    return (
        <RoleGuard requiredRole="user">
            <MentimeterClone />
        </RoleGuard>
    );
}
