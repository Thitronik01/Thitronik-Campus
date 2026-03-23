"use client";

import { useTranslations } from "next-intl";
import { PremiumBackground } from "@/components/layout/premium-background";
import { Configurator } from "@/components/tools/configurator";
import { Sliders } from "lucide-react";

export default function ConfiguratorPage() {
    const t = useTranslations("Navigation");

    return (
        <PremiumBackground>
            <div className="container mx-auto py-8">
                <header className="mb-12">
                    <h1 className="text-4xl font-extrabold text-white mb-4 flex items-center gap-4">
                        <Sliders className="w-10 h-10 text-brand-lime" />
                        Campus Konfigurator
                    </h1>
                    <p className="text-white/70 text-lg max-w-2xl">
                        Finden Sie die perfekte Thitronik Absicherung für Ihr Fahrzeug.
                    </p>
                </header>

                <Configurator />
            </div>
        </PremiumBackground>
    );
}
