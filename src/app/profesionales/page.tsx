import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AmbientOrbs } from "@/components/ambient-orbs";
import { FadeIn } from "@/components/fade-in";
import { Button } from "@/components/ui/button";
import { getPublicProviders } from "@/lib/actions";

export default async function ProfesionalesPage() {
  const providers = await getPublicProviders();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <AmbientOrbs />
      </div>

      <header className="sticky top-0 z-50 border-b bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-semibold">
            ReservaYa
          </Link>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin">Soy profesional</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        <FadeIn>
          <h1 className="text-3xl font-semibold tracking-tight">
            Profesionales
          </h1>
          <p className="mt-2 text-muted-foreground">
            Encuentra a quién reservar y elige un hueco en su agenda.
          </p>
        </FadeIn>

        <div className="mt-10 space-y-4">
          {providers.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">
              Aún no hay profesionales registrados.
            </p>
          ) : (
            providers.map((p, i) => (
              <FadeIn key={p.id} delay={i * 80}>
                <Link
                  href={`/reservar/${p.slug}`}
                  className="group flex items-center gap-4 rounded-2xl border bg-background/80 p-5 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-foreground/5"
                >
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-foreground text-xl font-semibold text-background">
                    {p.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{p.name}</p>
                    {p.description && (
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {p.description}
                      </p>
                    )}
                  </div>
                  <ArrowRight className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </Link>
              </FadeIn>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
