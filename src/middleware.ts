import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminRoute =
    pathname.startsWith("/admin") && !pathname.startsWith("/admin/login");
  const session = request.cookies.get("reservas_session");

  if (isAdminRoute && session?.value !== "authenticated") {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
