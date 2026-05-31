"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  Clock,
  LogOut,
  Settings,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/lib/actions";

const nav = [
  { href: "/admin/dashboard", label: "Reservas", icon: Calendar },
  { href: "/admin/servicios", label: "Servicios", icon: Wrench },
  { href: "/admin/horario", label: "Horario", icon: Clock },
  { href: "/admin/configuracion", label: "Perfil", icon: Settings },
];

export function AdminNav({
  bookingUrl,
  providerName,
}: {
  bookingUrl?: string;
  providerName?: string;
}) {
  const pathname = usePathname();
  const initial = providerName?.charAt(0).toUpperCase() ?? "R";

  return (
    <>
      <header className="sticky top-0 z-50 border-b bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-3">
          <div className="flex min-w-0 items-center gap-4">
            <Link href="/admin/dashboard" className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-foreground text-sm font-semibold text-background">
                {initial}
              </div>
              <div className="hidden min-w-0 sm:block">
                <p className="truncate text-sm font-semibold leading-none">
                  {providerName ?? "ReservaYa"}
                </p>
                <p className="text-xs text-muted-foreground">Panel</p>
              </div>
            </Link>

            <nav className="hidden gap-0.5 md:flex">
              {nav.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-3.5 py-2 text-sm transition-all duration-200",
                    pathname === href
                      ? "bg-foreground font-medium text-background"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="size-4" />
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-1.5">
            {bookingUrl && (
              <Button
                variant="outline"
                size="sm"
                className="hidden rounded-full sm:inline-flex"
                asChild
              >
                <Link href={bookingUrl} target="_blank">
                  Enlace público
                </Link>
              </Button>
            )}
            <form action={logoutAction}>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                type="submit"
                title="Cerrar sesión"
              >
                <LogOut className="size-4" />
              </Button>
            </form>
          </div>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/90 backdrop-blur-xl md:hidden">
        <div className="mx-auto flex max-w-lg justify-around px-2 py-2">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-[10px] transition-colors",
                pathname === href
                  ? "font-medium text-foreground"
                  : "text-muted-foreground"
              )}
            >
              <Icon
                className={cn(
                  "size-5",
                  pathname === href && "stroke-[2.5]"
                )}
              />
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
