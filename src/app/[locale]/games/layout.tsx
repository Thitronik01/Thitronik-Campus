import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "Metadata" });
    return {
        title: t("games_title"),
        description: t("games_desc"),
        openGraph: {
            title: t("games_title"),
            description: t("games_desc"),
        }
    };
}

export default function GamesLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
