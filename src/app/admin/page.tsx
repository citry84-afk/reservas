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
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { isAuthenticated } from "@/lib/auth";

export default async function AdminLandingPage() {
  const authed = await isAuthenticated();

  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Calendar className="size-6" />
            <span className="text-lg font-semibold tracking-tight">ReservaYa</span>
          </Link>
          <Button asChild>
            <Link href={authed ? "/admin/dashboard" : "/admin/login"}>
              {authed ? "Ir al panel" : "Entrar"}
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-6 py-16 text-center sm:py-24">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm text-muted-foreground">
            <Sparkles className="size-4" />
            Para profesionales independientes
          </div>
          <h1 className="mx-auto max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Tu agenda online, lista en minutos
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Configura tus servicios, define tu horario y comparte un enlace.
            Tus clientes reservan solos — sin llamadas, sin WhatsApps de ida y
            vuelta, sin software complicado.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link href={authed ? "/admin/configuracion" : "/admin/login"}>
                {authed ? "Configurar mi perfil" : "Empezar gratis"}
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/reservar/maria-garcia">Ver ejemplo de reserva</Link>
            </Button>
          </div>
        </section>

        <section className="border-t bg-background">
          <div className="mx-auto max-w-5xl px-6 py-16">
            <h2 className="text-center text-2xl font-semibold">
              Cómo funciona
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
              Tres pasos para dejar de gestionar citas a mano
            </p>
            <div className="mt-12 grid gap-8 sm:grid-cols-3">
              <Step
                step={1}
                icon={Settings}
                title="Configura tu perfil"
                description="Añade tu nombre, especialidad y la URL personalizada que compartirás con tus clientes."
              />
              <Step
                step={2}
                icon={Clock}
                title="Define servicios y horario"
                description="Consulta inicial, seguimiento, sesión de 30 o 60 minutos. Tú decides cuándo estás disponible."
              />
              <Step
                step={3}
                icon={Share2}
                title="Comparte tu enlace"
                description="El cliente elige día y hora desde el móvil. Tú recibes la reserva en tu panel."
              />
            </div>
          </div>
        </section>

        <section className="border-t">
          <div className="mx-auto max-w-5xl px-6 py-16">
            <h2 className="text-center text-2xl font-semibold">
              ¿Para quién es?
            </h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                "Psicólogos y coaches",
                "Abogados y asesores",
                "Fisioterapeutas",
                "Consultores y freelancers",
              ].map((sector) => (
                <Card key={sector} className="border-dashed">
                  <CardContent className="py-6 text-center text-sm font-medium">
                    {sector}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t bg-background">
          <div className="mx-auto max-w-5xl px-6 py-16">
            <h2 className="text-center text-2xl font-semibold">
              Por qué ReservaYa
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <Benefit
                icon={Link2}
                title="Enlace directo, sin marketplace"
                description="Tus clientes reservan contigo, no compites con otros profesionales en un directorio."
              />
              <Benefit
                icon={Clock}
                title="Configuración en minutos"
                description="Sin tutoriales de 30 minutos ni formularios interminables. Empiezas hoy."
              />
              <Benefit
                icon={Calendar}
                title="Huecos calculados solos"
                description="El sistema solo muestra horas libres según tu disponibilidad y reservas existentes."
              />
              <Benefit
                icon={Sparkles}
                title="Experiencia impecable"
                description="Tus clientes reservan en 3 pasos desde el móvil. Sin registros ni apps que instalar."
              />
            </div>
          </div>
        </section>

        <section className="border-t">
          <div className="mx-auto max-w-5xl px-6 py-16 text-center">
            <h2 className="text-2xl font-semibold">¿Listo para empezar?</h2>
            <p className="mx-auto mt-3 max-w-md text-muted-foreground">
              Crea tu perfil, configura tu primer servicio y comparte el enlace
              hoy mismo.
            </p>
            <Button size="lg" className="mt-8" asChild>
              <Link href={authed ? "/admin/dashboard" : "/admin/login"}>
                {authed ? "Abrir mi panel" : "Acceder al panel"}
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
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

function Step({
  step,
  icon: Icon,
  title,
  description,
}: {
  step: number;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
        {step}
      </div>
      <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-muted">
        <Icon className="size-5" />
      </div>
      <h3 className="font-medium">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function Benefit({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4 rounded-xl border bg-muted/30 p-6">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-background">
        <Icon className="size-5" />
      </div>
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
