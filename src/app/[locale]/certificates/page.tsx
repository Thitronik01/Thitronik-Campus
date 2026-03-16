"use client";

import { useUserStore } from "@/store/user-store";
import { useAuthStore } from "@/store/auth-store";
import { RoleGuard } from "@/components/auth/role-guard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PremiumBackground } from "@/components/layout/premium-background";

// ── Typen ────────────────────────────────────────────────────────────────────
type CertTheme = "default" | "neon" | "gold" | "sky" | "lime";
type CertCategory = "campus" | "haendler" | "einbau";

interface Certificate {
    id: string;
    title: string;
    date: string;
    expiresDura: number;
    status: "active" | "expired";
    type: string;
    theme: CertTheme;
    icon: string;
    category: CertCategory;
    pdfUrl: string;
}

// ── Daten ─────────────────────────────────────────────────────────────────────
const CERTIFICATES: Certificate[] = [
    // ── Campus ──────────────────────────────────────────────────────────────
    {
        id: "cert_campus2026",
        title: "Campus 2026",
        date: "09.03.2026",
        expiresDura: 365,
        status: "active",
        type: "Campus Evolution",
        theme: "lime",
        icon: "🎓",
        category: "campus",
        pdfUrl: "/certificates/campus2026.pdf",
    },
    // ── Händler ──────────────────────────────────────────────────────────────
    {
        id: "cert_premiumpartner",
        title: "Premium Händler",
        date: "09.03.2026",
        expiresDura: 365,
        status: "active",
        type: "Partnerstatus",
        theme: "gold",
        icon: "👑",
        category: "haendler",
        pdfUrl: "/certificates/THITRONIK_Premiumpartner.pdf",
    },
    {
        id: "cert_einbaupartner",
        title: "Einbau Händler",
        date: "09.03.2026",
        expiresDura: 365,
        status: "active",
        type: "Partnerstatus",
        theme: "neon",
        icon: "🔧",
        category: "haendler",
        pdfUrl: "/certificates/THITRONIK_Einbaupartner.pdf",
    },
    // ── Einbau Zertifikate ────────────────────────────────────────────────────
    {
        id: "cert_wipro",
        title: "WiPro III Experte",
        date: "14.10.2025",
        expiresDura: 365,
        status: "active",
        type: "Hardware Installation",
        theme: "default",
        icon: "⚙️",
        category: "einbau",
        pdfUrl: "/certificates/wipro.pdf",
    },
    {
        id: "cert_profinder",
        title: "Pro-finder Advanced",
        date: "05.11.2023",
        expiresDura: 730,
        status: "expired",
        type: "Diagnose & Service",
        theme: "default",
        icon: "🔍",
        category: "einbau",
        pdfUrl: "/certificates/profinder.pdf",
    },
    {
        id: "cert_sales",
        title: "Smart-Home Beratung",
        date: "20.01.2026",
        expiresDura: 365,
        status: "active",
        type: "Vertrieb",
        theme: "default",
        icon: "🏠",
        category: "einbau",
        pdfUrl: "/certificates/smart-home.pdf",
    },
    {
        id: "cert_smoke",
        title: "Rauchmelder Profi",
        date: "28.02.2026",
        expiresDura: 1095,
        status: "active",
        type: "Sicherheitstechnik",
        theme: "sky",
        icon: "🔔",
        category: "einbau",
        pdfUrl: "/certificates/rauchmelder.pdf",
    },
];

// ── Sektion-Definitionen ──────────────────────────────────────────────────────
const SECTIONS: { key: CertCategory; label: string; subtitle: string; accent: string }[] = [
    {
        key: "campus",
        label: "🎓 Campus Zertifikat",
        subtitle: "Ihr offizieller THITRONIK Campus-Nachweis",
        accent: "from-brand-lime/30 to-transparent",
    },
    {
        key: "haendler",
        label: "🏆 Händler Zertifikate",
        subtitle: "Offizieller Status als THITRONIK Partner",
        accent: "from-amber-400/30 to-transparent",
    },
    {
        key: "einbau",
        label: "🔧 Einbau Zertifikate",
        subtitle: "Nachweise für Produkt- und Montage-Schulungen",
        accent: "from-brand-sky/30 to-transparent",
    },
];

// ── Card-Styling ──────────────────────────────────────────────────────────────
function getCardClass(cert: Certificate): string {
    if (cert.status === "expired") return "border-destructive/30 bg-destructive/5 grayscale-[0.3]";
    switch (cert.theme) {
        case "neon":  return "border-brand-lime/60 bg-brand-lime/10 shadow-[0_0_20px_rgba(175,202,5,0.15)]";
        case "gold":  return "border-amber-400/60 bg-amber-400/10 shadow-[0_0_20px_rgba(251,191,36,0.15)]";
        case "sky":   return "border-sky-400/50 bg-sky-400/10";
        case "lime":  return "border-brand-lime/50 bg-brand-lime/10 shadow-[0_0_15px_rgba(163,230,53,0.1)]";
        default:      return "border-brand-sky/20";
    }
}

function getTitleClass(cert: Certificate): string {
    if (cert.status === "expired") return "text-destructive";
    switch (cert.theme) {
        case "neon": return "text-brand-lime";
        case "gold": return "text-amber-400";
        default:     return "text-brand-navy";
    }
}

function getBadgeClass(cert: Certificate): string {
    if (cert.status !== "active") return "";
    switch (cert.theme) {
        case "neon": return "bg-brand-lime text-brand-navy font-bold";
        case "gold": return "bg-amber-400 text-amber-950 font-bold";
        default:     return "bg-brand-sky";
    }
}

