import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/i18n/routing";

// Routes that don't require authentication
const PUBLIC_ROUTES = ["/login", "/register", "/forgot-password", "/api/auth"];

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request });

    // Demo mode: skip real auth
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
        return supabaseResponse;
    }

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({ request });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const isPublicRoute = PUBLIC_ROUTES.some((route) => {
        if (request.nextUrl.pathname === route) return true;
        return routing.locales.some((locale) => request.nextUrl.pathname === `/${locale}${route}`);
    });

    // Redirect unauthenticated users to login
    if (!user && !isPublicRoute) {
        const url = request.nextUrl.clone();
        // Redirect to localized login if possible, else root /login
        const locale = request.nextUrl.pathname.split("/")[1];
        const isSupportedLocale = routing.locales.includes(locale as any);
        url.pathname = isSupportedLocale ? `/${locale}/login` : "/login";
        url.searchParams.set("redirect", request.nextUrl.pathname);
        return NextResponse.redirect(url);
    }

    // Redirect authenticated users away from login
    const isLoginPage =
        request.nextUrl.pathname === "/login" ||
        routing.locales.some((locale) => request.nextUrl.pathname === `/${locale}/login`);

    if (user && isLoginPage) {
        const redirect = request.nextUrl.searchParams.get("redirect") || "/";
        return NextResponse.redirect(new URL(redirect, request.url));
    }

    return supabaseResponse;
}
