import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin-nav";
import { ScheduleEditor } from "@/components/schedule-editor";
import { isAuthenticated } from "@/lib/auth";
import { getAvailability, getProvider } from "@/lib/actions";

export default async function HorarioPage() {
  const authed = await isAuthenticated();
  if (!authed) redirect("/admin/login");

  const provider = await getProvider();
  if (!provider) redirect("/admin/configuracion");

  const availability = await getAvailability(provider.id);

  return (
    <div className="min-h-screen bg-muted/20">
      <AdminNav bookingUrl={`/reservar/${provider.slug}`} />
      <main className="mx-auto max-w-2xl px-6 py-8">
        <h1 className="mb-6 text-2xl font-semibold">Horario</h1>
        <ScheduleEditor providerId={provider.id} existing={availability} />
      </main>
    </div>
  );
}
