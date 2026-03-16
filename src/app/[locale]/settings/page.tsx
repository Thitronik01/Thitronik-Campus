"use client";

import { PremiumBackground } from "@/components/layout/premium-background";
import { useAuthStore } from "@/store/auth-store";
import { useUserStore } from "@/store/user-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { RoleGuard } from "@/components/auth/role-guard";
import { Settings as SettingsIcon, User, Bell, Palette, Shield, Globe, LogOut, ChevronRight } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export default function SettingsPage() {
    const { user, logout } = useAuthStore();
    const { theme, setTheme } = useTheme();
    const t = useTranslations("Navigation");

    const sections = [
        {
            id: "account",
            title: "Account & Profil",
            description: "Verwalten Sie Ihre persönlichen Informationen und Firmendaten.",
            icon: <User className="w-5 h-5 text-brand-sky" />,
            items: [
                { label: "Anzeigename", value: user?.name || "Gast", type: "text" },
                { label: "E-Mail Adresse", value: user?.email || "demo@thitronik.de", type: "text" },
                { label: "Firma", value: "THITRONIK Partner", type: "text" }
            ]
        },
        {
            id: "appearance",
            title: "Erscheinungsbild",
            description: "Passen Sie das visuelle Design der App an Ihre Vorlieben an.",
            icon: <Palette className="w-5 h-5 text-brand-lime" />,
            content: (
                <div className="flex gap-4 mt-2">
                    {["light", "dark", "system"].map((m) => (
                        <Button
                            key={m}
                            variant="outline"
                            onClick={() => setTheme(m)}
                            className={`flex-1 capitalize border-white/10 text-white hover:bg-white/10 ${theme === m ? 'border-brand-sky bg-brand-sky/10 ring-1 ring-brand-sky/30' : ''}`}
                        >
                            {m === 'light' ? '☀️ ' : m === 'dark' ? '🌙 ' : '⚙️ '}{m}
                        </Button>
                    ))}
                </div>
            )
        },
        {
            id: "notifications",
            title: "Benachrichtigungen",
            description: "Wählen Sie, worüber Sie informiert werden möchten.",
            icon: <Bell className="w-5 h-5 text-yellow-400" />,
            content: (
                <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between p-3 border border-white/10 rounded-xl bg-white/5">
                        <span className="text-sm font-medium text-white">Event Reminder</span>
                        <Switch checked />
                    </div>
                    <div className="flex items-center justify-between p-3 border border-white/10 rounded-xl bg-white/5">
                        <span className="text-sm font-medium text-white">Level-Up News</span>
                        <Switch checked />
                    </div>
                </div>
            )
        },
        {
            id: "security",
            title: "Sicherheit",
            description: "Schützen Sie Ihren Account mit einem sicheren Passwort.",
            icon: <Shield className="w-5 h-5 text-brand-red" />,
            items: [
                { label: "Passwort ändern", value: "********", type: "password", button: "Ändern" }
            ]
        },
        {
            id: "language",
            title: "Sprache",
            description: "Wählen Sie Ihre bevorzugte Sprache für das Interface.",
            icon: <Globe className="w-5 h-5 text-brand-sky" />,
            content: (
                <div className="flex gap-4 mt-2">
                    <Button variant="outline" className="flex-1 border-brand-sky text-brand-sky bg-brand-sky/10">Deutsch</Button>
                    <Button variant="outline" className="flex-1 border-white/10 text-white hover:bg-white/10">English</Button>
                </div>
            )
        }
    ];

    return (
        <RoleGuard requiredRole="user">
            <PremiumBackground>
                <div className="max-w-4xl mx-auto py-8 px-4 md:px-8 space-y-8 animate-fade-in pb-20">
                    <header className="flex items-center justify-between group">
                        <div className="space-y-1">
                            <h1 className="text-4xl font-extrabold text-white flex items-center gap-4">
                                <SettingsIcon className="w-10 h-10 text-brand-lime animate-spin-slow group-hover:text-brand-sky transition-colors" />
                                Einstellungen
                            </h1>
                            <p className="text-white/60 text-lg">
                                Personalisieren Sie Ihr Campus-Erlebnis.
                            </p>
                        </div>
                        <Button 
                            variant="destructive" 
                            size="sm" 
                            className="bg-brand-red/20 hover:bg-brand-red text-brand-red hover:text-white border-brand-red/30 transition-all font-bold gap-2"
                            onClick={() => logout()}
                        >
                            <LogOut className="w-4 h-4" /> Abmelden
                        </Button>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 h-full">
                        {/* Navigation Sidebar (Mobile Sticky) */}
                        <div className="md:col-span-1 space-y-2 hidden md:block h-fit sticky top-24">
                            {sections.map((s) => (
                                <a 
                                    key={s.id} 
                                    href={`#${s.id}`}
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 text-white/70 hover:text-white transition-all group"
                                >
                                    <span className="group-hover:scale-110 transition-transform">{s.icon}</span>
                                    <span className="font-medium">{s.title.split(' ')[0]}</span>
                                </a>
                            ))}
                        </div>

                        {/* Content Area */}
                        <div className="md:col-span-3 space-y-8">
                            {sections.map((section, idx) => (
                                <motion.div
                                    key={section.id}
                                    id={section.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <Card className="bg-white/10 border-white/20 backdrop-blur-md shadow-xl overflow-hidden group">
                                        <CardHeader className="border-b border-white/10">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="p-2 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors">
                                                    {section.icon}
                                                </div>
                                                <CardTitle className="text-white text-xl">{section.title}</CardTitle>
                                            </div>
                                            <CardDescription className="text-white/60">
                                                {section.description}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="pt-6">
                                            {section.items ? (
                                                <div className="space-y-6">
                                                    {section.items.map((item, i) => (
                                                        <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                            <Label className="text-white/50 font-medium sm:w-1/3 italic">{item.label}</Label>
                                                            <div className="flex-1 flex items-center justify-between gap-4 p-2 bg-white/5 rounded-lg border border-white/5">
                                                                <span className="text-white font-medium">{item.value}</span>
                                                                {item.button && (
                                                                    <Button size="sm" variant="ghost" className="text-brand-sky hover:text-white hover:bg-brand-sky/20">
                                                                        {item.button}
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : section.content}
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}

                            {/* Info Card */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="p-6 bg-brand-navy border border-white/10 rounded-2xl text-center relative overflow-hidden"
                            >
                                <p className="text-white/40 text-xs">
                                    THITRONIK Campus v2.4.0 • Build 2026-03-12
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </PremiumBackground>
        </RoleGuard>
    );
}
