"use client";

// Issue #6: app-shell.tsx auf reine Orchestrierung reduziert (<100 Zeilen)
// Alle Sub-Komponenten wurden in eigene Dateien ausgelagert.

import Link from "next/link";
import { usePathname } from "@/i18n/routing";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/auth-store";
import { Logo } from "@/components/ui/logo";
import { XpPopup } from "@/components/gamification/xp-popup";
import { FullscreenToggle } from "./fullscreen-toggle";

// ── Sub-Komponenten ────────────────────────────
import { Navigation } from "./header/navigation";
import { LanguageSwitcher } from "./header/language-switcher";
import { NotificationDropdown } from "./header/notification-dropdown";
import { ProfileDropdown } from "./header/profile-dropdown";
import { MobileSidebar } from "./sidebar/mobile-sidebar";
import { AppFooter } from "./footer";

const AUTH_ROUTES = ["/login", "/register", "/forgot-password"];
const FULLSCREEN_ROUTES = ["/games/miro", "/games/mentimeter", "/games/kahoot"];

export function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const isAuthPage = AUTH_ROUTES.some((r) => pathname.endsWith(r));
    const isFullScreenPage = FULLSCREEN_ROUTES.some((r) => pathname.endsWith(r));
    if (isAuthPage || isFullScreenPage) return <>{children}</>;

    return (
        <div className="min-h-screen flex flex-col">
            <XpPopup />
            <FullscreenToggle />

            {/* ── Header ─────────────────────────────── */}
            <header className="sticky top-0 z-50 bg-brand-navy text-white border-b border-white/10 shadow-lg">
                <div className="max-w-[1400px] mx-auto flex items-center justify-between h-16 px-4 md:px-8">
                    {/* Logo */}
                    <Link href="/" className="flex flex-col shrink-0 group pt-1">
                        <Logo className="h-6 md:h-7 transition-transform group-hover:scale-105" />
                        <span className="text-brand-sky text-[9px] md:text-[10px] font-bold tracking-widest uppercase mt-1 pl-[105px]">
                            Thitronik UNI
                        </span>
                    </Link>

                    <Navigation />

                    {/* Right side */}
                    <div className="flex items-center gap-3">
                        <LanguageSwitcher />
                        <NotificationDropdown />
                        <ProfileDropdown />
                        <MobileSidebar />
                    </div>
                </div>
            </header>

            {/* ── Main Content ───────────────────────── */}
            <main className="flex-1 relative flex flex-col">
                <div className="absolute inset-0 z-0">
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: "url('/background.png')" }}
                    />
                    <div className="absolute inset-0 bg-brand-navy/60 backdrop-blur-[2px]" />
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-navy/40 via-transparent to-brand-navy/40" />
                </div>

                <div
                    style={{ marginLeft: "auto", marginRight: "auto" }}
                    className="relative z-10 max-w-[1400px] w-full px-4 md:px-8 py-8 flex-1 flex flex-col"
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

            <AppFooter />
        </div>
    );
}
