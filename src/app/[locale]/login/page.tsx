"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/auth-store";
import { Logo } from "@/components/ui/logo";
import { useTranslations } from "next-intl";
import { AtSign, Lock, Shield, Briefcase, User, ArrowRight } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    const { login, isLoading, isDemoMode } = useAuthStore();
    const [isForgotSent, setIsForgotSent] = useState(false);
    const t = useTranslations("Login");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) { setError(t("error_empty")); return; }
        setError("");
        const result = await login(email, password);
        if (result.success) {
            router.push("/profile");
        } else {
            setError(result.error || t("error_failed"));
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
        <div className="login-bg">
            {/* Topographic background pattern */}
            <div className="login-topo" />

            {/* Radar circle overlay */}
            <div className="login-radar">
                <div className="login-radar-sweep" />
            </div>

            {/* Centered flex container */}
            <div className="login-outer">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="login-inner"
                >
                    {/* ── System Login Title ── */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.15, duration: 0.4 }}
                        className="login-subtitle mb-4 text-center"
                    >
                        {t("system_login")}
                    </motion.p>

                    {/* ── Logo Section ── */}
                    <div className="login-logo-section flex justify-center w-full mb-8">
                        <Logo className="h-10 mx-auto" showCampusSubtitle />
                    </div>

                    {/* ── Glassmorphic Login Card ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="login-card"
                    >
                        <form onSubmit={handleSubmit} noValidate>
                            {/* Email Field */}
                            <div className="login-field">
                                <label htmlFor="email" className="login-label">
                                    {t("terminal_label")}
                                </label>
                                <div className="login-input-wrapper">
                                    <AtSign className="login-input-icon login-input-icon--left" />
                                    <input
                                        id="email"
                                        type="text"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@company.de"
                                        className="login-input login-input--with-icon"
                                        autoComplete="email"
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="login-field">
                                <div className="login-field-header">
                                    <label htmlFor="password" className="login-label">
                                        {t("password_label")}
                                    </label>
                                    <button
                                        type="button"
                                        onClick={handleForgotPassword}
                                        className="login-forgot-btn"
                                    >
                                        {t("forgot_password")}
                                    </button>
                                </div>
                                <div className="login-input-wrapper">
                                    <Lock className="login-input-icon login-input-icon--left" />
                                    <input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••••••"
                                        className="login-input login-input--with-icon"
                                        autoComplete="current-password"
                                    />
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <motion.p
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="login-error"
                                >
                                    {error}
                                </motion.p>
                            )}

                            {/* Forgot Password Feedback */}
                            {isForgotSent && (
                                <motion.p
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="login-forgot-sent"
                                >
                                    {t("forgot_sent")}
                                </motion.p>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="login-btn-gradient"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="login-btn-loading">
                                        <span className="login-spinner" />
                                        {t("loading")}
                                    </span>
                                ) : (
                                    <>
                                        {t("submit_session")}
                                        <ArrowRight style={{ width: 16, height: 16 }} />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Status Bar */}
                        <div className="login-status-bar">
                            <div className="login-status-left">
                                <span className="login-status-dot" />
                                <span className="login-status-text">{t("system_online")}</span>
                            </div>
                            <span className="login-version-text">{t("version")}</span>
                        </div>
                    </motion.div>

                    {/* ── Demo Quick Access ── */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="login-demo-section"
                    >
                        <p className="login-demo-title">{t("demo_title")}</p>
                        <div className="login-demo-pills">
                            <button
                                onClick={() => isDemoMode && quickLogin("admin@thitronik.de", "admin")}
                                className="login-pill login-pill--admin"
                                type="button"
                            >
                                <Shield style={{ width: 13, height: 13 }} />
                                {t("demo_admin")}
                            </button>
                            <button
                                onClick={() => isDemoMode && quickLogin("manager@autohaus.de", "manager")}
                                className="login-pill login-pill--manager"
                                type="button"
                            >
                                <Briefcase style={{ width: 13, height: 13 }} />
                                {t("demo_manager")}
                            </button>
                            <button
                                onClick={() => isDemoMode && quickLogin("max@autohaus.de", "demo")}
                                className="login-pill login-pill--user"
                                type="button"
                            >
                                <User style={{ width: 13, height: 13 }} />
                                {t("demo_user")}
                            </button>
                        </div>
                    </motion.div>

                    {/* ── Register Section ── */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="login-register-section"
                    >
                        <p className="login-no-account">{t("no_account")}</p>
                        <Link href="/register" className="login-register-link">
                            {t("register_link")}
                        </Link>
                    </motion.div>

                    {/* ── Footer ── */}
                    <div className="login-footer">
                        <p className="login-footer-text">{t("footer_restricted")}</p>
                        <div className="login-footer-links">
                            <Link href="/datenschutz" className="login-footer-link">{t("footer_privacy")}</Link>
                            <Link href="/impressum" className="login-footer-link">{t("footer_imprint")}</Link>
                            <Link href="/support" className="login-footer-link">{t("footer_support")}</Link>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* ── Sparkle Decoration (decorative, small) ── */}
            <svg className="login-sparkle" viewBox="0 0 24 24" fill="white">
                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
        </div>
    );
}
