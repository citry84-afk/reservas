import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { AdminPageHeader } from "@/components/admin-ui";
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
    <AdminShell
      bookingUrl={`/reservar/${provider.slug}`}
      providerName={provider.name}
    >
      <AdminPageHeader
        title="Horario"
        description="Indica los días y franjas en los que aceptas reservas."
      />
      <ScheduleEditor providerId={provider.id} existing={availability} />
    </AdminShell>
  );
}
