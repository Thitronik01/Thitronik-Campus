import { RoleGuard } from "@/components/auth/role-guard";
import { PremiumBackground } from "@/components/layout/premium-background";
import { ChronikTimeline } from "@/components/chronik/chronik-timeline";
import { getChronikEntries } from "@/actions/chronik";
import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "Metadata" });
    return {
        title: t("chronik_title"),
        description: t("chronik_desc"),
        openGraph: {
            title: t("chronik_title"),
            description: t("chronik_desc"),
        }
    };
}

export default async function ChronikPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const entries = await getChronikEntries();
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
  
  let user = null;
  if (isDemoMode) {
    user = { id: "demo-user-001", email: "demo@thitronik.de", user_metadata: { full_name: "Demo User" } };
  } else {
    const supabase = await createClient();
    const { data: { user: supabaseUser } } = await supabase.auth.getUser();
    user = supabaseUser;
  }

  return (
    <RoleGuard requiredRole="user">
      <PremiumBackground>
        <div className="p-4 md:p-8">
          <ChronikTimeline 
            entries={entries} 
            currentUserId={user?.id}
            locale={locale}
          />
        </div>
      </PremiumBackground>
    </RoleGuard>
  );
}
