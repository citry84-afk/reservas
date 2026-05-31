import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ADMIN_PATHS = [
  "/admin",
  "/admin/login",
  "/admin/registro",
];

const NO_PROVIDER_PATHS = [
  "/admin/elegir",
  "/admin/registro",
  "/admin/configuracion",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublicAdmin = PUBLIC_ADMIN_PATHS.includes(pathname);
  const isAdminRoute = pathname.startsWith("/admin") && !isPublicAdmin;
  const session = request.cookies.get("reservas_session");
  const providerId = request.cookies.get("reservas_provider_id");

  if (isAdminRoute && session?.value !== "authenticated") {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (
    isAdminRoute &&
    session?.value === "authenticated" &&
    !providerId?.value &&
    !NO_PROVIDER_PATHS.some((p) => pathname.startsWith(p))
  ) {
    return NextResponse.redirect(new URL("/admin/elegir", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
