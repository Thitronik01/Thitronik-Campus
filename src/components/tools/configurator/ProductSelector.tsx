import { useState } from "react";
import { HARD_RULES, RECOMMENDATIONS } from "@/lib/configurator-rules";
import { CheckCircle2, AlertCircle, Info, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Mocking product data that would normally come from Supabase for this component's logic
const PRODUCTS = [
    { sku: '100760', name: 'WiPro III', category: 'alarm_base', is_base_unit: true },
    { sku: '100770', name: 'WiPro III safe.lock', category: 'alarm_base', is_base_unit: true },
    { sku: '105750', name: 'G.A.S.-connect', category: 'gas_warning', is_base_unit: false },
    { sku: '105700', name: 'G.A.S.-pro', category: 'gas_warning', is_base_unit: false },
    { sku: '105710', name: 'Pro-finder', category: 'tracking', is_base_unit: false },
    { sku: '101052', name: 'safe.lock Umrüstplatine', category: 'module', is_base_unit: false },
    { sku: '100089', name: 'Backup-Sirene', category: 'siren', is_base_unit: false },
];

interface ProductSelectorProps {
  vehicleSlug: string | null;
}

export function ProductSelector({ vehicleSlug }: ProductSelectorProps) {
  const [selectedSkus, setSelectedSkus] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const hasBaseUnit = selectedSkus.includes('100760') || selectedSkus.includes('100770');

  const addProduct = (sku: string) => {
    setErrorMsg(null);

    // Rule: safe.lock only for Ducato/Boxer/Jumper
    if (sku === '100770' && vehicleSlug && !HARD_RULES.safelockVehicles.includes(vehicleSlug)) {
        setErrorMsg("Die WiPro III safe.lock ist für das ausgewählte Fahrzeug nicht verfügbar. Bitte wählen Sie die WiPro III (100760).");
        return;
    }

    // Rule: Upgrade blocked by safe.lock
    if (sku === '101052' && selectedSkus.includes('100770')) {
        setErrorMsg("WiPro III safe.lock hat safe.lock bereits integriert – Umrüstplatine nicht nötig.");
        return;
    }
    if (sku === '100770' && selectedSkus.includes('101052')) {
        setErrorMsg("Umrüstplatine und safe.lock Anlage dürfen nicht gleichzeitig ausgewählt werden.");
        return;
    }

    // Example dependency check (G.A.S.-connect without base unit)
    if (sku === '105750' && !hasBaseUnit) {
        setErrorMsg("G.A.S.-connect benötigt ein WiPro III oder WiPro III safe.lock als Basisgerät.");
        return; // Alternatively, allow adding but show error in UI. We block here.
    }

    if (!selectedSkus.includes(sku)) {
      setSelectedSkus([...selectedSkus, sku]);
    }
  };

  const removeProduct = (sku: string) => {
    setErrorMsg(null);
    setSelectedSkus(selectedSkus.filter(s => s !== sku));
  };

  const recommendations = RECOMMENDATIONS.filter(rec => {
    // Check triggers
    let triggerMatch = false;
    if (rec.trigger.hasBaseUnit && hasBaseUnit) triggerMatch = true;
    if (rec.trigger.hasSku && selectedSkus.includes(rec.trigger.hasSku)) triggerMatch = true;
    
    if (triggerMatch && !selectedSkus.includes(rec.trigger.missing)) {
      if (rec.onlyForVehicles && vehicleSlug && !rec.onlyForVehicles.includes(vehicleSlug)) {
        return false;
      }
      return true;
    }
    return false;
  });

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white mb-4">Produktauswahl</h3>

      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="font-medium text-sm">{errorMsg}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
            <h4 className="text-white/70 text-sm font-semibold uppercase tracking-wider">Verfügbare Produkte</h4>
            <div className="space-y-2">
                {PRODUCTS.filter(p => !selectedSkus.includes(p.sku)).map(prod => (
                    <div key={prod.sku} className="bg-white/5 border border-white/10 p-3 rounded-lg flex items-center justify-between hover:bg-white/10 transition-colors">
                        <div>
                            <p className="text-white font-medium">{prod.name}</p>
                            <p className="text-white/40 text-xs font-mono">{prod.sku}</p>
                        </div>
                        <button onClick={() => addProduct(prod.sku)} className="bg-brand-lime/20 text-brand-lime hover:bg-brand-lime hover:text-brand-navy p-2 rounded-md transition-colors">
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>

        <div className="space-y-3">
            <h4 className="text-white/70 text-sm font-semibold uppercase tracking-wider">Gewählte Konfiguration</h4>
            <div className="space-y-2">
                {selectedSkus.length === 0 ? (
                    <div className="text-white/30 text-center p-6 border border-dashed border-white/10 rounded-lg">
                        Keine Produkte ausgewählt
                    </div>
                ) : (
                    PRODUCTS.filter(p => selectedSkus.includes(p.sku)).map(prod => (
                        <div key={prod.sku} className="bg-brand-navy border border-brand-lime/50 p-3 rounded-lg flex items-center justify-between shadow-[0_0_15px_rgba(204,255,0,0.1)]">
                            <div>
                                <p className="text-white font-medium flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-brand-lime" /> {prod.name}
                                </p>
                                <p className="text-brand-lime/70 text-xs font-mono">{prod.sku}</p>
                            </div>
                            <button onClick={() => removeProduct(prod.sku)} className="text-white/40 hover:text-red-400 p-2 transition-colors">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
      </div>

      {recommendations.length > 0 && (
        <div className="mt-6 space-y-3">
            <h4 className="text-white/70 text-sm font-semibold uppercase tracking-wider">Empfehlungen</h4>
            {recommendations.map((rec, i) => (
                <div key={i} className={cn(
                    "p-4 rounded-xl border flex gap-3 items-center",
                    rec.severity === 'warning' ? "bg-yellow-500/10 border-yellow-500/50 text-yellow-100" : "bg-blue-500/10 border-blue-500/50 text-blue-100"
                )}>
                    {rec.severity === 'warning' ? <AlertCircle className="w-5 h-5 text-yellow-400" /> : <Info className="w-5 h-5 text-blue-400" />}
                    <p className="text-sm">{rec.message}</p>
                </div>
            ))}
        </div>
      )}
    </div>
  );
}
