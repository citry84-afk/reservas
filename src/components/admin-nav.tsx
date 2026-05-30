"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Clock, LogOut, Settings, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/lib/actions";

const nav = [
  { href: "/admin/dashboard", label: "Reservas", icon: Calendar },
  { href: "/admin/servicios", label: "Servicios", icon: Wrench },
  { href: "/admin/horario", label: "Horario", icon: Clock },
  { href: "/admin/configuracion", label: "Perfil", icon: Settings },
];

export function AdminNav({ bookingUrl }: { bookingUrl?: string }) {
  const pathname = usePathname();

  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-6">
          <span className="font-semibold">ReservaYa</span>
          <nav className="hidden gap-1 sm:flex">
            {nav.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                  pathname === href
                    ? "bg-accent font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          {bookingUrl && (
            <Button variant="outline" size="sm" asChild>
              <Link href={bookingUrl} target="_blank">
                Ver enlace público
              </Link>
            </Button>
          )}
          <form action={logoutAction}>
            <Button variant="ghost" size="sm" type="submit">
              <LogOut className="size-4" />
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
