"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { setupProvider } from "@/lib/actions";
import type { Provider } from "@/db/schema";

export function ProviderSetupForm({ provider }: { provider: Provider | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);

    const name = form.get("name") as string;
    const slug = (form.get("slug") as string)
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-");

    await setupProvider({
      name,
      slug,
      email: form.get("email") as string,
      phone: (form.get("phone") as string) || undefined,
      description: (form.get("description") as string) || undefined,
    });

    toast.success("Perfil guardado");
    setLoading(false);
    router.refresh();
    router.push("/admin/dashboard");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tu perfil profesional</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            />
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

          <Button type="submit" disabled={loading}>
            {loading ? "Guardando..." : "Guardar perfil"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
