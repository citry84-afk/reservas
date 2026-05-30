import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isAuthenticated } from "@/lib/auth";
import {
  cancelBooking,
  getProvider,
  getUpcomingBookings,
} from "@/lib/actions";
import { formatDateSpanish } from "@/lib/slots";

export default async function DashboardPage() {
  const authed = await isAuthenticated();
  if (!authed) redirect("/admin/login");

  const provider = await getProvider();
  if (!provider) redirect("/admin/configuracion");

  const upcoming = await getUpcomingBookings(provider.id);

  return (
    <div className="min-h-screen bg-muted/20">
      <AdminNav bookingUrl={`/reservar/${provider.slug}`} />

      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">Próximas reservas</h1>
          <p className="text-muted-foreground">
            Comparte tu enlace:{" "}
            <code className="rounded bg-muted px-2 py-0.5 text-sm">
              /reservar/{provider.slug}
            </code>
          </p>
        </div>

        {upcoming.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No hay reservas próximas. Comparte tu enlace para empezar.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {upcoming.map(({ booking, service }) => (
              <Card key={booking.id}>
                <CardHeader className="flex flex-row items-start justify-between pb-2">
                  <div>
                    <CardTitle className="text-base">
                      {booking.clientName}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {booking.clientEmail}
                      {booking.clientPhone && ` · ${booking.clientPhone}`}
                    </p>
                  </div>
                  <Badge variant="secondary">{service.name}</Badge>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {formatDateSpanish(booking.date)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {booking.startTime} – {booking.endTime}
                    </p>
                    {booking.notes && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {booking.notes}
                      </p>
                    )}
                  </div>
                  <form
                    action={async () => {
                      "use server";
                      await cancelBooking(booking.id);
                    }}
                  >
                    <Button variant="outline" size="sm" type="submit">
                      Cancelar
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
