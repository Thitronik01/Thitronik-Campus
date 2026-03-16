"use client";

import { useState } from "react";
import { useUserStore } from "@/store/user-store";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, AlertTriangle } from "lucide-react";

type ConfigState = {
    vehicle: string;
    centralUnit: string;
    accessories: string[];
};

export function ConfiguratorSimulator() {
    const { addXp } = useUserStore();

    const [config, setConfig] = useState<ConfigState>({
        vehicle: '',
        centralUnit: '',
        accessories: [],
    });

    const [feedback, setFeedback] = useState<{ message: string; isError: boolean } | null>(null);
    const [isCompleted, setIsCompleted] = useState(false);

    // Aufgabe
    const GOAL = {
        vehicle: 'kastenwagen',
        centralUnit: 'wipro3',
        requiredAccessories: ['nfc', 'gaswarner'],
    };

    const toggleAccessory = (accId: string) => {
        setConfig(prev => ({
            ...prev,
            accessories: prev.accessories.includes(accId)
                ? prev.accessories.filter(a => a !== accId)
                : [...prev.accessories, accId]
        }));
    };

    const validateConfiguration = () => {
        if (!config.vehicle) {
            setFeedback({ message: 'Bitte wählen Sie zuerst ein Basisfahrzeug aus.', isError: true });
            return;
        }
        if (!config.centralUnit) {
            setFeedback({ message: 'Bitte wählen Sie eine Zentrale (Alarmanlage) aus.', isError: true });
            return;
        }

        // Spezifische Fehler-Szenarien für Lerneffekt
        if (config.vehicle === 'integriert' && config.accessories.includes('magnetkontakte') && config.accessories.length === 1) {
            setFeedback({ message: 'Achtung: Bei integrierten Wohnmobilen gibt es oft mehr als 2 Aufbautüren. Prüfen Sie die Anzahl der benötigten Magnetkontakte genau.', isError: true });
            return;
        }

        // Check gegen das Ziel
        if (config.vehicle !== GOAL.vehicle) {
            setFeedback({ message: 'Das gewählte Fahrzeug passt nicht zur Kundenanforderung (Kastenwagen).', isError: true });
            return;
        }
        if (config.centralUnit !== GOAL.centralUnit) {
            setFeedback({ message: 'Für diesen Kunden wurde eine WiPro III angefragt.', isError: true });
            return;
        }

        const missingAccessories = GOAL.requiredAccessories.filter(req => !config.accessories.includes(req));
        if (missingAccessories.length > 0) {
            setFeedback({ message: `Die Konfiguration ist noch unvollständig. Der Kunde wollte auch: Gaswarner und NFC.`, isError: true });
            return;
        }

        // Success
        setFeedback({ message: 'Perfekt konfiguriert! Die Anlage deckt alle Kundenwünsche ab und passt zum Fahrzeugtyp.', isError: false });
        if (!isCompleted) {
            setIsCompleted(true);
            addXp(150); // Nutze den Global Gamer Store
        }
    };

    return (
        <Card className="max-w-4xl mx-auto border-border shadow-md animate-fade-in mt-6">
            <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-border pb-6 bg-muted/20">
                <div>
                    <CardTitle className="text-xl flex items-center gap-2 text-brand-navy mb-1">
                        <span className="text-2xl">⚙️</span> THITRONIK Konfigurator Simulator
                    </CardTitle>
                    <CardDescription>Übungs-Szenario: Konfiguration für Neukunden erstellen</CardDescription>
                </div>
                <div className="text-right flex flex-col items-end gap-2 mt-4 md:mt-0 max-w-sm">
                    <Badge variant="secondary" className="mb-1 text-xs">Aktuelle Aufgabe</Badge>
                    <div className="text-sm text-left bg-background p-3 rounded-lg border border-border italic text-muted-foreground shadow-sm">
                        <strong className="block text-foreground not-italic mb-1 text-xs">Kundenanforderung:</strong>
                        "Ich habe einen neuen Ducato Kastenwagen und hätte dafür gerne die WiPro III. Meine Frau möchte das per Smartphone entsperren können (NFC) und wir brauchen zwingend einen Gaswarner."
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-5 gap-8">
                {/* Left Col: Configurator Form */}
                <div className="md:col-span-3 space-y-8">

                    {/* Fahrzeug */}
                    <div>
                        <h3 className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wider">1. Basisfahrzeug</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { id: 'kastenwagen', label: 'Kastenwagen (z.B. Ducato)' },
                                { id: 'teilintegriert', label: 'Teilintegriert' },
                                { id: 'integriert', label: 'Vollintegriert' },
                                { id: 'alkoven', label: 'Alkoven' }
                            ].map(v => (
                                <button
                                    key={v.id}
                                    onClick={() => setConfig(prev => ({ ...prev, vehicle: v.id }))}
                                    className={`p-3 rounded-xl border text-sm text-left transition-all ${config.vehicle === v.id ? 'border-brand-sky bg-brand-sky/10 font-bold text-brand-sky shadow-sm' : 'border-border hover:border-brand-sky/50 bg-background cursor-pointer'}`}
                                >
                                    {v.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Zentrale */}
                    <div>
                        <h3 className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wider">2. Alarmsystem</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { id: 'wipro3', label: 'WiPro III (CAN-Bus)' },
                                { id: 'cas', label: 'C.A.S. III (Analog)' }
                            ].map(c => (
                                <button
                                    key={c.id}
                                    onClick={() => setConfig(prev => ({ ...prev, centralUnit: c.id }))}
                                    className={`p-3 rounded-xl border text-sm text-left transition-all ${config.centralUnit === c.id ? 'border-brand-sky bg-brand-sky/10 font-bold text-brand-sky shadow-sm' : 'border-border hover:border-brand-sky/50 bg-background cursor-pointer'}`}
                                >
                                    {c.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Zubehör */}
                    <div>
                        <h3 className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wider">3. Funk-Zubehör</h3>
                        <div className="space-y-2">
                            {[
                                { id: 'magnetkontakte', label: 'Funk-Magnetkontakte', desc: 'Sichert Fenster & Türen' },
                                { id: 'gaswarner', label: 'Funk-Gaswarner', desc: 'Narkosegas, Propan/Butan' },
                                { id: 'profinder', label: 'Pro-finder', desc: 'GPS-Ortung & Alarm-SMS' },
                                { id: 'nfc', label: 'NFC-Modul', desc: 'Entschärfen via Smartphone' },
                                { id: 'kabelschleife', label: 'Funk-Kabelschleife', desc: 'Sichert Fahrräder & Möbel' }
                            ].map(acc => (
                                <label key={acc.id} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${config.accessories.includes(acc.id) ? 'border-brand-sky bg-brand-sky/5' : 'border-border hover:border-brand-sky/40 bg-background'}`}>
                                    <input
                                        type="checkbox"
                                        className="mt-1 accent-brand-sky w-4 h-4 rounded-sm border-brand-sky text-brand-sky focus:ring-brand-sky"
                                        checked={config.accessories.includes(acc.id)}
                                        onChange={() => toggleAccessory(acc.id)}
                                    />
                                    <div>
                                        <span className={`block font-bold text-sm leading-none mb-1 ${config.accessories.includes(acc.id) ? 'text-brand-sky' : 'text-foreground'}`}>{acc.label}</span>
                                        <span className="block text-xs text-muted-foreground leading-tight">{acc.desc}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    <Button onClick={validateConfiguration} className="w-full bg-brand-navy hover:bg-brand-navy/90 text-white shadow-md text-lg py-6" disabled={isCompleted}>
                        Kunden-Konfiguration prüfen
                    </Button>

                </div>

                {/* Right Col: Summary & Validation Feedback */}
                <div className="md:col-span-2 bg-muted/30 p-5 rounded-2xl border border-border flex flex-col h-fit sticky top-6">
                    <h3 className="text-lg font-bold text-foreground mb-4 border-b border-border pb-2">Ihre Konfiguration</h3>

                    <ul className="space-y-3 mb-8 flex-1">
                        <li className="flex justify-between items-center text-sm border-b border-border/50 pb-2">
                            <span className="text-muted-foreground">Fahrzeug:</span>
                            <span className="font-bold text-foreground capitalize">{config.vehicle || '-'}</span>
                        </li>
                        <li className="flex justify-between items-center text-sm border-b border-border/50 pb-2">
                            <span className="text-muted-foreground">Zentrale:</span>
                            <span className="font-bold text-foreground">{config.centralUnit === 'wipro3' ? 'WiPro III' : config.centralUnit === 'cas' ? 'C.A.S. III' : '-'}</span>
                        </li>
                        <li className="text-sm pt-2">
                            <span className="block text-muted-foreground mb-2">Zubehör ({config.accessories.length}):</span>
                            {config.accessories.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {config.accessories.map(a => (
                                        <span key={a} className="bg-background border border-border px-2 py-1 rounded-md text-xs font-medium text-foreground capitalize">{a}</span>
                                    ))}
                                </div>
                            ) : (
                                <span className="text-xs text-muted-foreground italic">Kein Zubehör gewählt</span>
                            )}
                        </li>
                    </ul>

                    {/* Validation Box */}
                    {feedback && (
                        <div className={`p-4 rounded-xl shadow-sm border ${feedback.isError ? 'bg-destructive/5 border-destructive/20' : 'bg-brand-lime/10 border-brand-lime/30'} animate-in fade-in slide-in-from-bottom-2`}>
                            <div className="flex gap-3 items-start">
                                {feedback.isError ? <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" /> : <Check className="h-5 w-5 text-brand-lime shrink-0 mt-0.5" />}
                                <div>
                                    <h4 className={`font-bold mb-1 text-sm ${feedback.isError ? 'text-destructive' : 'text-brand-lime'}`}>
                                        {feedback.isError ? 'Feedback vom Ausbilder' : 'Ausgezeichnet!'}
                                    </h4>
                                    <p className={`text-xs ${feedback.isError ? 'text-foreground' : 'text-foreground/90'}`}>{feedback.message}</p>
                                </div>
                            </div>

                            {!feedback.isError && (
                                <div className="mt-4 pt-4 border-t border-brand-lime/20 flex justify-between items-center">
                                    <Badge className="bg-brand-lime text-brand-navy border-none shadow-sm hover:bg-brand-lime text-sm py-1">+150 XP Erhalten</Badge>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
