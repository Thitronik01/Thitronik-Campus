"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function QRCheckinPage() {
    const [scanResult, setScanResult] = useState<string | null>(null);
    const [scannerActive, setScannerActive] = useState(false);
    const [manualCode, setManualCode] = useState("");
    const [checkedIn, setCheckedIn] = useState(false);
    const scannerRef = useRef<HTMLDivElement>(null);
    const html5QrRef = useRef<any>(null);

    const startScanner = async () => {
        setScannerActive(true);
        try {
            const { Html5Qrcode } = await import("html5-qrcode");
            const scanner = new Html5Qrcode("qr-reader");
            html5QrRef.current = scanner;
            await scanner.start(
                { facingMode: "environment" },
                { fps: 10, qrbox: { width: 250, height: 250 } },
                (decodedText: string) => {
                    setScanResult(decodedText);
                    scanner.stop().catch(() => { });
                    setScannerActive(false);
                    handleCheckin(decodedText);
                },
                () => { }
            );
        } catch (err) {
            console.error("Scanner error:", err);
            setScannerActive(false);
        }
    };

    const stopScanner = () => {
        if (html5QrRef.current) {
            html5QrRef.current.stop().catch(() => { });
            setScannerActive(false);
        }
    };

    const handleCheckin = (code: string) => {
        // Simulate check-in
        setScanResult(code);
        setCheckedIn(true);
    };

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (manualCode.trim()) {
            handleCheckin(manualCode.trim());
        }
    };

    useEffect(() => {
        return () => { stopScanner(); };
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto space-y-8"
        >
            <div>
                <Badge className="mb-3">Live-Event</Badge>
                <h1>QR Check-in</h1>
                <p className="text-muted-foreground mt-1">
                    Scannen Sie den QR-Code am Veranstaltungsort, um am Live-Event teilzunehmen.
                </p>
            </div>

            {!checkedIn ? (
                <Tabs defaultValue="scan" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="scan">📷 QR scannen</TabsTrigger>
                        <TabsTrigger value="manual">⌨️ Code eingeben</TabsTrigger>
                    </TabsList>

                    <TabsContent value="scan">
                        <Card>
                            <CardContent className="pt-6">
                                <div
                                    id="qr-reader"
                                    ref={scannerRef}
                                    className="w-full aspect-square max-w-sm mx-auto bg-muted rounded-xl overflow-hidden mb-4"
                                >
                                    {!scannerActive && (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-center p-8">
                                            <span className="text-5xl mb-4">📱</span>
                                            <p className="text-sm text-muted-foreground mb-4">
                                                Kamera-Zugriff wird benötigt, um den QR-Code zu lesen.
                                            </p>
                                            <Button onClick={startScanner}>Kamera starten</Button>
                                        </div>
                                    )}
                                </div>
                                {scannerActive && (
                                    <div className="text-center">
                                        <p className="text-sm text-muted-foreground mb-3">
                                            Halten Sie den QR-Code in den markierten Bereich…
                                        </p>
                                        <Button variant="outline" onClick={stopScanner}>Abbrechen</Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="manual">
                        <Card>
                            <CardContent className="pt-6">
                                <form onSubmit={handleManualSubmit} className="space-y-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-3">
                                            Geben Sie den 6-stelligen Event-Code ein, der auf dem Bildschirm des Trainers angezeigt wird.
                                        </p>
                                        <Input
                                            value={manualCode}
                                            onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                                            placeholder="z.B. TH-2026-A"
                                            className="text-center text-lg font-mono tracking-widest"
                                            maxLength={12}
                                        />
                                    </div>
                                    <Button type="submit" className="w-full" disabled={!manualCode.trim()}>
                                        Einchecken
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            ) : (
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                >
                    <Card className="text-center border-brand-sky/30 bg-brand-sky/5">
                        <CardContent className="pt-10 pb-10">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                className="text-7xl mb-6"
                            >
                                ✅
                            </motion.div>
                            <h2 className="text-brand-navy mb-2">Erfolgreich eingecheckt!</h2>
                            <p className="text-muted-foreground mb-4 max-w-sm mx-auto">
                                Sie nehmen am Live-Event teil. Der Trainer wird die erste Station in Kürze freischalten.
                            </p>
                            <Badge variant="secondary" className="text-sm px-4 py-1">
                                Event: {scanResult || manualCode}
                            </Badge>
                            <div className="mt-6 p-4 bg-muted rounded-xl max-w-sm mx-auto">
                                <p className="text-xs text-muted-foreground mb-2">Wartet auf Trainer…</p>
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-brand-sky animate-pulse"></div>
                                    <span className="text-sm font-bold text-brand-navy">Live-Verbindung aktiv</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* Info */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Wie funktioniert es?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex gap-3">
                        <span className="text-lg">1️⃣</span>
                        <span>Der Trainer zeigt einen QR-Code auf dem Beamer oder gibt einen Event-Code durch.</span>
                    </div>
                    <div className="flex gap-3">
                        <span className="text-lg">2️⃣</span>
                        <span>Sie scannen den QR-Code mit Ihrer Kamera oder geben den Code manuell ein.</span>
                    </div>
                    <div className="flex gap-3">
                        <span className="text-lg">3️⃣</span>
                        <span>Sobald eingecheckt, werden Live-Aufgaben und Timer synchron auf Ihrem Gerät angezeigt.</span>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
