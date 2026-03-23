import { AlertTriangle, Info, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { VEHICLE_WARNINGS } from "@/lib/configurator-rules";
import { motion, AnimatePresence } from "framer-motion";

interface WarningBannerProps {
  vehicleSlug: string | null;
}

export function WarningBanner({ vehicleSlug }: WarningBannerProps) {
  if (!vehicleSlug || !VEHICLE_WARNINGS[vehicleSlug]) return null;

  const warnings = VEHICLE_WARNINGS[vehicleSlug];

  return (
    <div className="space-y-3 mb-6">
      <AnimatePresence>
        {warnings.map((warning, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-yellow-500/10 border border-yellow-500/50 text-yellow-100 p-4 rounded-xl flex gap-3 items-start"
          >
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-yellow-400" />
            <div>
              <p className="font-bold text-sm mb-1 uppercase tracking-wider opacity-80">Wichtiger Hinweis</p>
              <p>{warning}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
