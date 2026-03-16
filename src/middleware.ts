import { updateSession } from "@/lib/supabase/middleware";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import type { NextRequest } from "next/server";

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
    // Zuerst Supabase Auth
    const supabaseResponse = await updateSession(request);

    // Dann Next-Intl (wir verwerfen den Header/Cookie Return Wert von Supabase hier für's Erste 
    // und lassen next-intl das Routing übernehmen, da wir noch kein volles supabase SSR für locales gebaut haben)
    return intlMiddleware(request);
}

export const config = {
    matcher: [
        // Match all paths except API, _next/static, images, etc.
        "/((?!api|_next/static|_next/image|favicon.ico|icons|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
