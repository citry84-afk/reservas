"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setAvailability } from "@/lib/actions";
import { DAY_NAMES } from "@/lib/slots";
import type { Availability } from "@/db/schema";

type Slot = { dayOfWeek: number; startTime: string; endTime: string };

export function ScheduleEditor({
  providerId,
  existing,
}: {
  providerId: string;
  existing: Availability[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [schedule, setSchedule] = useState<Record<number, Slot>>(
    () => {
      const map: Record<number, Slot> = {};
      for (const slot of existing) {
        map[slot.dayOfWeek] = {
          dayOfWeek: slot.dayOfWeek,
          startTime: slot.startTime,
          endTime: slot.endTime,
        };
      }
      return map;
    }
  );

  function toggleDay(day: number) {
    setSchedule((prev) => {
      const next = { ...prev };
      if (next[day]) {
        delete next[day];
      } else {
        next[day] = { dayOfWeek: day, startTime: "09:00", endTime: "18:00" };
      }
      return next;
    });
  }

  function updateTime(day: number, field: "startTime" | "endTime", value: string) {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  }

  async function handleSave() {
    setLoading(true);
    await setAvailability(providerId, Object.values(schedule));
    toast.success("Horario guardado");
    setLoading(false);
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Disponibilidad semanal</CardTitle>
        <p className="text-sm text-muted-foreground">
          Marca los días en los que aceptas reservas y define el horario.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {[1, 2, 3, 4, 5, 6, 0].map((day) => {
          const active = !!schedule[day];
          return (
            <div
              key={day}
              className="flex flex-wrap items-center gap-4 rounded-lg border p-4"
            >
              <label className="flex min-w-32 cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={() => toggleDay(day)}
                  className="size-4 rounded border"
                />
                <span className="font-medium">{DAY_NAMES[day]}</span>
              </label>

              {active && (
                <div className="flex items-center gap-2">
                  <div>
                    <Label className="sr-only">Inicio</Label>
                    <Input
                      type="time"
                      value={schedule[day].startTime}
                      onChange={(e) =>
                        updateTime(day, "startTime", e.target.value)
                      }
                      className="w-32"
                    />
                  </div>
                  <span className="text-muted-foreground">a</span>
                  <div>
                    <Label className="sr-only">Fin</Label>
                    <Input
                      type="time"
                      value={schedule[day].endTime}
                      onChange={(e) =>
                        updateTime(day, "endTime", e.target.value)
                      }
                      className="w-32"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}

        <Button onClick={handleSave} disabled={loading}>
          {loading ? "Guardando..." : "Guardar horario"}
        </Button>
      </CardContent>
    </Card>
  );
}
