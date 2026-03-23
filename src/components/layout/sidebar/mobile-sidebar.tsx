"use client";

import Link from "next/link";
import { usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { useAuthStore, isAdmin, isManager } from "@/store/auth-store";
import { useState } from "react";

const NAV_ITEMS = [
    { href: "/", labelKey: "campus", icon: "🏠" },
    { href: "/modules", labelKey: "islands", icon: "🗺️" },
    { href: "/games", labelKey: "games", icon: "🧩" },
    { href: "/tools", labelKey: "tools", icon: "🛠️" },
];

export function MobileSidebar() {
    const pathname = usePathname();
    const t = useTranslations("Navigation");
    const { user: authUser } = useAuthStore();
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Navigation umschalten" className="lg:hidden text-white hover:bg-white/10">
                    <span className="text-xl">☰</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-brand-navy text-white border-white/10 w-72">
                <SheetHeader>
                    <SheetTitle className="text-white text-left">Navigation</SheetTitle>
                </SheetHeader>
                <nav className="mt-6 flex flex-col gap-1">
                    {NAV_ITEMS.map((item) => {
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className={`px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                                    pathname === item.href
                                        ? "bg-brand-lime text-brand-navy shadow-sm"
                                        : "text-white/60 hover:text-white hover:bg-white/5"
                                }`}
                            >
                                <span className="mr-2">{item.icon}</span>
                                {t(item.labelKey)}
                            </Link>
                        );
                    })}

                    {isAdmin(authUser) && (
                        <Link
                            href="/admin"
                            onClick={() => setOpen(false)}
                            className="px-4 py-3 rounded-lg text-base font-bold text-brand-sky hover:bg-white/5"
                        >
                            📊 {t("admin_dashboard")}
                        </Link>
                    )}

                    <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="px-4 py-2 text-xs font-bold text-white/50 uppercase tracking-wider">
                            {t("legal_and_contact")}
                        </div>
                        <Link href="/kontakt" onClick={() => setOpen(false)} className="flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors text-white/60 hover:text-white hover:bg-white/5">
                            <span className="mr-2">✉️</span> {t("contact")}
                        </Link>
                        <Link href="/impressum" onClick={() => setOpen(false)} className="flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors text-white/60 hover:text-white hover:bg-white/5">
                            <span className="mr-2">⚖️</span> {t("imprint")}
                        </Link>
                        <Link href="/datenschutz" onClick={() => setOpen(false)} className="flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors text-white/60 hover:text-white hover:bg-white/5">
                            <span className="mr-2">🛡️</span> {t("privacy")}
                        </Link>
                    </div>
                </nav>
            </SheetContent>
        </Sheet>
    );
}
