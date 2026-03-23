"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VehicleFeature, UseCase, Manufacturer, ConfiguratorResult } from "@/lib/configurator/types";
import { VEHICLES } from "@/lib/configurator/data";
import { evaluateConfiguration } from "@/lib/configurator/logic";
import { ChevronRight, ChevronLeft, Car, ShieldCheck, AlertTriangle, AlertCircle, Info, Settings2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { WarningBanner } from "./WarningBanner";
import { ProductSelector } from "./ProductSelector";

const USE_CASES: UseCase[] = [
    "Alarm",
    "Alarm + Zentralverriegelung",
    "Alarm + Gaswarnung",
    "Ortung",
    "Komplettsystem",
    "Nur Gaswarnung"
];

const YEARS = Array.from({ length: new Date().getFullYear() - 2005 + 1 }, (_, i) => new Date().getFullYear() + 1 - i);

export function Configurator() {
    const [step, setStep] = useState(1);
    
    // Step 1 State
    const [manufacturer, setManufacturer] = useState<Manufacturer | "">("");
    const [model, setModel] = useState<string>("");
    const [year, setYear] = useState<number | "">("");
    const [selectedFeatures, setSelectedFeatures] = useState<VehicleFeature[]>([]);
    
    // Step 2 State
    const [useCase, setUseCase] = useState<UseCase | "">("");

    // Step 3 Result State
    const [result, setResult] = useState<ConfiguratorResult | null>(null);

    const activeManufacturer = useMemo(() => {
        return VEHICLES.find(v => v.manufacturer === manufacturer);
    }, [manufacturer]);

    const activeModel = useMemo(() => {
        return activeManufacturer?.models.find(m => m.id === model);
    }, [activeManufacturer, model]);

    const canProceedToStep2 = manufacturer && model && year;
    const canProceedToStep3 = true; // In this version, we don't strictly require a use case or any specific selection to view summary

    const handleFeatureToggle = (feature: VehicleFeature) => {
        setSelectedFeatures(prev => 
            prev.includes(feature) ? prev.filter(f => f !== feature) : [...prev, feature]
        );
    };

    const handleNext = () => {
        if (step === 1 && canProceedToStep2) setStep(2);
        else if (step === 2 && canProceedToStep3) {
            // Evaluate generic logic for DIP switches etc based on vehicle, ignoring manual products for now
            const res = evaluateConfiguration({
                manufacturer: manufacturer as Manufacturer,
                model,
                year: year as number,
                features: selectedFeatures,
                useCase: "Alarm" as UseCase // Fallback
            });
            setResult(res);
            setStep(3);
        }
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const resetConfigurator = () => {
        setManufacturer("");
        setModel("");
        setYear("");
        setSelectedFeatures([]);
        setUseCase("");
        setResult(null);
        setStep(1);
    };

    const renderStepIndicators = () => (
        <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2">
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center gap-2">
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors",
                            step >= s ? "bg-brand-lime text-brand-navy" : "bg-white/10 text-white/50"
                        )}>
                            {s}
                        </div>
                        {s < 3 && (
                            <div className={cn(
                                "w-12 h-1 rounded-full transition-colors",
                                step > s ? "bg-brand-lime" : "bg-white/10"
                            )}></div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    const renderStep1 = () => (
        <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <WarningBanner vehicleSlug={activeModel ? String(activeModel.id) : null} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Herstelle */}
                <div className="space-y-3">
                    <label className="text-white/80 font-medium">Hersteller</label>
                    <select
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-lime transition-all"
                        value={manufacturer}
                        onChange={(e) => {
                            setManufacturer(e.target.value as Manufacturer);
                            setModel(""); // Reset model on manufacturer change
                            setSelectedFeatures([]);
                        }}
                    >
                        <option value="" disabled className="text-black">Bitte wählen...</option>
                        {VEHICLES.map(v => (
                            <option key={v.manufacturer} value={v.manufacturer} className="text-black">{v.manufacturer}</option>
                        ))}
                    </select>
                </div>

                {/* Jahr */}
                <div className="space-y-3">
                    <label className="text-white/80 font-medium">Baujahr</label>
                    <select
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-lime transition-all disabled:opacity-50"
                        value={year}
                        onChange={(e) => setYear(parseInt(e.target.value, 10))}
                        disabled={!manufacturer}
                    >
                        <option value="" disabled className="text-black">Bitte wählen...</option>
                        {YEARS.map(y => (
                            <option key={y} value={y} className="text-black">{y}</option>
                        ))}
                    </select>
                </div>

                {/* Modell */}
                <div className="space-y-3 md:col-span-2">
                    <label className="text-white/80 font-medium">Modell</label>
                    <select
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-lime transition-all disabled:opacity-50"
                        value={model}
                        onChange={(e) => {
                            setModel(e.target.value);
                            setSelectedFeatures([]);
                        }}
                        disabled={!manufacturer}
                    >
                        <option value="" disabled className="text-black">Bitte wählen...</option>
                        {activeManufacturer?.models.map(m => (
                            <option key={m.id} value={m.id} className="text-black">{m.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Features (Dynamically shown based on model) */}
            {activeModel && activeModel.features.length > 0 && (
                <div className="mt-8 space-y-4">
                    <h3 className="text-white font-medium flex items-center gap-2">
                        <Settings2 className="w-5 h-5 text-brand-lime" />
                        Besonderheiten (falls zutreffend)
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {activeModel.features.map(feat => (
                            <button
                                key={feat}
                                onClick={() => handleFeatureToggle(feat as VehicleFeature)}
                                className={cn(
                                    "px-4 py-2 rounded-full border transition-all",
                                    selectedFeatures.includes(feat as VehicleFeature)
                                        ? "bg-brand-lime/20 border-brand-lime text-brand-lime"
                                        : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                                )}
                            >
                                {feat}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </motion.div>
    );

    const renderStep2 = () => (
        <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <WarningBanner vehicleSlug={activeModel ? String(activeModel.id) : null} />
            <ProductSelector vehicleSlug={activeModel ? String(activeModel.id) : null} />
        </motion.div>
    );

    const renderStep3 = () => {
        if (!result) return null;
        return (
            <motion.div
                key="step3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
            >
                <div className="bg-brand-navy/50 border border-brand-lime/30 rounded-xl p-6">
                    <h2 className="text-2xl font-bold text-white mb-2">{result.vehicleName}</h2>
                    <p className="text-brand-lime font-medium text-lg">{useCase}</p>
                </div>

                {/* Base Unit */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <CheckCircle2 className="text-brand-lime" />
                        Empfohlene Zentrale
                    </h3>
                    <div className="flex justify-between items-center bg-black/20 rounded-lg p-4">
                        <span className="text-white font-bold text-lg">{result.baseUnit.name}</span>
                        <span className="text-white/50 text-sm font-mono">Art-Nr: {result.baseUnit.artNr}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        {result.minSerialNumber && (
                            <div className="bg-black/20 rounded-lg p-3 flex flex-col items-center justify-center">
                                <span className="text-white/60 text-xs uppercase tracking-wider mb-1">Mindest-Seriennummer</span>
                                <span className="text-white font-mono font-bold">{result.minSerialNumber}</span>
                            </div>
                        )}
                        {result.minSoftware && (
                            <div className="bg-black/20 rounded-lg p-3 flex flex-col items-center justify-center">
                                <span className="text-white/60 text-xs uppercase tracking-wider mb-1">Mindest-Software</span>
                                <span className="text-white font-mono font-bold">v {result.minSoftware}</span>
                            </div>
                        )}
                    </div>

                    {/* DIP Switches */}
                    {result.dipSwitches && (
                        <div className="mt-6">
                            <h4 className="text-white/80 font-medium mb-3 text-sm uppercase tracking-widest">DIP-Switch-Einstellung</h4>
                            <div className="flex justify-between sm:justify-start sm:gap-4">
                                {Object.entries(result.dipSwitches).map(([sw, val]) => (
                                    <div key={sw} className="flex flex-col items-center">
                                        <div className={cn(
                                            "w-12 h-16 rounded mb-2 relative flex flex-col justify-end p-1 border-2",
                                            val === "ON" ? "bg-brand-lime/20 border-brand-lime" : "bg-white/10 border-white/20"
                                        )}>
                                            <div className={cn(
                                                "w-full h-6 rounded-sm absolute transition-all",
                                                val === "ON" ? "top-1 bg-brand-lime" : "bottom-1 bg-white/40"
                                            )} />
                                        </div>
                                        <span className="text-white/50 text-xs font-mono uppercase">{sw}</span>
                                        <span className={cn(
                                            "text-xs font-bold",
                                            val === "ON" ? "text-brand-lime" : "text-white/40"
                                        )}>{val}</span>
                                    </div>
                                ))}
                            </div>
                            <p className="text-white/50 text-xs mt-3 flex items-center gap-1">
                                <Info className="w-3 h-3" /> Im Zweifel die Universal-Einstellung (alle OFF) verwenden.
                            </p>
                        </div>
                    )}
                </div>

                {/* Accessories required/recommended */}
                {(result.mandatoryAccessories.length > 0 || result.recommendedAccessories.length > 0) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {result.mandatoryAccessories.length > 0 && (
                            <div className="bg-white/5 border border-red-500/30 rounded-xl p-6">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <AlertCircle className="text-red-400 w-5 h-5" />
                                    Pflicht-Zubehör
                                </h3>
                                <ul className="space-y-4">
                                    {result.mandatoryAccessories.map((acc, i) => (
                                        <li key={i} className="flex flex-col gap-1 border-b border-white/10 pb-3 last:border-0 last:pb-0">
                                            <div className="flex justify-between items-start">
                                                <span className="text-white font-medium">{acc.name}</span>
                                                <span className="text-white/40 text-xs font-mono">{acc.artNr}</span>
                                            </div>
                                            <span className="text-white/60 text-sm">{acc.reason}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {result.recommendedAccessories.length > 0 && (
                            <div className="bg-white/5 border border-brand-lime/30 rounded-xl p-6">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <CheckCircle2 className="text-brand-lime w-5 h-5" />
                                    Empfohlenes Zubehör
                                </h3>
                                <ul className="space-y-4">
                                    {result.recommendedAccessories.map((acc, i) => (
                                        <li key={i} className="flex flex-col gap-1 border-b border-white/10 pb-3 last:border-0 last:pb-0">
                                            <div className="flex justify-between items-start">
                                                <span className="text-white font-medium">{acc.name}</span>
                                                <span className="text-white/40 text-xs font-mono">{acc.artNr}</span>
                                            </div>
                                            <span className="text-white/60 text-sm">{acc.reason}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {/* Warnings and Notes */}
                {(result.warnings.length > 0 || result.installationNote) && (
                    <div className="space-y-4">
                        {result.warnings.map((w, i) => (
                            <div key={i} className={cn(
                                "p-4 rounded-xl border flex gap-3 items-start",
                                w.level === "Kritisch" ? "bg-red-500/10 border-red-500/50 text-red-100" :
                                w.level === "Warnung" ? "bg-yellow-500/10 border-yellow-500/50 text-yellow-100" :
                                "bg-blue-500/10 border-blue-500/50 text-blue-100"
                            )}>
                                <AlertTriangle className={cn(
                                    "w-5 h-5 shrink-0 mt-0.5",
                                    w.level === "Kritisch" ? "text-red-400" :
                                    w.level === "Warnung" ? "text-yellow-400" :
                                    "text-blue-400"
                                )} />
                                <div>
                                    <p className="font-bold text-sm mb-1 uppercase tracking-wider opacity-80">{w.level}</p>
                                    <p>{w.message}</p>
                                </div>
                            </div>
                        ))}
                        {result.installationNote && (
                            <div className="bg-white/5 border border-white/20 p-4 rounded-xl flex gap-3">
                                <Info className="w-5 h-5 text-brand-lime shrink-0" />
                                <div>
                                    <p className="font-bold text-white text-sm mb-1 uppercase tracking-wider opacity-80">Installationshinweis</p>
                                    <p className="text-white/80">{result.installationNote}</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </motion.div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto">
            {renderStepIndicators()}
            
            <Card className="bg-white/5 border-white/10 backdrop-blur-xl mb-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-lime via-transparent to-transparent"></div>
                <CardHeader className="text-center pb-2">
                    <CardTitle className="text-3xl font-bold text-white mb-2">
                        {step === 1 ? "Fahrzeugauswahl" : step === 2 ? "Absicherungsbedarf" : "Konfigurations-Ergebnis"}
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 relative min-h-[400px]">
                    <AnimatePresence mode="wait">
                        {step === 1 && renderStep1()}
                        {step === 2 && renderStep2()}
                        {step === 3 && renderStep3()}
                    </AnimatePresence>
                </CardContent>
            </Card>

            <div className="flex justify-between items-center">
                {step > 1 && step < 3 && (
                    <Button variant="outline" onClick={handleBack} className="bg-white/5 border-white/20 text-white hover:bg-white/10">
                        <ChevronLeft className="mr-2 w-4 h-4" /> Zurück
                    </Button>
                )}
                {step === 3 && (
                    <Button variant="outline" onClick={resetConfigurator} className="bg-white/5 border-white/20 text-white hover:bg-white/10">
                        Neue Konfiguration
                    </Button>
                )}
                <div className="ml-auto">
                    {step === 1 && (
                        <Button 
                            onClick={handleNext} 
                            disabled={!canProceedToStep2}
                            className="bg-brand-lime text-brand-navy hover:bg-brand-lime/90"
                        >
                            Weiter <ChevronRight className="ml-2 w-4 h-4" />
                        </Button>
                    )}
                    {step === 2 && (
                        <Button 
                            onClick={handleNext} 
                            disabled={!canProceedToStep3}
                            className="bg-brand-lime text-brand-navy hover:bg-brand-lime/90"
                        >
                            Ergebnis anzeigen <ChevronRight className="ml-2 w-4 h-4" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
