import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { AdminPageHeader } from "@/components/admin-ui";
import { ServicesManager } from "@/components/services-manager";
import { isAuthenticated } from "@/lib/auth";
import { getAllServices, getProvider } from "@/lib/actions";

export default async function ServiciosPage() {
  const authed = await isAuthenticated();
  if (!authed) redirect("/admin/login");

  const provider = await getProvider();
  if (!provider) redirect("/admin/configuracion");

  const services = await getAllServices(provider.id);

  return (
    <AdminShell
      bookingUrl={`/reservar/${provider.slug}`}
      providerName={provider.name}
    >
      <AdminPageHeader
        title="Servicios"
        description="Define qué ofreces, cuánto dura y cuánto cuesta."
      />
      <ServicesManager providerId={provider.id} services={services} />
    </AdminShell>
  );
}
