import { notFound, redirect } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { AmbientOrbs } from "@/components/ambient-orbs";
import { confirmBookingFromSession } from "@/lib/booking-payment";
import { getProviderBySlug } from "@/lib/actions";
import { formatDateSpanish } from "@/lib/slots";
import { isStripeConfigured } from "@/lib/stripe";

export default async function ConfirmadoPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { slug } = await params;
  const { session_id } = await searchParams;

  const provider = await getProviderBySlug(slug);
  if (!provider) notFound();

  if (!session_id || !isStripeConfigured()) {
    redirect(`/reservar/${slug}`);
  }

  const result = await confirmBookingFromSession(session_id);

  if (result.error || !result.booking || !result.service) {
    return (
      <div className="relative flex min-h-screen items-center justify-center px-6">
        <AmbientOrbs />
        <div className="max-w-md rounded-2xl border bg-background/80 p-8 text-center backdrop-blur-xl">
          <h1 className="text-xl font-semibold">No se pudo confirmar</h1>
          <p className="mt-2 text-muted-foreground">{result.error}</p>
        </div>
      </div>
    );
  }

  const { booking, service } = result;

  return (
    <div className="relative flex min-h-screen items-center justify-center px-6">
      <AmbientOrbs />
      <div className="booking-step-enter w-full max-w-md overflow-hidden rounded-2xl border-0 bg-background/80 shadow-2xl shadow-foreground/10 backdrop-blur-xl">
        <div className="h-1 w-full bg-gradient-to-r from-green-400 via-emerald-500 to-green-600" />
        <div className="flex flex-col items-center px-6 py-12 text-center">
          <div className="booking-success-pop mb-5 flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-950">
            <CheckCircle2 className="size-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-xl font-semibold">¡Reserva confirmada!</h1>
          <p className="mt-2 text-muted-foreground">
            {service.name} con {provider.name}
          </p>
          <div className="mt-6 w-full rounded-xl bg-muted/50 p-4">
            <p className="font-medium">{formatDateSpanish(booking.date)}</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight">
              {booking.startTime}
            </p>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Pago recibido · Te hemos enviado un email de confirmación.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Referencia: {booking.id.slice(0, 8).toUpperCase()}
          </p>
        </div>
      </div>
    </div>
  );
}
