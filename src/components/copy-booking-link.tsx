"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function CopyBookingLink({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    const url = `${window.location.origin}/reservar/${slug}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Enlace copiado");
    setTimeout(() => setCopied(false), 2000);
  }

  const path = `/reservar/${slug}`;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border bg-background/80 p-4 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Tu enlace de reservas
        </p>
        <p className="mt-1 truncate font-mono text-sm">{path}</p>
      </div>
      <div className="flex shrink-0 gap-2">
        <Button
          variant="outline"
          size="sm"
          className="rounded-full"
          onClick={copy}
        >
          {copied ? (
            <Check className="mr-2 size-4" />
          ) : (
            <Copy className="mr-2 size-4" />
          )}
          {copied ? "Copiado" : "Copiar"}
        </Button>
        <Button size="sm" className="rounded-full" asChild>
          <a href={path} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 size-4" />
            Abrir
          </a>
        </Button>
      </div>
    </div>
  );
}
