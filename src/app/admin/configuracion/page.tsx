import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin-nav";
import { ProviderSetupForm } from "@/components/provider-setup-form";
import { isAuthenticated } from "@/lib/auth";
import { getProvider } from "@/lib/actions";

export default async function ConfigPage() {
  const authed = await isAuthenticated();
  if (!authed) redirect("/admin/login");

  const provider = await getProvider();

  return (
    <div className="min-h-screen bg-muted/20">
      <AdminNav
        bookingUrl={provider ? `/reservar/${provider.slug}` : undefined}
      />
      <main className="mx-auto max-w-xl px-6 py-8">
        <h1 className="mb-6 text-2xl font-semibold">Configuración</h1>
        <ProviderSetupForm provider={provider} />
      </main>
    </div>
  );
}
