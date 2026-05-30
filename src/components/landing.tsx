"use client";

import { useRef } from "react";
import Link from "next/link";
import { Calendar, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/fade-in";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden">
      {/* Ambient gradient orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="landing-orb landing-orb-1" />
        <div className="landing-orb landing-orb-2" />
        <div className="landing-orb landing-orb-3" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--background)_72%)]" />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:gap-16 lg:py-28">
        <div className="text-center lg:text-left">
          <p
            className="landing-fade-up mb-4 text-sm font-medium uppercase tracking-widest text-muted-foreground"
            style={{ animationDelay: "0.1s" }}
          >
            Reservas para profesionales
          </p>
          <h1
            className="landing-fade-up text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl lg:leading-[1.08]"
            style={{ animationDelay: "0.2s" }}
          >
            Tu agenda,{" "}
            <span className="bg-gradient-to-r from-foreground via-foreground/80 to-foreground/50 bg-clip-text text-transparent">
              sin complicaciones
            </span>
          </h1>
          <p
            className="landing-fade-up mx-auto mt-6 max-w-xl text-lg text-muted-foreground lg:mx-0"
            style={{ animationDelay: "0.35s" }}
          >
            Psicólogos, abogados, fisioterapeutas y cualquier profesional
            independiente puede compartir un enlace y recibir reservas en
            minutos.
          </p>
          <div
            className="landing-fade-up mt-10 flex flex-wrap justify-center gap-4 lg:justify-start"
            style={{ animationDelay: "0.5s" }}
          >
            <Button size="lg" className="rounded-full px-8 shadow-lg shadow-foreground/5" asChild>
              <Link href="/reservar/maria-garcia">Ver demo de reserva</Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8" asChild>
              <Link href="/admin">Soy profesional</Link>
            </Button>
          </div>
        </div>

        <div
          className="landing-fade-up relative mx-auto w-full max-w-sm lg:max-w-none"
          style={{ animationDelay: "0.4s" }}
        >
          <BookingMockup />
        </div>
      </div>
    </section>
  );
}

function BookingMockup() {
  const cardRef = useRef<HTMLDivElement>(null);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(900px) rotateX(${y * -8}deg) rotateY(${x * 8}deg) translateY(-4px)`;
  }

  function handleLeave() {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "";
  }

  return (
    <div
      className="relative"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {/* Glow behind card */}
      <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-foreground/[0.06] via-transparent to-foreground/[0.04] blur-2xl" />

      <div
        ref={cardRef}
        className="landing-float relative rounded-[1.75rem] border bg-background/80 p-1 shadow-2xl shadow-foreground/10 backdrop-blur-xl transition-transform duration-300 ease-out"
      >
        <div className="rounded-[1.5rem] border bg-background p-5 sm:p-6">
          {/* Phone status bar hint */}
          <div className="mb-5 flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium text-foreground">ReservaYa</span>
            <span>9:41</span>
          </div>

          <div className="mb-4 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-muted">
              <Calendar className="size-5" />
            </div>
            <div>
              <p className="text-sm font-medium">María García</p>
              <p className="text-xs text-muted-foreground">Psicóloga clínica</p>
            </div>
          </div>

          <div className="space-y-2">
            <MockSlot active label="Consulta inicial" meta="60 min · 60 €" />
            <MockSlot label="Sesión de seguimiento" meta="50 min · 45 €" />
          </div>

          <div className="mt-5 rounded-xl bg-muted/50 p-3">
            <p className="text-xs font-medium text-muted-foreground">
              Miércoles 4 de junio
            </p>
            <div className="mt-2 grid grid-cols-3 gap-1.5">
              {["09:00", "10:00", "11:00", "16:00", "17:00"].map((time, i) => (
                <div
                  key={time}
                  className={`rounded-lg py-1.5 text-center text-xs font-medium transition-colors ${
                    i === 1
                      ? "bg-foreground text-background shadow-sm"
                      : "bg-background text-foreground"
                  }`}
                >
                  {time}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-xl border border-green-200/60 bg-green-50/80 px-3 py-2 dark:border-green-900/40 dark:bg-green-950/30">
            <Check className="size-4 text-green-600 dark:text-green-400" />
            <span className="text-xs font-medium text-green-800 dark:text-green-300">
              Confirmación instantánea
            </span>
          </div>
        </div>
      </div>

      {/* Floating badges */}
      <div className="landing-float-delayed absolute -right-2 top-8 rounded-full border bg-background/90 px-3 py-1.5 text-xs font-medium shadow-lg backdrop-blur-sm sm:-right-6">
        3 pasos
      </div>
      <div className="landing-float-reverse absolute -left-2 bottom-12 rounded-full border bg-background/90 px-3 py-1.5 text-xs font-medium shadow-lg backdrop-blur-sm sm:-left-6">
        Sin registro
      </div>
    </div>
  );
}

function MockSlot({
  label,
  meta,
  active,
}: {
  label: string;
  meta: string;
  active?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-3 transition-colors ${
        active ? "border-foreground/20 bg-muted/60" : "border-transparent bg-muted/30"
      }`}
    >
      <p className="text-sm font-medium">{label}</p>
      <p className="text-xs text-muted-foreground">{meta}</p>
    </div>
  );
}


export function LandingFeatures() {
  const features = [
    {
      title: "Reserva en 3 pasos",
      description:
        "El cliente elige servicio, fecha y hora. Sin registros ni formularios interminables.",
      icon: "📱",
    },
    {
      title: "Horarios automáticos",
      description:
        "Define tu disponibilidad una vez. Los huecos libres se calculan solos.",
      icon: "⏱",
    },
    {
      title: "Tus datos, tu control",
      description:
        "Sin marketplaces ni comisiones. Enlace directo a tu agenda.",
      icon: "🔒",
    },
  ];

  return (
    <section className="border-t bg-muted/20">
      <div className="mx-auto max-w-5xl px-6 py-20 sm:py-24">
        <FadeIn className="text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Simple por diseño
          </h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Todo lo que necesitas. Nada que no.
          </p>
        </FadeIn>

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {features.map((f, i) => (
            <FadeIn key={f.title} delay={i * 120}>
              <div className="group h-full rounded-2xl border bg-background/60 p-6 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-foreground/10 hover:shadow-xl hover:shadow-foreground/5">
                <span className="text-2xl">{f.icon}</span>
                <h3 className="mt-4 font-medium">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {f.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LandingCta() {
  return (
    <section className="border-t">
      <FadeIn>
        <div className="mx-auto max-w-5xl px-6 py-20 text-center sm:py-24">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Empieza hoy
          </h2>
          <p className="mx-auto mt-3 max-w-sm text-muted-foreground">
            Configura tu agenda en minutos y comparte tu enlace.
          </p>
          <Button size="lg" className="mt-8 rounded-full px-8" asChild>
            <Link href="/admin">Crear mi agenda</Link>
          </Button>
        </div>
      </FadeIn>
    </section>
  );
}
