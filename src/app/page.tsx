import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Shield, Smartphone } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Calendar className="size-6" />
            <span className="text-lg font-semibold tracking-tight">ReservaYa</span>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/admin">Panel</Link>
          </Button>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        <section className="mx-auto flex max-w-5xl flex-1 flex-col items-center justify-center px-6 py-20 text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Reservas para profesionales
          </p>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Tu agenda, sin complicaciones
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Psicólogos, abogados, fisioterapeutas y cualquier profesional
            independiente puede compartir un enlace y recibir reservas en minutos.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/reservar/maria-garcia">Ver demo de reserva</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/admin">Configurar mi agenda</Link>
            </Button>
          </div>
        </section>

        <section className="border-t bg-muted/30">
          <div className="mx-auto grid max-w-5xl gap-8 px-6 py-16 sm:grid-cols-3">
            <Feature
              icon={Smartphone}
              title="Reserva en 3 pasos"
              description="El cliente elige servicio, fecha y hora. Sin registros ni formularios interminables."
            />
            <Feature
              icon={Clock}
              title="Horarios automáticos"
              description="Define tu disponibilidad una vez. Los huecos libres se calculan solos."
            />
            <Feature
              icon={Shield}
              title="Tus datos, tu control"
              description="Sin marketplaces ni comisiones. Enlace directo a tu agenda."
            />
          </div>
        </section>
      </main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        ReservaYa — Hecho para profesionales independientes
      </footer>
    </div>
  );
}

function Feature({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-background shadow-sm">
        <Icon className="size-5" />
      </div>
      <h3 className="font-medium">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
