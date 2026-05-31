import Link from "next/link";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LandingCta, LandingFeatures, LandingHero } from "@/components/landing";

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Calendar className="size-6" />
            <span className="text-lg font-semibold tracking-tight">ReservaYa</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/profesionales">Profesionales</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/admin">Para profesionales</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        <LandingHero />
        <LandingFeatures />
        <LandingCta />
      </main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        ReservaYa — Hecho para profesionales independientes
      </footer>
    </div>
  );
}
