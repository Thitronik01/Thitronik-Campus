"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/auth-store";
import { Logo } from "@/components/ui/logo";
import { useTranslations } from "next-intl";
import { AtSign, Lock, Shield, Briefcase, User, Wifi } from "lucide-react";

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

            {/* Main content */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                style={{
                    position: "relative",
                    zIndex: 10,
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "100vh",
                    padding: "2rem 1.5rem",
                    maxWidth: "28rem",
                    margin: "0 auto",
                }}
            >
                {/* ── Logo Section (centered) ── */}
                <div style={{ marginBottom: "0.5rem", textAlign: "center" }}>
                    <Logo className="h-12 sm:h-14" showCampusSubtitle />
                </div>

                {/* ── System Login Title (centered) ── */}
                <motion.h2
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.4 }}
                    style={{
                        color: "#CE132D",
                        fontSize: "1.25rem",
                        fontWeight: 700,
                        fontStyle: "italic",
                        marginBottom: "1.75rem",
                        letterSpacing: "0.02em",
                        textAlign: "center",
                    }}
                >
                    {t("system_login")}
                </motion.h2>

                {/* ── Glassmorphic Login Card ── */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="login-card"
                >
                    <form onSubmit={handleSubmit}>
                        {/* Email Field */}
                        <div style={{ marginBottom: "1.25rem" }}>
                            <label
                                htmlFor="email"
                                style={{
                                    display: "block",
                                    color: "rgba(255,255,255,0.6)",
                                    fontSize: "0.6875rem",
                                    fontWeight: 700,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.1em",
                                    marginBottom: "0.5rem",
                                }}
                            >
                                {t("terminal_label")}
                            </label>
                            <div className="login-input-wrapper">
                                <input
                                    id="email"
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@company.de"
                                    className="login-input"
                                    autoComplete="email"
                                />
                                <AtSign className="login-input-icon" />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div style={{ marginBottom: "1.5rem" }}>
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "0.5rem",
                            }}>
                                <label
                                    htmlFor="password"
                                    style={{
                                        color: "rgba(255,255,255,0.6)",
                                        fontSize: "0.6875rem",
                                        fontWeight: 700,
                                        textTransform: "uppercase",
                                        letterSpacing: "0.1em",
                                    }}
                                >
                                    {t("password_label")}
                                </label>
                                <button
                                    type="button"
                                    onClick={handleForgotPassword}
                                    style={{
                                        background: "none",
                                        border: "none",
                                        color: "rgba(59,169,211,0.7)",
                                        fontSize: "0.6875rem",
                                        cursor: "pointer",
                                        padding: 0,
                                    }}
                                >
                                    {t("forgot_password")}
                                </button>
                            </div>
                            <div className="login-input-wrapper">
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    className="login-input"
                                    autoComplete="current-password"
                                />
                                <Lock className="login-input-icon" />
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <motion.p
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                    fontSize: "0.75rem",
                                    color: "#CE132D",
                                    fontWeight: 600,
                                    background: "rgba(206,19,45,0.1)",
                                    borderRadius: "0.5rem",
                                    padding: "0.5rem 0.75rem",
                                    marginBottom: "1rem",
                                }}
                            >
                                {error}
                            </motion.p>
                        )}

                        {/* Forgot Password Feedback */}
                        {isForgotSent && (
                            <motion.p
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                    fontSize: "0.75rem",
                                    color: "#D4FF00",
                                    fontWeight: 600,
                                    background: "rgba(212,255,0,0.08)",
                                    border: "1px solid rgba(212,255,0,0.2)",
                                    borderRadius: "0.5rem",
                                    padding: "0.5rem 0.75rem",
                                    marginBottom: "1rem",
                                }}
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
                                <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                    <span style={{
                                        width: "1rem",
                                        height: "1rem",
                                        border: "2px solid rgba(10,22,40,0.3)",
                                        borderTopColor: "#0a1628",
                                        borderRadius: "50%",
                                        animation: "spin 0.6s linear infinite",
                                    }} />
                                    {t("loading")}
                                </span>
                            ) : (
                                <>
                                    {t("submit_session")}
                                    <Wifi style={{ width: 16, height: 16 }} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Status Bar */}
                    <div className="login-status-bar">
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <span className="login-status-dot" />
                            <span style={{
                                color: "rgba(255,255,255,0.45)",
                                fontSize: "0.625rem",
                                fontWeight: 600,
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                            }}>
                                {t("system_online")}
                            </span>
                        </div>
                        <span style={{
                            color: "rgba(255,255,255,0.25)",
                            fontSize: "0.625rem",
                            fontWeight: 500,
                            letterSpacing: "0.03em",
                        }}>
                            {t("version")}
                        </span>
                    </div>
                </motion.div>

                {/* ── Demo Quick Access ── */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    style={{
                        marginTop: "2rem",
                        textAlign: "center",
                    }}
                >
                    <p style={{
                        color: "rgba(255,255,255,0.35)",
                        fontSize: "0.6875rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.12em",
                        marginBottom: "0.875rem",
                    }}>
                        {t("demo_title")}
                    </p>
                    <div style={{ display: "flex", justifyContent: "center", gap: "0.625rem", flexWrap: "wrap" }}>
                        <button
                            onClick={() => isDemoMode && quickLogin("admin@thitronik.de", "admin")}
                            className="login-pill login-pill--admin"
                            type="button"
                        >
                            <Shield style={{ width: 14, height: 14 }} />
                            {t("demo_admin")}
                        </button>
                        <button
                            onClick={() => isDemoMode && quickLogin("manager@autohaus.de", "manager")}
                            className="login-pill login-pill--manager"
                            type="button"
                        >
                            <Briefcase style={{ width: 14, height: 14 }} />
                            {t("demo_manager")}
                        </button>
                        <button
                            onClick={() => isDemoMode && quickLogin("max@autohaus.de", "demo")}
                            className="login-pill login-pill--user"
                            type="button"
                        >
                            <User style={{ width: 14, height: 14 }} />
                            {t("demo_user")}
                        </button>
                    </div>
                </motion.div>

                {/* ── Register Section ── */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    style={{ marginTop: "1.5rem", textAlign: "center" }}
                >
                    <p style={{
                        color: "rgba(255,255,255,0.3)",
                        fontSize: "0.75rem",
                    }}>
                        {t("no_account")}
                    </p>
                    <Link
                        href="/register"
                        style={{
                            color: "#3BA9D3",
                            fontSize: "0.875rem",
                            fontWeight: 700,
                            marginTop: "0.25rem",
                            display: "inline-block",
                        }}
                    >
                        {t("register_link")}
                    </Link>
                </motion.div>

                {/* ── Footer ── */}
                <div style={{ marginTop: "auto", paddingTop: "3rem", textAlign: "center" }}>
                    <p style={{
                        color: "rgba(255,255,255,0.25)",
                        fontSize: "0.6875rem",
                        marginBottom: "0.75rem",
                        lineHeight: 1.5,
                    }}>
                        {t("footer_restricted")}
                    </p>
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "0.75rem",
                        flexWrap: "wrap",
                    }}>
                        <Link
                            href="/datenschutz"
                            style={{
                                color: "#3BA9D3",
                                fontSize: "0.625rem",
                                fontWeight: 600,
                                letterSpacing: "0.08em",
                                textDecoration: "none",
                                padding: "0.375rem 0.875rem",
                                borderRadius: "9999px",
                                border: "1px solid rgba(59,169,211,0.3)",
                                background: "rgba(59,169,211,0.08)",
                                transition: "background 0.2s ease, border-color 0.2s ease",
                            }}
                        >
                            {t("footer_privacy")}
                        </Link>
                        <Link
                            href="/impressum"
                            style={{
                                color: "#3BA9D3",
                                fontSize: "0.625rem",
                                fontWeight: 600,
                                letterSpacing: "0.08em",
                                textDecoration: "none",
                                padding: "0.375rem 0.875rem",
                                borderRadius: "9999px",
                                border: "1px solid rgba(59,169,211,0.3)",
                                background: "rgba(59,169,211,0.08)",
                                transition: "background 0.2s ease, border-color 0.2s ease",
                            }}
                        >
                            {t("footer_imprint")}
                        </Link>
                        <Link
                            href="/support"
                            style={{
                                color: "#3BA9D3",
                                fontSize: "0.625rem",
                                fontWeight: 600,
                                letterSpacing: "0.08em",
                                textDecoration: "none",
                                padding: "0.375rem 0.875rem",
                                borderRadius: "9999px",
                                border: "1px solid rgba(59,169,211,0.3)",
                                background: "rgba(59,169,211,0.08)",
                                transition: "background 0.2s ease, border-color 0.2s ease",
                            }}
                        >
                            {t("footer_support")}
                        </Link>
                    </div>
                </div>

                {/* ── Sparkle Decoration ── */}
                <svg className="login-sparkle" viewBox="0 0 24 24" fill="white">
                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                </svg>
            </motion.div>
        </div>
    );
}
