import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "Metadata" });
    return {
        title: t("profile_title"),
        description: t("profile_desc"),
        openGraph: {
            title: t("profile_title"),
            description: t("profile_desc"),
        }
    };
}

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
