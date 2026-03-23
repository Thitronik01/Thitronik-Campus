"use client";

import { useRouter, usePathname } from "@/i18n/routing";
import { useLocale } from "next-intl";

const LOCALES = ["de", "en", "fr"] as const;

export function LanguageSwitcher() {
    const router = useRouter();
    const pathname = usePathname();
    const currentLocale = useLocale();

    return (
        <div className="hidden md:flex gap-0.5 text-[11px] font-bold bg-white/10 rounded-lg px-1 py-0.5">
            {LOCALES.map((l) => (
                <button
                    key={l}
                    onClick={() => router.replace(pathname, { locale: l })}
                    className={`px-1.5 py-0.5 rounded uppercase ${
                        l === currentLocale ? "bg-white/20 text-white" : "text-white/40 hover:text-white/70"
                    }`}
                >
                    {l}
                </button>
            ))}
        </div>
    );
}
