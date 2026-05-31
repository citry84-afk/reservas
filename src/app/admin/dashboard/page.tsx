import { redirect } from "next/navigation";
import { Mail, Phone } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import {
  AdminCard,
  AdminEmptyState,
  AdminPageHeader,
  AdminStatCards,
} from "@/components/admin-ui";
import { CopyBookingLink } from "@/components/copy-booking-link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { isAuthenticated } from "@/lib/auth";
import {
  cancelBooking,
  getAllServices,
  getAvailability,
  getProvider,
  getUpcomingBookings,
} from "@/lib/actions";
import { formatDateSpanish } from "@/lib/slots";

export default async function DashboardPage() {
  const authed = await isAuthenticated();
  if (!authed) redirect("/admin/login");

  const provider = await getProvider();
  if (!provider) redirect("/admin/configuracion");

  const [upcoming, services, availability] = await Promise.all([
    getUpcomingBookings(provider.id),
    getAllServices(provider.id),
    getAvailability(provider.id),
  ]);

  const activeDays = new Set(availability.map((a) => a.dayOfWeek)).size;

  return (
    <AdminShell
      bookingUrl={`/reservar/${provider.slug}`}
      providerName={provider.name}
    >
      <AdminPageHeader
        title={`Hola, ${provider.name.split(" ")[0]}`}
        description="Aquí tienes un resumen de tu agenda."
      />

      <AdminStatCards
        stats={[
          {
            label: "Próximas reservas",
            value: upcoming.length,
            icon: "calendar",
          },
          {
            label: "Servicios activos",
            value: services.filter((s) => s.active).length,
            icon: "users",
          },
          {
            label: "Días disponibles",
            value: activeDays,
            icon: "clock",
          },
        ]}
      />

      <div className="mb-8">
        <CopyBookingLink slug={provider.slug} />
      </div>

      <h2 className="mb-4 text-lg font-medium">Próximas citas</h2>

      {upcoming.length === 0 ? (
        <AdminEmptyState
          title="Sin reservas próximas"
          description="Comparte tu enlace para empezar a recibir citas de tus clientes."
        />
      ) : (
        <div className="space-y-3">
          {upcoming.map(({ booking, service }) => (
            <AdminCard key={booking.id} className="overflow-hidden">
              <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-4">
                  <div className="flex shrink-0 flex-col items-center justify-center rounded-xl bg-muted px-3 py-2 text-center">
                    <span className="text-lg font-semibold leading-none">
                      {booking.startTime}
                    </span>
                    <span className="mt-1 text-[10px] text-muted-foreground">
                      {booking.endTime}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">{booking.clientName}</p>
                      <Badge variant="secondary" className="rounded-full">
                        {service.name}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm font-medium">
                      {formatDateSpanish(booking.date)}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="size-3" />
                        {booking.clientEmail}
                      </span>
                      {booking.clientPhone && (
                        <span className="flex items-center gap-1">
                          <Phone className="size-3" />
                          {booking.clientPhone}
                        </span>
                      )}
                    </div>
                    {booking.notes && (
                      <p className="mt-2 text-sm text-muted-foreground italic">
                        &ldquo;{booking.notes}&rdquo;
                      </p>
                    )}
                  </div>
                </div>
                <form
                  action={async () => {
                    "use server";
                    await cancelBooking(booking.id);
                  }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    type="submit"
                  >
                    Cancelar
                  </Button>
                </form>
              </div>
            </AdminCard>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
