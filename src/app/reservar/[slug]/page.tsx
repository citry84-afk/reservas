import { notFound } from "next/navigation";
import { BookingFlow } from "@/components/booking-flow";
import { getActiveServices, getProviderBySlug } from "@/lib/actions";

export default async function ReservarPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const provider = await getProviderBySlug(slug);

  if (!provider) {
    notFound();
  }

  const services = await getActiveServices(provider.id);

  if (services.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-6 py-20 text-center">
        <h1 className="text-xl font-semibold">{provider.name}</h1>
        <p className="mt-4 text-muted-foreground">
          No hay servicios disponibles en este momento.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="border-b bg-background">
        <div className="mx-auto max-w-lg px-6 py-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            {provider.name}
          </h1>
          {provider.description && (
            <p className="mt-2 text-muted-foreground">{provider.description}</p>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-lg px-6 py-10">
        <BookingFlow provider={provider} services={services} />
      </main>
    </div>
  );
}
