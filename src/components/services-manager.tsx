"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { deleteService, upsertService } from "@/lib/actions";
import { AdminCard, AdminEmptyState } from "@/components/admin-ui";
import { formatPrice } from "@/lib/slots";
import type { Service } from "@/db/schema";

export function ServicesManager({
  providerId,
  services,
}: {
  providerId: string;
  services: Service[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);

    await upsertService({
      providerId,
      name: form.get("name") as string,
      description: (form.get("description") as string) || undefined,
      durationMinutes: parseInt(form.get("duration") as string, 10),
      priceCents: Math.round(parseFloat(form.get("price") as string) * 100),
    });

    toast.success("Servicio creado");
    setLoading(false);
    setOpen(false);
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este servicio?")) return;
    await deleteService(id);
    toast.success("Servicio eliminado");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full">
              <Plus className="mr-2 size-4" />
              Nuevo servicio
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Añadir servicio</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre *</Label>
                <Input id="name" name="name" required placeholder="Consulta inicial" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea id="description" name="description" rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duración (min) *</Label>
                  <Input
                    id="duration"
                    name="duration"
                    type="number"
                    required
                    defaultValue={60}
                    min={15}
                    step={5}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Precio (€) *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    required
                    defaultValue={0}
                    min={0}
                    step={0.01}
                  />
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full rounded-full">
                {loading ? "Guardando..." : "Crear servicio"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {services.length === 0 ? (
        <AdminEmptyState
          title="Sin servicios todavía"
          description="Crea tu primer servicio para empezar a recibir reservas."
        />
      ) : (
        services.map((service) => (
          <AdminCard key={service.id} className="p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-foreground/5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium">{service.name}</p>
                {service.description && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {service.description}
                  </p>
                )}
                <div className="mt-3 flex gap-4 text-sm text-muted-foreground">
                  <span>{service.durationMinutes} min</span>
                  <span className="font-medium text-foreground">
                    {formatPrice(service.priceCents)}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 rounded-full"
                onClick={() => handleDelete(service.id)}
              >
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </div>
          </AdminCard>
        ))
      )}
    </div>
  );
}
