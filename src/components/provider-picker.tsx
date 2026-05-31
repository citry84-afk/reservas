import Link from "next/link";
import { AdminCard } from "@/components/admin-ui";
import type { Provider } from "@/db/schema";

export function ProviderPicker({ providers }: { providers: Provider[] }) {
  return (
    <div className="space-y-3">
      {providers.map((p) => (
        <AdminCard key={p.id} className="transition-all hover:-translate-y-0.5 hover:shadow-lg">
          <Link
            href={`/admin/elegir/${p.id}`}
            className="flex items-center gap-4 p-5"
          >
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-foreground text-lg font-semibold text-background">
              {p.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="font-medium">{p.name}</p>
              <p className="truncate text-sm text-muted-foreground">
                /reservar/{p.slug}
              </p>
            </div>
          </Link>
        </AdminCard>
      ))}
    </div>
  );
}
