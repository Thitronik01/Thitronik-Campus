"use client";

import Link from "next/link";
import { usePathname, useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { useUserStore } from "@/store/user-store";
import { useAuthStore, isAdmin, isManager, UserRole } from "@/store/auth-store";
import { XpPopup } from "@/components/gamification/xp-popup";
import { Logo } from "@/components/ui/logo";
import { FullscreenToggle } from "./fullscreen-toggle";

// Note: label is now a translation key
const NAV_ITEMS = [
    { href: "/", labelKey: "campus", icon: "🏠" },
    { href: "/modules", labelKey: "islands", icon: "🗺️" },
    { href: "/games", labelKey: "games", icon: "🧩" },
    { href: "/tools", labelKey: "tools", icon: "🛠️" },
    { href: "/certificates", labelKey: "certificates", icon: "🎓" },
];

const AUTH_ROUTES = ["/login", "/register", "/forgot-password"];
const FULLSCREEN_ROUTES = ["/games/miro", "/games/mentimeter", "/games/kahoot"];

export function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const currentLocale = useLocale();
    const t = useTranslations("Navigation");
    const { name: gameName, level, levelName, xp, xpToNext } = useUserStore();
    const { user: authUser, isAuthenticated, logout } = useAuthStore();
    const [mobileOpen, setMobileOpen] = useState(false);

    // Use auth user name if logged in, else gamification store name
    const displayName = authUser?.name || gameName;
    const displayRole = authUser?.role || "user";
    const initials = displayName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
    const xpPct = Math.min(100, Math.round((xp / xpToNext) * 100));

    // Don't show shell on auth or fullscreen pages (handle localized paths like /de/login)
    const isAuthPage = AUTH_ROUTES.some(route => pathname.endsWith(route));
    const isFullScreenPage = FULLSCREEN_ROUTES.some(route => pathname.endsWith(route));
    if (isAuthPage || isFullScreenPage) {
        return <>{children}</>;
    }

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    return (
        <div className="min-h-screen flex flex-col">
            <XpPopup />
            {/* ── Header ─────────────────────────────── */}
            <header className="sticky top-0 z-50 bg-brand-navy text-white border-b border-white/10 shadow-lg">
                <div className="max-w-[1400px] mx-auto flex items-center justify-between h-16 px-4 md:px-8">
                    {/* Logo & Subtitle */}
                    <Link href="/" className="flex flex-col shrink-0 group pt-1">
                        <Logo className="h-6 md:h-7 transition-transform group-hover:scale-105" />
                        <span className="text-brand-sky text-[9px] md:text-[10px] font-bold tracking-widest uppercase mt-1 pl-[105px]">
                            Campus 2.0
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {NAV_ITEMS.map((item) => {
                            // Hide certificates for admins/managers
                            if (item.href === "/certificates" && (isAdmin(authUser) || isManager(authUser))) return null;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`px-3 py-2 rounded-lg text-base font-medium transition-colors ${pathname === item.href
                                        ? "bg-brand-lime text-brand-navy shadow-sm"
                                        : "text-white/60 hover:text-white hover:bg-white/5"
                                        }`}
                                >
                                    <span className="mr-1.5">{item.icon}</span>
                                    {t(item.labelKey)}
                                </Link>
                            );
                        })}
                        {/* Admin or THI Bot */}
                        {isAdmin(authUser) ? (
                            <Link
                                href="/admin"
                                className={`px-3 py-2 rounded-lg text-base font-bold transition-colors ${pathname === "/admin"
                                    ? "bg-brand-lime text-brand-navy shadow-sm"
                                    : "text-brand-sky/70 hover:text-brand-sky hover:bg-white/5"
                                    }`}
                            >
                                Admin
                            </Link>
                        ) : (
                            <Link
                                href="/thi"
                                className={`px-3 py-2 rounded-lg text-base font-bold transition-colors flex items-center gap-2 ${pathname === "/thi"
                                    ? "bg-brand-lime text-brand-navy shadow-sm"
                                    : "text-brand-sky hover:text-brand-lime hover:bg-white/5"
                                    }`}
                            >
                                <span>🤖</span> THI
                            </Link>
                        )}

                        {/* Manager CMS */}
                        {isManager(authUser) && (
                            <Link href="/manager" className={`px-4 py-2 rounded-lg transition-colors text-base font-medium border border-transparent flex items-center gap-2
                                ${pathname.includes("/manager") ? "bg-brand-lime text-brand-navy shadow-sm" : "text-white/80 hover:text-white hover:bg-brand-sky/10"}`}
                            >
                                <span className={pathname.includes("/manager") ? "animate-pulse" : ""}>📋</span>
                                CMS / Inhalte
                            </Link>
                        )}

                        {/* Admin Tools */}
                        {isAdmin(authUser) && (
                            <Link href="/admin" className={`px-4 py-2 rounded-lg transition-colors text-base font-medium border border-transparent flex items-center gap-2
                                ${pathname.includes("/admin") ? "bg-brand-lime text-brand-navy shadow-sm" : "text-white/80 hover:text-white hover:bg-brand-sky/10"}`}
                            >
                                <span className={pathname.includes("/admin") ? "animate-pulse" : ""}>⚙️</span>
                                Systemeinstellungen
                            </Link>
                        )}
                    </nav>

                    {/* Right side */}
                    <div className="flex items-center gap-3">
                        {/* Language */}
                        <div className="hidden md:flex gap-0.5 text-[11px] font-bold bg-white/10 rounded-lg px-1 py-0.5">
                            {["de", "en", "fr"].map((l) => (
                                <button
                                    key={l}
                                    onClick={() => {
                                        // Next-intl specific router.replace handles locale prefixing
                                        router.replace(pathname, { locale: l });
                                    }}
                                    className={`px-1.5 py-0.5 rounded uppercase ${l === currentLocale ? "bg-white/20 text-white" : "text-white/40 hover:text-white/70"}`}
                                >
                                    {l}
                                </button>
                            ))}
                        </div>

                        {/* Fullscreen */}
                        <FullscreenToggle />

                        {/* Notifications */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10 outline-none">
                                    <span className="text-lg">🔔</span>
                                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-red text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-brand-navy">
                                        2
                                    </span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-72 mt-2 p-0">
                                <div className="p-3 border-b text-sm font-bold bg-muted/50">
                                    Benachrichtigungen
                                </div>
                                <div className="max-h-[300px] overflow-auto">
                                    <div className="p-3 border-b hover:bg-muted/50 cursor-pointer transition-colors relative">
                                        <div className="w-2 h-2 rounded-full bg-brand-red absolute top-4 left-2"></div>
                                        <div className="pl-3">
                                            <p className="text-sm font-medium">Neues Seminar verfügbar</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">Das Seminar "Smarte Alarmanlagen" ist nun buchbar.</p>
                                            <p className="text-[10px] text-muted-foreground mt-1">Vor 2 Stunden</p>
                                        </div>
                                    </div>
                                    <div className="p-3 border-b hover:bg-muted/50 cursor-pointer transition-colors relative">
                                        <div className="w-2 h-2 rounded-full bg-brand-red absolute top-4 left-2"></div>
                                        <div className="pl-3">
                                            <p className="text-sm font-medium">Zertifikat freigeschaltet</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">Du hast die "Poel" Insel erfolgreich gemeistert!</p>
                                            <p className="text-[10px] text-muted-foreground mt-1">Gestern</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-2 text-center border-t">
                                    <Button variant="ghost" className="w-full text-xs h-8 text-brand-sky">Alle als gelesen markieren</Button>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Profile dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-2 hover:bg-white/10 rounded-lg px-2 py-1 transition-colors">
                                    <Avatar className="h-8 w-8 border-2 border-brand-sky/50">
                                        <AvatarFallback className="bg-brand-sky/20 text-white text-xs font-bold">{initials}</AvatarFallback>
                                    </Avatar>
                                    <div className="hidden md:block text-left">
                                        <div className="text-xs font-bold leading-none">{displayName}</div>
                                        <div className="flex items-center gap-1 mt-0.5">
                                            <span className="status-dot"></span>
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
                                    {authUser && <Badge variant="secondary" className="text-[9px] mt-1">{authUser.role} · {authUser.company}</Badge>}

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
                                <DropdownMenuItem asChild><Link href="/profile">👤 {t("profile")}</Link></DropdownMenuItem>

                                {!isAdmin(authUser) && !isManager(authUser) && (
                                    <DropdownMenuItem asChild><Link href="/certificates">🪪 {t("certificates")}</Link></DropdownMenuItem>
                                )}

                                <DropdownMenuItem asChild><Link href="/settings">⚙️ Einstellungen</Link></DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive" onClick={handleLogout}>🚪 {t("logout")}</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Mobile hamburger */}
                        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="lg:hidden text-white hover:bg-white/10">
                                    <span className="text-xl">☰</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="bg-brand-navy text-white border-white/10 w-72">
                                <SheetHeader>
                                    <SheetTitle className="text-white text-left">Navigation</SheetTitle>
                                </SheetHeader>
                                <nav className="mt-6 flex flex-col gap-1">
                                    {NAV_ITEMS.map((item) => {
                                        if (item.href === "/certificates" && (isAdmin(authUser) || isManager(authUser))) return null;
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={() => setMobileOpen(false)}
                                                className={`px-4 py-3 rounded-lg text-base font-medium transition-colors ${pathname === item.href ? "bg-brand-lime text-brand-navy shadow-sm" : "text-white/60 hover:text-white hover:bg-white/5"
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
                                            onClick={() => setMobileOpen(false)}
                                            className="px-4 py-3 rounded-lg text-base font-bold text-brand-sky hover:bg-white/5"
                                        >
                                            📊 Admin Dashboard
                                        </Link>
                                    )}

                                    <div className="mt-4 pt-4 border-t border-white/10">
                                        <div className="px-4 py-2 text-xs font-bold text-white/50 uppercase tracking-wider">
                                            Rechtliches & Kontakt
                                        </div>
                                        <Link href="/kontakt" onClick={() => setMobileOpen(false)} className="flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors text-white/60 hover:text-white hover:bg-white/5">
                                            <span className="mr-2">✉️</span> Kontakt
                                        </Link>
                                        <Link href="/impressum" onClick={() => setMobileOpen(false)} className="flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors text-white/60 hover:text-white hover:bg-white/5">
                                            <span className="mr-2">⚖️</span> Impressum
                                        </Link>
                                        <Link href="/datenschutz" onClick={() => setMobileOpen(false)} className="flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors text-white/60 hover:text-white hover:bg-white/5">
                                            <span className="mr-2">🛡️</span> Datenschutz
                                        </Link>
                                    </div>
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </header>

            {/* ── Main Content ───────────────────────── */}
            <main className="flex-1 bg-brand-gray/30 flex flex-col">
                <div style={{ marginLeft: 'auto', marginRight: 'auto' }} className="max-w-[1400px] w-full px-4 md:px-8 py-8 flex-1 flex flex-col">
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

            {/* ── Footer ─────────────────────────────── */}
            <footer className="border-t border-border bg-white py-6">
                <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
                    <span>© 2026 THITRONIK GmbH · Händler Akademie</span>
                    <div className="flex gap-4">
                        <Link href="/impressum" className="hover:text-brand-navy transition-colors">Impressum</Link>
                        <Link href="/datenschutz" className="hover:text-brand-navy transition-colors">Datenschutz</Link>
                        <Link href="/kontakt" className="hover:text-brand-navy transition-colors">Kontakt</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
