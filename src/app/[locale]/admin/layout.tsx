import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "Metadata" });
    return {
        title: t("admin_title"),
        description: t("admin_desc"),
        openGraph: {
            title: t("admin_title"),
            description: t("admin_desc"),
        }
    };
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
