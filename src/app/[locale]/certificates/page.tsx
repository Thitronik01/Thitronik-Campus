"use client";

import { useUserStore } from "@/store/user-store";
import { useAuthStore } from "@/store/auth-store";
import { RoleGuard } from "@/components/auth/role-guard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { PremiumBackground } from "@/components/layout/premium-background";

const MOCK_CERTIFICATES = [
    {
        id: "cert_wipro",
        title: "WiPro III Experte",
        date: "14.10.2025",
        expiresDura: 365, // days
        status: "active",
        type: "Hardware Installation",
    },
    {
        id: "cert_profinder",
        title: "Pro-finder Advanced",
        date: "05.11.2023",
        expiresDura: 730, // 2 years
        status: "expired",
        type: "Diagnose & Service",
    },
    {
        id: "cert_sales",
        title: "Smart-Home Beratung",
        date: "20.01.2026",
        expiresDura: 365,
        status: "active",
        type: "Vertrieb",
    },
    {
        id: "cert_smoke",
        title: "Rauchmelder Profi",
        date: "28.02.2026",
        expiresDura: 1095,
        status: "active",
        type: "Sicherheitstechnik",
        color: "sky"
    },
    {
        id: "cert_campus2026",
        title: "Campus 2026",
        date: "09.03.2026",
        expiresDura: 365,
        status: "active",
        type: "Campus Evolution",
        color: "lime"
    }
];

export default function CertificatesPage() {
    const { user } = useAuthStore();
    const { name: gameName } = useUserStore();
    const displayName = user?.name || gameName || "THITRONIK Partner";

    return (
        <RoleGuard requiredRole="user">
            <PremiumBackground>
                <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-20 p-4 md:p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/10 pb-6 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
                                <span className="text-4xl text-white">🎓</span> Zertifikate & Nachweise
                            </h1>
                            <p className="text-white/70 text-lg mt-2 max-w-2xl font-medium">
                                Hier finden Sie alle erfolgreich abgeschlossenen Module als offizielle PDF-Nachweise.
                            </p>
                        </div>
                    </div>

                    {/* Certificate Vault Intro */}
                    <Card className="bg-brand-navy border-none text-white shadow-md relative overflow-hidden">
                        {/* Deco background */}
                        <div className="absolute -top-24 -right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
                        <div className="absolute bottom-[-10px] left-[-20%] w-[50%] h-[150%] bg-gradient-to-r from-brand-sky/20 to-transparent skew-x-12 pointer-events-none"></div>

                        <CardHeader className="relative z-10">
                            <CardTitle className="text-xl">Hallo {displayName},</CardTitle>
                            <CardDescription className="text-white/80">
                                Sie haben derzeit <strong className="text-brand-lime">4 aktive Zertifikate</strong>. Halten Sie diese aktuell, um den "THITRONIK Premium-Partner" Status Ihres Autohauses zu sichern.
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    {/* Cert Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {MOCK_CERTIFICATES.map((cert) => (
                            <Card
                                key={cert.id}
                                className={`flex flex-col h-full border ${cert.status === "expired"
                                    ? "border-destructive/30 bg-destructive/5 grayscale-[0.3]"
                                    : (cert.id === "cert_smoke" ? "border-sky-400/50 bg-sky-400/10" :
                                        cert.id === "cert_campus2026" ? "border-brand-lime/50 bg-brand-lime/10 shadow-[0_0_15px_rgba(163,230,53,0.1)]" :
                                            "border-brand-sky/20")
                                    } hover:shadow-md transition-all`}
                            >
                                <CardHeader className="pb-4 border-b border-border">
                                    <div className="flex justify-between items-start mb-2">
                                        <Badge variant={cert.status === "active" ? "default" : "destructive"} className={cert.status === "active" ? "bg-brand-sky" : ""}>
                                            {cert.status === "active" ? "Gültig" : "Abgelaufen"}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{cert.type}</span>
                                    </div>
                                    <CardTitle className={`text-lg ${cert.status === "expired" ? "text-destructive" : "text-brand-navy"}`}>
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

                                    <div className="mt-8 pt-4 border-t border-border flex justify-between gap-3">
                                        {cert.status === "active" ? (
                                            <>
                                                <Button variant="outline" className="flex-1 border-brand-sky/30 text-brand-sky hover:bg-brand-sky/10" asChild>
                                                    {/* Placeholder for PDF Download logic */}
                                                    <a href={`/api/pdf?id=${cert.id}`} target="_blank" rel="noopener noreferrer">
                                                        PDF Ansicht
                                                    </a>
                                                </Button>
                                            </>
                                        ) : (
                                            <Button className="w-full bg-brand-navy hover:bg-brand-sky text-white">
                                                Jetzt Re-Zertifizieren
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {/* Empty State / Lock Card */}
                        <Card className="border-dashed border-2 border-muted-foreground/30 bg-muted/10 flex flex-col items-center justify-center p-8 text-center text-muted-foreground min-h-[250px]">
                            <div className="text-4xl mb-3 opacity-50">🔒</div>
                            <h3 className="font-bold text-lg mb-1">Weitere Zertifikate</h3>
                            <p className="text-sm">Schließen Sie weitere Inseln auf der Campus-Map ab, um neue Nachweise freizuschalten.</p>
                        </Card>
                    </div>
                </div>
            </PremiumBackground>
        </RoleGuard>
    );
}
