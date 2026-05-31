import { notFound } from "next/navigation";
import { AmbientOrbs } from "@/components/ambient-orbs";
import { BookingFlow } from "@/components/booking-flow";
import { BookingCancelledNotice } from "@/components/booking-cancelled-notice";
import { getActiveServices, getProviderBySlug } from "@/lib/actions";
import { requiresDeposit } from "@/lib/stripe";

function ProviderAvatar({ name }: { name: string }) {
  const initial = name.charAt(0).toUpperCase();
  return (
    <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-foreground text-2xl font-semibold text-background shadow-lg shadow-foreground/10">
      {initial}
    </div>
  );
}

export default async function ReservarPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ cancelado?: string }>;
}) {
  const { slug } = await params;
  const { cancelado } = await searchParams;
  const provider = await getProviderBySlug(slug);

  if (!provider) {
    notFound();
  }

  const services = await getActiveServices(provider.id);

  if (services.length === 0) {
    return (
      <div className="relative flex min-h-screen items-center justify-center px-6">
        <AmbientOrbs />
        <div className="text-center">
          <ProviderAvatar name={provider.name} />
          <h1 className="text-xl font-semibold">{provider.name}</h1>
          <p className="mt-4 text-muted-foreground">
            No hay servicios disponibles en este momento.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AmbientOrbs />

      <header className="relative border-b bg-background/70 backdrop-blur-xl">
        <div className="mx-auto max-w-lg px-6 py-10 text-center">
          <div
            className="landing-fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            <ProviderAvatar name={provider.name} />
            <h1 className="text-2xl font-semibold tracking-tight">
              {provider.name}
            </h1>
            {provider.description && (
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                {provider.description}
              </p>
            )}
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-lg px-6 py-10 pb-16">
        {cancelado && <BookingCancelledNotice />}
        <BookingFlow
          provider={provider}
          services={services}
          depositRequired={requiresDeposit(provider)}
        />
      </main>

      <footer className="relative border-t bg-background/50 py-4 text-center text-xs text-muted-foreground backdrop-blur-sm">
        Reserva con{" "}
        <span className="font-medium text-foreground">ReservaYa</span>
      </footer>
    </div>
  );
}
