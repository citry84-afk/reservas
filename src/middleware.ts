import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ADMIN_PATHS = ["/admin", "/admin/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublicAdmin = PUBLIC_ADMIN_PATHS.includes(pathname);
  const isAdminRoute = pathname.startsWith("/admin") && !isPublicAdmin;
  const session = request.cookies.get("reservas_session");

  if (isAdminRoute && session?.value !== "authenticated") {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
