"use client";

import Link from "next/link";
import { usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useAuthStore, isAdmin, isManager } from "@/store/auth-store";

const NAV_ITEMS = [
    { href: "/", labelKey: "campus", icon: "🏠" },
    { href: "/modules", labelKey: "islands", icon: "🗺️" },
    { href: "/games", labelKey: "games", icon: "🧩" },
    { href: "/tools", labelKey: "tools", icon: "🛠️" },
];

export function Navigation() {
    const pathname = usePathname();
    const t = useTranslations("Navigation");
    const { user: authUser } = useAuthStore();

    return (
        <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                            pathname === item.href
                                ? "bg-brand-lime text-brand-navy shadow-sm"
                                : "text-white/60 hover:text-white hover:bg-white/5"
                        }`}
                    >
                        <span className="mr-1.5">{item.icon}</span>
                        {t(item.labelKey)}
                    </Link>
                );
            })}

            {/* THI Bot */}
            {!isAdmin(authUser) && (
                <Link
                    href="/thi"
                    className={`px-3 py-2 rounded-lg text-base font-bold transition-colors flex items-center gap-2 ${
                        pathname === "/thi"
                            ? "bg-brand-lime text-brand-navy shadow-sm"
                            : "text-brand-sky hover:text-brand-lime hover:bg-white/5"
                    }`}
                >
                    <span>🤖</span> THI
                </Link>
            )}

            {/* Manager CMS */}
            {isManager(authUser) && (
                <Link
                    href="/manager"
                    className={`px-4 py-2 rounded-lg transition-colors text-base font-medium border border-transparent flex items-center gap-2 ${
                        pathname.includes("/manager")
                            ? "bg-brand-lime text-brand-navy shadow-sm"
                            : "text-white/80 hover:text-white hover:bg-brand-sky/10"
                    }`}
                >
                    <span className={pathname.includes("/manager") ? "animate-pulse" : ""}>📋</span>
                    CMS / Inhalte
                </Link>
            )}

            {/* Admin Tools */}
            {isAdmin(authUser) && (
                <Link
                    href="/admin"
                    className={`px-4 py-2 rounded-lg transition-colors text-base font-medium border border-transparent flex items-center gap-2 ${
                        pathname.includes("/admin")
                            ? "bg-brand-lime text-brand-navy shadow-sm"
                            : "text-white/80 hover:text-white hover:bg-brand-sky/10"
                    }`}
                >
                    <span className={pathname.includes("/admin") ? "animate-pulse" : ""}>⚙️</span>
                    Systemeinstellungen
                </Link>
            )}
        </nav>
    );
}