// ── Zertifikat-Karte ──────────────────────────────────────────────────────────
function CertCard({ cert }: { cert: Certificate }) {
    return (
        <Card className={`flex flex-col h-full border transition-all hover:shadow-lg hover:-translate-y-0.5 ${getCardClass(cert)}`}>
            <CardHeader className="pb-4 border-b border-border">
                <div className="flex justify-between items-start mb-2">
                    <Badge
                        variant={cert.status === "active" ? "default" : "destructive"}
                        className={getBadgeClass(cert)}
                    >
                        {cert.status === "active" ? "Gültig" : "Abgelaufen"}
                    </Badge>
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{cert.type}</span>
                </div>
                <CardTitle className={`text-lg flex items-center gap-2 ${getTitleClass(cert)}`}>
                    <span>{cert.icon}</span>
                    {cert.title}
                </CardTitle>
            </CardHeader>

            <CardContent className="pt-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3 mt-1">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Erworben am:</span>
                        <span className="font-semibold">{cert.date}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Status:</span>
                        <span className={`font-semibold ${cert.status === "expired" ? "text-destructive" : "text-brand-lime drop-shadow-sm"}`}>
                            {cert.status === "active" ? "Aktiv" : "Re-Zertifizierung nötig"}
                        </span>
                    </div>
                </div>

                <div className="mt-8 pt-4 border-t border-border flex gap-3">
                    {cert.status === "active" ? (
                        <>
                            <Button variant="outline" className="flex-1 border-brand-sky/30 text-brand-sky hover:bg-brand-sky/10" asChild>
                                <a href={cert.pdfUrl} target="_blank" rel="noopener noreferrer">
                                    📄 Ansehen
                                </a>
                            </Button>
                            <Button variant="outline" className="flex-1 border-brand-lime/30 text-brand-lime hover:bg-brand-lime/10" asChild>
                                <a href={cert.pdfUrl} download>
                                    ⬇ Download
                                </a>
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="outline" className="flex-1 border-white/20 text-white/50 hover:bg-white/5" asChild>
                                <a href={cert.pdfUrl} target="_blank" rel="noopener noreferrer">
                                    📄 Ansehen
                                </a>
                            </Button>
                            <Button className="flex-1 bg-brand-navy hover:bg-brand-sky text-white">
                                Re-Zertifizieren
                            </Button>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

// ── Seite ─────────────────────────────────────────────────────────────────────
export default function CertificatesPage() {
    const { user } = useAuthStore();
    const { name: gameName } = useUserStore();
    const displayName = user?.name || gameName || "THITRONIK Partner";

    const activeCount = CERTIFICATES.filter(c => c.status === "active").length;

    return (
        <RoleGuard requiredRole="user">
            <PremiumBackground>
                <div className="max-w-5xl mx-auto space-y-10 animate-fade-in pb-20 p-4 md:p-8">

                    {/* Header */}
                    <div className="border-b border-white/10 pb-6">
                        <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
                            <span className="text-4xl">🎓</span> Zertifikate & Nachweise
                        </h1>
                        <p className="text-white/70 text-lg mt-2 font-medium">
                            Hier finden Sie alle erfolgreich abgeschlossenen Module als offizielle PDF-Nachweise.
                        </p>
                    </div>

                    {/* Summary Card */}
                    <Card className="bg-brand-navy border-none text-white shadow-md relative overflow-hidden">
                        <div className="absolute -top-24 -right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute bottom-[-10px] left-[-20%] w-[50%] h-[150%] bg-gradient-to-r from-brand-sky/20 to-transparent skew-x-12 pointer-events-none" />
                        <CardHeader className="relative z-10">
                            <CardTitle className="text-xl">Hallo {displayName},</CardTitle>
                            <CardDescription className="text-white/80">
                                Sie haben derzeit{" "}
                                <strong className="text-brand-lime">{activeCount} aktive Zertifikate</strong>.{" "}
                                Halten Sie diese aktuell, um den &quot;THITRONIK Premium-Partner&quot; Status Ihres Autohauses zu sichern.
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    {/* Sektionen */}
                    {SECTIONS.map((section) => {
                        const certs = CERTIFICATES.filter(c => c.category === section.key);
                        return (
                            <div key={section.key} className="space-y-4">
                                {/* Sektion-Header */}
                                <div className="relative">
                                    <div className={`absolute inset-0 bg-gradient-to-r ${section.accent} rounded-lg opacity-40 blur-sm`} />
                                    <div className="relative flex items-center gap-3 py-2 px-1 border-b border-white/10">
                                        <div>
                                            <h2 className="text-xl font-bold text-white">{section.label}</h2>
                                            <p className="text-sm text-white/50 mt-0.5">{section.subtitle}</p>
                                        </div>
                                        <div className="ml-auto">
                                            <Badge variant="outline" className="border-white/20 text-white/60">
                                                {certs.filter(c => c.status === "active").length}/{certs.length} aktiv
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                {/* Karten Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {certs.map(cert => (
                                        <CertCard key={cert.id} cert={cert} />
                                    ))}
                                </div>
                            </div>
                        );
                    })}

                    {/* Lock Teaser */}
                    <div className="border-dashed border-2 border-muted-foreground/20 bg-muted/5 rounded-xl flex flex-col items-center justify-center p-8 text-center text-muted-foreground min-h-[160px]">
                        <div className="text-4xl mb-3 opacity-40">🔒</div>
                        <h3 className="font-bold text-lg mb-1">Weitere Zertifikate</h3>
                        <p className="text-sm">Schließen Sie weitere Inseln auf der Campus-Map ab, um neue Nachweise freizuschalten.</p>
                    </div>

                </div>
            </PremiumBackground>
        </RoleGuard>
    );
}
