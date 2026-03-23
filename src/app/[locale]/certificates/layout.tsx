import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "Metadata" });
    return {
        title: t("certificates_title"),
        description: t("certificates_desc"),
        openGraph: {
            title: t("certificates_title"),
            description: t("certificates_desc"),
        }
    };
}

export default function CertificatesLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
