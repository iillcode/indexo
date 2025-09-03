import { createClient } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request);
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  // Define route categories
  const publicRoutes = [
    "/",
    "/auth/login",
    "/auth/register",
    "/auth/callback",
    // Allow guest checkout API endpoints
    "/api/lemonsqueezy",
  ];
  const authRoutes = ["/auth/login", "/auth/register"];
  const protectedRoutes = ["/docs", "/profile", "/settings", "/billing"];

  // Check route types
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isProtectedRoute =
    protectedRoutes.some((route) => pathname.startsWith(route)) ||
    (!isPublicRoute && !pathname.startsWith("/auth"));

  // For purely public routes, we can skip any auth call entirely
  if (isPublicRoute && !isProtectedRoute && !isAuthRoute) {
    return response;
  }

  // Get user once (also refreshes session if needed)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Handle unauthenticated users
  if (!user) {
    // Allow access to public and auth routes
    if (isPublicRoute || isAuthRoute) {
      return response;
    }

    // Redirect to login for protected routes
    if (isProtectedRoute) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Handle authenticated users
  if (user) {
    // Redirect authenticated users away from auth pages (login/register)
    if (isAuthRoute) {
      const redirectTo = url.searchParams.get("redirectTo");
      const targetUrl =
        redirectTo && redirectTo.startsWith("/") ? redirectTo : "/docs";
      return NextResponse.redirect(new URL(targetUrl, request.url));
    }

    // For authenticated users accessing protected routes, ensure profile exists
    if (isProtectedRoute) {
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", user.id)
          .single();

        // If no profile exists, create one (fallback in case trigger failed)
        if (!profile) {
          await supabase.from("profiles").insert({
            id: user.id,
            email: user.email!,
            full_name: user.user_metadata?.full_name || null,
            avatar_url: user.user_metadata?.avatar_url || null,
          });
        }
      } catch (error) {
        console.error("Error checking/creating profile:", error);
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
