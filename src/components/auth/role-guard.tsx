"use client";

import { useAuthStore, type UserRole } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface RoleGuardProps {
    children: React.ReactNode;
    requiredRole?: UserRole;
    fallback?: React.ReactNode;
}

/**
 * Client-side role guard. Wraps children and only renders
 * if user has the required role. Redirects to login or shows fallback.
 */
export function RoleGuard({ children, requiredRole = "user", fallback }: RoleGuardProps) {
    const { isAuthenticated, user } = useAuthStore();
    const router = useRouter();
    const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

    useEffect(() => {
        if (!isDemoMode && !isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated, isDemoMode, router]);

    // Demo mode: always allow
    if (isDemoMode) {
        return <>{children}</>;
    }

    if (!isAuthenticated) {
        return null;
    }

    // Check role hierarchy: admin > manager > user
    const roleHierarchy: UserRole[] = ["user", "manager", "admin"];
    const userLevel = roleHierarchy.indexOf(user?.role || "user");
    const requiredLevel = roleHierarchy.indexOf(requiredRole);

    if (userLevel < requiredLevel) {
        return (
            fallback || (
                <div className="text-center py-20">
                    <div className="text-5xl mb-4">🔒</div>
                    <h2 className="text-brand-navy mb-2">Zugriff verweigert</h2>
                    <p className="text-muted-foreground text-sm">
                        Diese Seite erfordert die Rolle <strong>{requiredRole}</strong>.
                    </p>
                </div>
            )
        );
    }

    return <>{children}</>;
}
