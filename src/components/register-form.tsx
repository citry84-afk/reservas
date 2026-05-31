"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { registerProvider } from "@/lib/actions";

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const result = await registerProvider({
      name: form.get("name") as string,
      slug: form.get("slug") as string,
      email: form.get("email") as string,
      phone: (form.get("phone") as string) || undefined,
      whatsapp: (form.get("whatsapp") as string) || undefined,
      description: (form.get("description") as string) || undefined,
      password: form.get("password") as string,
    });

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre profesional *</Label>
        <Input id="name" name="name" required placeholder="María García" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">URL de reservas *</Label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">/reservar/</span>
          <Input
            id="slug"
            name="slug"
            required
            placeholder="maria-garcia"
            pattern="[a-z0-9-]+"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input id="email" name="email" type="email" required />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono</Label>
          <Input id="phone" name="phone" placeholder="+34 600 000 000" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="whatsapp">WhatsApp</Label>
          <Input
            id="whatsapp"
            name="whatsapp"
            placeholder="+34 600 000 000"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea id="description" name="description" rows={2} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Contraseña de la plataforma *</Label>
        <Input id="password" name="password" type="password" required />
        <p className="text-xs text-muted-foreground">
          La misma contraseña que usarás para acceder al panel.
        </p>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" className="w-full rounded-full" disabled={loading}>
        {loading ? "Creando..." : "Crear mi agenda"}
      </Button>
    </form>
  );
}
