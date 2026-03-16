"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { QrCode, Smartphone, CheckCircle2, Loader2 } from "lucide-react";

export function QRScannerCard() {
    const [scannerActive, setScannerActive] = useState(false);
    const [manualCode, setManualCode] = useState("");
    const [checkedIn, setCheckedIn] = useState(false);
    const [scanResult, setScanResult] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const html5QrRef = useRef<any>(null);

    const startScanner = async () => {
        setIsLoading(true);
        setScannerActive(true);
        try {
            const { Html5Qrcode } = await import("html5-qrcode");
            const scanner = new Html5Qrcode("qr-reader-dashboard");
            html5QrRef.current = scanner;
            await scanner.start(
                { facingMode: "environment" },
                { fps: 10, qrbox: { width: 200, height: 200 } },
                (decodedText: string) => {
                    handleCheckin(decodedText);
                    scanner.stop().catch(() => { });
                    setScannerActive(false);
                },
                () => { }
            );
        } catch (err) {
            console.error("Scanner error:", err);
            setScannerActive(false);
        } finally {
            setIsLoading(false);
        }
    };

    const stopScanner = async () => {
        if (html5QrRef.current && scannerActive) {
            try {
                await html5QrRef.current.stop();
                await html5QrRef.current.clear();
                html5QrRef.current = null;
                setScannerActive(false);
            } catch (err) {
                console.warn("Stop/Clear error:", err);
                // Even if it fails, clear the ref and active state to prevent stuck UI
                html5QrRef.current = null;
                setScannerActive(false);
            }
        }
    };

    const handleCheckin = (code: string) => {
        setIsLoading(true);
        // Simulate API delay
        setTimeout(() => {
            setScanResult(code);
            setCheckedIn(true);
            setIsLoading(false);
        }, 800);
    };

    useEffect(() => {
        return () => {
            if (html5QrRef.current) {
                const scanner = html5QrRef.current;
                // Important: clear() is better than stop() for final cleanup
                // it removes all injected DOM elements immediately
                scanner.clear().catch((err: any) => console.error("Scanner clear error:", err));
            }
        };
    }, []);

    return (
        <Card className="overflow-hidden border-brand-sky/20 shadow-lg">
            <CardHeader className="bg-brand-navy pb-6 pt-6">
                <CardTitle className="text-white flex items-center gap-3">
                    <QrCode className="w-6 h-6 text-brand-sky" />
                    Event Check-in
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <AnimatePresence mode="wait">
                    {!checkedIn ? (
                        <motion.div
                            key="scanner"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="p-6 space-y-6"
                        >
                            <div
                                id="qr-reader-dashboard"
                                className="w-full aspect-square max-w-[280px] mx-auto bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 overflow-hidden relative"
                            >
                                {!scannerActive && !isLoading && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                                        <Smartphone className="w-12 h-12 text-slate-300 mb-4" />
                                        <p className="text-sm text-slate-500 mb-4 font-medium">
                                            Nutzen Sie die Kamera für den schnellen Check-in vor Ort.
                                        </p>
                                        <Button onClick={startScanner} className="bg-brand-sky hover:bg-brand-sky/90 text-white font-bold px-8">
                                            Kamera starten
                                        </Button>
                                    </div>
                                )}
                                {isLoading && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-10">
                                        <Loader2 className="w-8 h-8 text-brand-sky animate-spin" />
                                    </div>
                                )}
                            </div>

                            {scannerActive && (
                                <div className="text-center">
                                    <Button variant="ghost" onClick={stopScanner} className="text-slate-400 hover:text-brand-red">
                                        Abbrechen
                                    </Button>
                                </div>
                            )}

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-slate-100" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-3 text-slate-400 font-bold tracking-widest">ODER CODE</span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Input
                                    placeholder="z.B. TH-2026-A"
                                    value={manualCode}
                                    onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                                    className="font-mono text-center tracking-widest border-slate-200 focus:border-brand-sky"
                                />
                                <Button
                                    onClick={() => handleCheckin(manualCode)}
                                    disabled={!manualCode || isLoading}
                                    className="bg-brand-navy hover:bg-brand-navy/90 text-white"
                                >
                                    Go
                                </Button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-10 text-center space-y-6 bg-brand-lime/5"
                        >
                            <div className="w-20 h-20 bg-brand-lime text-brand-navy rounded-full flex items-center justify-center mx-auto shadow-lg shadow-brand-lime/20">
                                <CheckCircle2 className="w-10 h-10" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-brand-navy">Check-in erfolgreich!</h3>
                                <p className="text-sm text-slate-500 mt-2">
                                    Sie sind für das Event <span className="font-bold text-brand-navy underline">{scanResult || manualCode}</span> registriert.
                                </p>
                            </div>
                            <Badge variant="outline" className="bg-white border-brand-lime text-brand-navy font-bold px-4 py-1">
                                Status: Live Verbindung aktiv
                            </Badge>
                            <div className="pt-4">
                                <Button variant="ghost" onClick={() => setCheckedIn(false)} className="text-xs text-slate-400">
                                    Anderes Event scannen
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>
        </Card>
    );
}
