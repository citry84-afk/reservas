"use client";

import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { formatDateSpanish, formatPrice } from "@/lib/slots";
import type { Provider, Service } from "@/db/schema";
import { createBooking, getAvailableSlots } from "@/lib/actions";

type Step = "service" | "datetime" | "details" | "done";

export function BookingFlow({
  provider,
  services,
  depositRequired,
}: {
  provider: Provider;
  services: Service[];
  depositRequired: boolean;
}) {
  const [step, setStep] = useState<Step>("service");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [slots, setSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  async function handleDateSelect(date: Date | undefined) {
    setSelectedDate(date);
    setSelectedTime(null);
    if (!date || !selectedService) return;

    setLoadingSlots(true);
    const dateStr = format(date, "yyyy-MM-dd");
    const available = await getAvailableSlots(
      provider.id,
      selectedService.id,
      dateStr
    );
    setSlots(available);
    setLoadingSlots(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedService || !selectedDate || !selectedTime) return;

    setSubmitting(true);
    const form = new FormData(e.currentTarget);

    const result = await createBooking({
      providerId: provider.id,
      serviceId: selectedService.id,
      date: format(selectedDate, "yyyy-MM-dd"),
      startTime: selectedTime,
      clientName: form.get("name") as string,
      clientEmail: form.get("email") as string,
      clientPhone: (form.get("phone") as string) || undefined,
      notes: (form.get("notes") as string) || undefined,
    });

    setSubmitting(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    if (result.checkoutUrl) {
      window.location.href = result.checkoutUrl;
      return;
    }

    setBookingId(result.bookingId ?? null);
    setEmailSent(result.emailSent ?? false);
    setStep("done");
  }

  if (step === "done" && selectedService && selectedDate && selectedTime) {
    return (
      <div className="booking-step-enter mx-auto max-w-md">
        <Card className="overflow-hidden border-0 bg-background/80 shadow-2xl shadow-foreground/10 backdrop-blur-xl">
          <div className="h-1 w-full bg-gradient-to-r from-green-400 via-emerald-500 to-green-600" />
          <CardContent className="flex flex-col items-center py-12 text-center">
            <div className="booking-success-pop mb-5 flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-950">
              <CheckCircle2 className="size-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl font-semibold">¡Reserva confirmada!</h2>
            <p className="mt-2 text-muted-foreground">
              {selectedService.name} con {provider.name}
            </p>
            <div className="mt-6 w-full rounded-xl bg-muted/50 p-4">
              <p className="font-medium">
                {formatDateSpanish(format(selectedDate, "yyyy-MM-dd"))}
              </p>
              <p className="mt-1 text-2xl font-semibold tracking-tight">
                {selectedTime}
              </p>
            </div>
            {bookingId && (
              <p className="mt-4 text-xs text-muted-foreground">
                Referencia: {bookingId.slice(0, 8).toUpperCase()}
              </p>
            )}
            {emailSent && (
              <p className="mt-3 text-sm text-muted-foreground">
                Te hemos enviado un email de confirmación.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <StepIndicator
        current={step === "service" ? 1 : step === "datetime" ? 2 : 3}
      />

      <div key={step} className="booking-step-enter space-y-6">
      {step === "service" && (
        <div className="space-y-3">
          <h2 className="text-lg font-medium">Elige un servicio</h2>
          {services.map((service, i) => (
            <button
              key={service.id}
              type="button"
              onClick={() => {
                setSelectedService(service);
                setStep("datetime");
              }}
              className="booking-step-enter w-full rounded-2xl border bg-background/80 p-4 text-left shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-lg hover:shadow-foreground/5"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium">{service.name}</p>
                  {service.description && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {service.description}
                    </p>
                  )}
                  <p className="mt-2 text-sm text-muted-foreground">
                    {service.durationMinutes} min
                  </p>
                </div>
                <span className="shrink-0 font-medium">
                  {formatPrice(service.priceCents)}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {step === "datetime" && selectedService && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Fecha y hora</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStep("service")}
            >
              Cambiar servicio
            </Button>
          </div>

          <Card className="border-0 bg-background/80 shadow-lg shadow-foreground/5 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{selectedService.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Fecha</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "mt-1 w-full justify-start font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 size-4" />
                      {selectedDate
                        ? format(selectedDate, "PPP", { locale: es })
                        : "Selecciona una fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {selectedDate && (
                <div>
                  <Label>Hora disponible</Label>
                  {loadingSlots ? (
                    <p className="mt-2 text-sm text-muted-foreground">
                      Cargando horarios...
                    </p>
                  ) : slots.length === 0 ? (
                    <p className="mt-2 text-sm text-muted-foreground">
                      No hay huecos este día. Prueba otra fecha.
                    </p>
                  ) : (
                    <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
                      {slots.map((slot) => (
                        <Button
                          key={slot}
                          type="button"
                          variant={selectedTime === slot ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedTime(slot)}
                        >
                          {slot}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Button
            className="w-full rounded-full"
            disabled={!selectedDate || !selectedTime}
            onClick={() => setStep("details")}
          >
            Continuar
          </Button>
        </div>
      )}

      {step === "details" && selectedService && selectedDate && selectedTime && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Tus datos</h2>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setStep("datetime")}
            >
              Cambiar hora
            </Button>
          </div>

          <Card className="border-0 bg-background/80 shadow-lg shadow-foreground/5 backdrop-blur-sm">
            <CardContent className="space-y-4 pt-6">
              <div className="rounded-lg bg-muted/50 p-3 text-sm">
                <p className="font-medium">{selectedService.name}</p>
                <p className="text-muted-foreground">
                  {formatDateSpanish(format(selectedDate, "yyyy-MM-dd"))} ·{" "}
                  {selectedTime}
                </p>
                {depositRequired && provider.depositCents > 0 && (
                  <p className="mt-2 border-t pt-2 text-muted-foreground">
                    Señal a pagar ahora:{" "}
                    <span className="font-medium text-foreground">
                      {formatPrice(provider.depositCents)}
                    </span>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nombre completo *</Label>
                <Input id="name" name="name" required placeholder="Ana López" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="ana@email.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+34 600 000 000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notas (opcional)</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Motivo de la consulta..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full rounded-full" disabled={submitting}>
            {submitting
              ? "Procesando..."
              : depositRequired && provider.depositCents > 0
                ? `Pagar señal ${formatPrice(provider.depositCents)}`
                : "Confirmar reserva"}
          </Button>
        </form>
      )}
      </div>
    </div>
  );
}

function StepIndicator({ current }: { current: number }) {
  const steps = ["Servicio", "Fecha", "Datos"];
  const progress = ((current - 1) / (steps.length - 1)) * 100;

  return (
    <div className="space-y-3">
      <div className="relative h-1 overflow-hidden rounded-full bg-muted">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-foreground transition-all duration-500 ease-out"
          style={{ width: `${Math.max(progress, 8)}%` }}
        />
      </div>
      <div className="flex justify-between">
        {steps.map((label, i) => (
          <span
            key={label}
            className={cn(
              "text-xs transition-colors duration-300",
              i + 1 <= current
                ? "font-medium text-foreground"
                : "text-muted-foreground"
            )}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
