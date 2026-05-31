import { AmbientOrbs } from "@/components/ambient-orbs";
import { AdminNav } from "@/components/admin-nav";

export function AdminShell({
  children,
  bookingUrl,
  providerName,
}: {
  children: React.ReactNode;
  bookingUrl?: string;
  providerName?: string;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <AmbientOrbs />
      </div>

      <AdminNav bookingUrl={bookingUrl} providerName={providerName} />

      <main className="mx-auto max-w-5xl px-6 py-8 pb-24 sm:pb-8">
        {children}
      </main>
    </div>
  );
}
