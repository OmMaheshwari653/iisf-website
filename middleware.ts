import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if accessing admin routes
  if (pathname.startsWith("/admin") && pathname !== "/admin-login") {
    const isAuthenticated = request.cookies.get("admin-auth")?.value === "true";

    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/admin-login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
