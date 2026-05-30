import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin-nav";
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
    <div className="min-h-screen bg-muted/20">
      <AdminNav bookingUrl={`/reservar/${provider.slug}`} />
      <main className="mx-auto max-w-2xl px-6 py-8">
        <h1 className="mb-6 text-2xl font-semibold">Servicios</h1>
        <ServicesManager providerId={provider.id} services={services} />
      </main>
    </div>
  );
}
