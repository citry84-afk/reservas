import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { AdminPageHeader } from "@/components/admin-ui";
import { ProviderPicker } from "@/components/provider-picker";
import { Button } from "@/components/ui/button";
import { isAuthenticated } from "@/lib/auth";
import { listProviders } from "@/lib/actions";

export default async function ElegirPage() {
  const authed = await isAuthenticated();
  if (!authed) redirect("/admin/login");

  const providers = await listProviders();

  if (providers.length === 0) {
    redirect("/admin/registro");
  }

  if (providers.length === 1) {
    redirect(`/admin/elegir/${providers[0].id}`);
  }

  return (
    <AdminShell>
      <AdminPageHeader
        title="Elige tu perfil"
        description="Tienes acceso a varias agendas. Selecciona con cuál quieres trabajar."
      />
      <ProviderPicker providers={providers} />
      <div className="mt-8 text-center">
        <Button variant="outline" className="rounded-full" asChild>
          <Link href="/admin/registro">+ Crear otro perfil</Link>
        </Button>
      </div>
    </AdminShell>
  );
}
