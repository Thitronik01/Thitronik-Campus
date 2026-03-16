"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/auth-store";
import { Logo } from "@/components/ui/logo";
import { useTranslations } from "next-intl";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    const { login, isLoading, isDemoMode, isAuthenticated } = useAuthStore();
    const [isForgotSent, setIsForgotSent] = useState(false);
    const t = useTranslations("Login");


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) { setError("Bitte alle Felder ausfüllen."); return; }
        setError("");
        const result = await login(email, password);
        if (result.success) {
            router.push("/profile");
        } else {
            setError(result.error || "Login fehlgeschlagen.");
        }
    };

    const handleForgotPassword = () => {
        setIsForgotSent(true);
        setTimeout(() => setIsForgotSent(false), 5000);
    };

    const quickLogin = async (email: string, pw: string) => {
        const result = await login(email, pw);
        if (result.success) router.push("/profile");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1D3661] via-[#1a2e52] to-[#0f1e36] p-4">
            <div className="absolute top-0 left-0 w-72 h-72 bg-[#3BA9D3]/10 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#3BA9D3]/5 rounded-full blur-3xl translate-x-1/4 translate-y-1/4" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Logo */}
                <div className="text-center mb-8 flex flex-col items-center">
                    <Logo className="h-10 sm:h-12 mb-4" />
                    <p className="text-white/40 text-sm mt-2 font-medium tracking-wide">
                        {t("subtitle")}
                    </p>
                </div>

                <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
                    <CardContent className="pt-8 pb-8 px-8">
                        <h2 className="text-xl font-bold text-white text-center mb-1">{t("welcome_back")}</h2>
                        <p className="text-white/40 text-sm text-center mb-6">{t("enter_credentials")}</p>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-white/70 text-xs font-bold uppercase tracking-wider">{t("email_label")}</Label>
                                <Input id="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)}
                                    placeholder="max@autohaus.de" className="bg-white/10 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-[#3BA9D3]" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="password" className="text-white/70 text-xs font-bold uppercase tracking-wider">{t("password_label")}</Label>
                                    <button
                                        type="button"
                                        onClick={handleForgotPassword}
                                        className="text-[10px] text-[#3BA9D3] hover:underline"
                                    >
                                        {t("forgot_password")}
                                    </button>
                                </div>
                                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••" className="bg-white/10 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-[#3BA9D3]" />
                            </div>

                            {error && (
                                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                                    className="text-xs text-[#CE132D] font-medium bg-[#CE132D]/10 rounded-lg px-3 py-2">{error}</motion.p>
                            )}

                            {isForgotSent && (
                                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                                    className="text-xs text-[#D4FF00] font-medium bg-[#D4FF00]/10 border border-[#D4FF00]/20 rounded-lg px-3 py-2">
                                    📩 Check dein Postfach! Ein Link wurde gesendet.
                                </motion.p>
                            )}

                            <Button type="submit" className="w-full bg-[#1D3661] hover:bg-[#294a7a] text-white font-bold py-5 text-base" disabled={isLoading}>
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        {t("loading")}
                                    </span>
                                ) : t("submit")}
                            </Button>
                        </form>

                        {/* Demo Quick Login */}
                        {isDemoMode && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                                className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
                                <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-3 text-center">{t("demo_login")}</p>
                                <div className="grid grid-cols-3 gap-2">
                                    <button onClick={() => quickLogin('admin@thitronik.de', 'admin')}
                                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-center">
                                        <Badge variant="destructive" className="text-[9px] mb-1">Admin</Badge>
                                        <div className="text-white/60 text-[10px]">Anna T.</div>
                                    </button>
                                    <button onClick={() => quickLogin('manager@autohaus.de', 'manager')}
                                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-center">
                                        <Badge variant="secondary" className="text-[9px] mb-1">Manager</Badge>
                                        <div className="text-white/60 text-[10px]">Frank W.</div>
                                    </button>
                                    <button onClick={() => quickLogin('max@autohaus.de', 'demo')}
                                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-center">
                                        <Badge variant="outline" className="text-[9px] mb-1 text-brand-lime border-brand-lime/30 bg-brand-lime/10">User</Badge>
                                        <div className="text-white/60 text-[10px]">Max M.</div>
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        <div className="mt-6 text-center">
                            <p className="text-white/30 text-xs">Noch kein Konto?</p>
                            <Link href="/register" className="text-[#3BA9D3] text-sm font-bold hover:underline mt-1 inline-block">
                                Partner-Registrierung anfragen
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-center items-center gap-4 mt-6 text-white/20 text-[10px] font-medium">
                    <span>🔒 SSL-verschlüsselt</span><span>·</span><span>DSGVO-konform</span><span>·</span><span>ISO 27001</span>
                </div>
            </motion.div>
        </div>
    );
}
