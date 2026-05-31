"use client";

import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  Clock,
  Link2,
  Settings,
  Share2,
  Sparkles,
} from "lucide-react";
import { AmbientOrbs } from "@/components/ambient-orbs";
import { FadeIn } from "@/components/fade-in";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function AdminLandingContent({ authed }: { authed: boolean }) {
  const ctaHref = authed ? "/admin/dashboard" : "/admin/login";
  const startHref = authed ? "/admin/configuracion" : "/admin/registro";

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Calendar className="size-6" />
            <span className="text-lg font-semibold tracking-tight">ReservaYa</span>
          </Link>
          <Button className="rounded-full" asChild>
            <Link href={ctaHref}>{authed ? "Ir al panel" : "Entrar"}</Link>
          </Button>
        </div>
      </header>

      <main className="relative flex-1 overflow-hidden">
        <section className="relative">
          <AmbientOrbs />
          <div className="mx-auto max-w-5xl px-6 py-16 text-center sm:py-24">
            <div
              className="landing-fade-up mb-6 inline-flex items-center gap-2 rounded-full border bg-background/80 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur-sm"
              style={{ animationDelay: "0.1s" }}
            >
              <Sparkles className="size-4" />
              Para profesionales independientes
            </div>
            <h1
              className="landing-fade-up mx-auto max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl"
              style={{ animationDelay: "0.2s" }}
            >
              Tu agenda online,{" "}
              <span className="bg-gradient-to-r from-foreground via-foreground/80 to-foreground/50 bg-clip-text text-transparent">
                lista en minutos
              </span>
            </h1>
            <p
              className="landing-fade-up mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
              style={{ animationDelay: "0.35s" }}
            >
              Configura tus servicios, define tu horario y comparte un enlace.
              Tus clientes reservan solos — sin llamadas, sin WhatsApps de ida y
              vuelta.
            </p>
            <div
              className="landing-fade-up mt-10 flex flex-wrap justify-center gap-4"
              style={{ animationDelay: "0.5s" }}
            >
              <Button size="lg" className="rounded-full px-8" asChild>
                <Link href={startHref}>
                  {authed ? "Configurar mi perfil" : "Crear mi agenda"}
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8" asChild>
                <Link href="/reservar/maria-garcia">Ver ejemplo</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="border-t bg-background/60 backdrop-blur-sm">
          <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
            <FadeIn className="text-center">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Cómo funciona
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
                Tres pasos para dejar de gestionar citas a mano
              </p>
            </FadeIn>
            <div className="mt-12 grid gap-8 sm:grid-cols-3">
              {[
                { step: 1, icon: Settings, title: "Configura tu perfil", desc: "Nombre, especialidad y URL personalizada para compartir." },
                { step: 2, icon: Clock, title: "Servicios y horario", desc: "Duración, precio y días disponibles. Tú tienes el control." },
                { step: 3, icon: Share2, title: "Comparte tu enlace", desc: "El cliente reserva desde el móvil. Tú lo ves en el panel." },
              ].map((item, i) => (
                <FadeIn key={item.step} delay={i * 100}>
                  <div className="group flex flex-col items-center text-center">
                    <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground transition-transform duration-300 group-hover:scale-110">
                      {item.step}
                    </div>
                    <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-muted transition-colors group-hover:bg-muted/80">
                      <item.icon className="size-5" />
                    </div>
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t">
          <div className="mx-auto max-w-5xl px-6 py-16">
            <FadeIn className="text-center">
              <h2 className="text-2xl font-semibold">¿Para quién es?</h2>
            </FadeIn>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {["Psicólogos y coaches", "Abogados y asesores", "Fisioterapeutas", "Consultores"].map(
                (sector, i) => (
                  <FadeIn key={sector} delay={i * 80}>
                    <Card className="border-dashed transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-md">
                      <CardContent className="py-6 text-center text-sm font-medium">
                        {sector}
                      </CardContent>
                    </Card>
                  </FadeIn>
                )
              )}
            </div>
          </div>
        </section>

        <section className="border-t bg-background/60">
          <div className="mx-auto max-w-5xl px-6 py-16">
            <FadeIn className="text-center">
              <h2 className="text-2xl font-semibold">Por qué ReservaYa</h2>
            </FadeIn>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {[
                { icon: Link2, title: "Enlace directo, sin marketplace", desc: "Tus clientes reservan contigo, no compites en un directorio." },
                { icon: Clock, title: "Configuración en minutos", desc: "Sin tutoriales interminables. Empiezas hoy." },
                { icon: Calendar, title: "Huecos calculados solos", desc: "Solo se muestran horas libres según tu disponibilidad." },
                { icon: Sparkles, title: "Experiencia impecable", desc: "Reserva en 3 pasos desde el móvil. Sin apps que instalar." },
              ].map((b, i) => (
                <FadeIn key={b.title} delay={i * 80}>
                  <div className="flex gap-4 rounded-2xl border bg-muted/30 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-foreground/5">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-background">
                      <b.icon className="size-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">{b.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{b.desc}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t">
          <FadeIn>
            <div className="mx-auto max-w-5xl px-6 py-16 text-center sm:py-20">
              <h2 className="text-2xl font-semibold sm:text-3xl">¿Listo para empezar?</h2>
              <p className="mx-auto mt-3 max-w-md text-muted-foreground">
                Crea tu perfil y comparte el enlace hoy mismo.
              </p>
              <Button size="lg" className="mt-8 rounded-full px-8" asChild>
                <Link href={ctaHref}>
                  {authed ? "Abrir mi panel" : "Acceder al panel"}
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          </FadeIn>
        </section>
      </main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <Link href="/" className="underline hover:text-foreground">
          Volver a la página principal
        </Link>
      </footer>
    </div>
  );
}
