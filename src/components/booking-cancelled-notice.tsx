"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export function BookingCancelledNotice() {
  useEffect(() => {
    toast.info("Pago cancelado. Puedes intentarlo de nuevo.");
  }, []);

  return null;
}
