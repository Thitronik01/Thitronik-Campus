"use client";

import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserStore } from "@/store/user-store";
import { useAuthStore, isAdmin, isManager } from "@/store/auth-store";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";

export function ProfileDropdown() {
    const router = useRouter();
    const t = useTranslations("Navigation");
    const { name: gameName, level, levelName, xp, xpToNext } = useUserStore();
    const { user: authUser, isAuthenticated, logout } = useAuthStore();

    const displayName = authUser?.name || gameName;
    const displayRole = authUser?.role || "user";
    const initials = displayName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
    const xpPct = Math.min(100, Math.round((xp / xpToNext) * 100));

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 hover:bg-white/10 rounded-lg px-2 py-1 transition-colors">
                    <Avatar className="h-8 w-8 border-2 border-brand-sky/50">
                        <AvatarFallback className="bg-brand-sky/20 text-white text-xs font-bold">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                        <div className="text-xs font-bold leading-none">{displayName}</div>
                        <div className="flex items-center gap-1 mt-0.5">
                            <span className="status-dot" />
                            <span className="text-[10px] text-brand-sky">
                                {isAuthenticated ? `${displayRole.toUpperCase()}` : ""}
                                {!isAdmin(authUser) && !isManager(authUser) && ` · Lvl ${level}: ${levelName}`}
                            </span>
                        </div>
                    </div>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="pb-3">
                    <div className="text-sm font-bold text-brand-navy">{displayName}</div>
                    {authUser && (
                        <Badge variant="secondary" className="text-[9px] mt-1">
                            {authUser.role} · {authUser.company}
                        </Badge>
                    )}
                    {!isAdmin(authUser) && !isManager(authUser) && (
                        <>
                            <div className="text-xs text-muted-foreground mt-1.5">
                                Level {level}: {levelName} · {xp}/{xpToNext} XP
                            </div>
                            <Progress value={xpPct} className="mt-2 h-1.5" />
                        </>
                    )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/profile">👤 {t("profile")}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/profile/kalender">📅 {t("my_calendar")}</Link>
                </DropdownMenuItem>
                {!isAdmin(authUser) && !isManager(authUser) && (
                    <DropdownMenuItem asChild>
                        <Link href="/certificates">🪪 {t("certificates")}</Link>
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                    <Link href="/settings">⚙️ {t("user_settings")}</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
                    🚪 {t("logout")}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
