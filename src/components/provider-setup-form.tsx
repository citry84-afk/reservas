"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard } from "lucide-react";
import { toast } from "sonner";
import { AdminCard } from "@/components/admin-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { setupProvider } from "@/lib/actions";
import type { Provider } from "@/db/schema";

export function ProviderSetupForm({
  provider,
  stripeConfigured,
}: {
  provider: Provider | null;
  stripeConfigured: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [depositEnabled, setDepositEnabled] = useState(
    provider?.depositEnabled ?? false
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);

    const name = form.get("name") as string;
    const slug = (form.get("slug") as string)
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-");

    const depositCents = Math.round(
      parseFloat((form.get("deposit") as string) || "0") * 100
    );

    const result = await setupProvider({
      name,
      slug,
      email: form.get("email") as string,
      phone: (form.get("phone") as string) || undefined,
      whatsapp: (form.get("whatsapp") as string) || undefined,
      description: (form.get("description") as string) || undefined,
      depositEnabled: stripeConfigured && form.get("depositEnabled") === "on",
      depositCents: stripeConfigured ? depositCents : 0,
    });

    if (result && "error" in result && result.error) {
      toast.error(result.error);
      setLoading(false);
      return;
    }

    toast.success("Perfil guardado");
    setLoading(false);
    router.refresh();
    router.push("/admin/dashboard");
  }

  const defaultDeposit = provider?.depositCents
    ? (provider.depositCents / 100).toFixed(2)
    : "20";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <AdminCard className="p-6">
        <h3 className="mb-4 font-medium">Datos profesionales</h3>
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre profesional *</Label>
            <Input
              id="name"
              name="name"
              required
              defaultValue={provider?.name}
              placeholder="María García"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">URL de reservas *</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">/reservar/</span>
              <Input
                id="slug"
                name="slug"
                required
                defaultValue={provider?.slug}
                placeholder="maria-garcia"
                pattern="[a-z0-9-]+"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email de contacto *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              defaultValue={provider?.email}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              name="phone"
              defaultValue={provider?.phone ?? ""}
              placeholder="+34 600 000 000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input
              id="whatsapp"
              name="whatsapp"
              defaultValue={provider?.whatsapp ?? provider?.phone ?? ""}
              placeholder="+34 600 000 000"
            />
            <p className="text-xs text-muted-foreground">
              Los clientes podrán contactarte por WhatsApp desde los emails.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              name="description"
              rows={3}
              defaultValue={provider?.description ?? ""}
              placeholder="Breve descripción de tus servicios..."
            />
          </div>
        </div>
      </AdminCard>

      <AdminCard className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <CreditCard className="size-5" />
          <h3 className="font-medium">Señal anti no-show</h3>
        </div>

        {stripeConfigured ? (
          <div className="space-y-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                name="depositEnabled"
                checked={depositEnabled}
                onChange={(e) => setDepositEnabled(e.target.checked)}
                className="mt-1 size-4 rounded border"
              />
              <div>
                <p className="text-sm font-medium">
                  Cobrar señal al reservar
                </p>
                <p className="text-sm text-muted-foreground">
                  El cliente paga una señal con Stripe antes de confirmar la
                  cita.
                </p>
              </div>
            </label>

            {depositEnabled && (
              <div className="space-y-2">
                <Label htmlFor="deposit">Importe de la señal (€)</Label>
                <Input
                  id="deposit"
                  name="deposit"
                  type="number"
                  min={1}
                  step={0.01}
                  defaultValue={defaultDeposit}
                  className="max-w-[140px]"
                />
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-xl bg-muted/50 p-4 text-sm text-muted-foreground">
            <p>
              Stripe no está configurado. Las reservas son gratuitas por ahora.
            </p>
            <p className="mt-2">
              Cuando añadas{" "}
              <code className="rounded bg-muted px-1">STRIPE_SECRET_KEY</code> en
              Vercel, podrás activar la señal aquí.
            </p>
          </div>
        )}
      </AdminCard>

      <Button type="submit" disabled={loading} className="rounded-full">
        {loading ? "Guardando..." : "Guardar perfil"}
      </Button>
    </form>
  );
}
