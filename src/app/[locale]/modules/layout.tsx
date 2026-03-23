import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "Metadata" });
    return {
        title: t("modules_title"),
        description: t("modules_desc"),
        openGraph: {
            title: t("modules_title"),
            description: t("modules_desc"),
        }
    };
}

export default function ModulesLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
