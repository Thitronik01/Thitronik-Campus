"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export function AppFooter() {
    const t = useTranslations("Navigation");

    return (
        <footer
            className="border-t border-white/10 bg-brand-navy/80 backdrop-blur-sm py-6"
            style={{ borderTopColor: "rgba(59,169,211,0.2)" }}
        >
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40">
                <span>{t("footer_copyright")}</span>
                <div className="flex gap-4">
                    <Link href="/impressum" className="hover:text-brand-sky transition-colors">
                        {t("imprint")}
                    </Link>
                    <Link href="/datenschutz" className="hover:text-brand-sky transition-colors">
                        {t("privacy")}
                    </Link>
                    <Link href="/kontakt" className="hover:text-brand-sky transition-colors">
                        {t("contact")}
                    </Link>
                </div>
            </div>
        </footer>
    );
}
