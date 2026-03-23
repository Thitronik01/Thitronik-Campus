import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "Metadata" });
    return {
        title: t("tools_title"),
        description: t("tools_desc"),
        openGraph: {
            title: t("tools_title"),
            description: t("tools_desc"),
        }
    };
}

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
