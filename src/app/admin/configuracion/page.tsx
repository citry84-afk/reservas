import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { AdminPageHeader } from "@/components/admin-ui";
import { ProviderSetupForm } from "@/components/provider-setup-form";
import { isAuthenticated } from "@/lib/auth";
import { getProvider } from "@/lib/actions";
import { isStripeConfigured } from "@/lib/stripe";

export default async function ConfigPage() {
  const authed = await isAuthenticated();
  if (!authed) redirect("/admin/login");

  const provider = await getProvider();
  const stripeConfigured = isStripeConfigured();

  return (
    <AdminShell
      bookingUrl={provider ? `/reservar/${provider.slug}` : undefined}
      providerName={provider?.name}
    >
      <AdminPageHeader
        title="Perfil"
        description="Tu nombre, enlace público y datos de contacto."
      />
      <ProviderSetupForm
        provider={provider}
        stripeConfigured={stripeConfigured}
      />
    </AdminShell>
  );
}
