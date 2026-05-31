import { CalendarDays, Clock, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminPageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        {title}
      </h1>
      {description && (
        <p className="mt-2 text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

export function AdminStatCards({
  stats,
}: {
  stats: { label: string; value: string | number; icon: "calendar" | "clock" | "users" }[];
}) {
  const icons = {
    calendar: CalendarDays,
    clock: Clock,
    users: Users,
  };

  return (
    <div className="mb-8 grid gap-4 sm:grid-cols-3">
      {stats.map((stat) => {
        const Icon = icons[stat.icon];
        return (
          <div
            key={stat.label}
            className="rounded-2xl border bg-background/80 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-foreground/5"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <Icon className="size-4 text-muted-foreground" />
            </div>
            <p className="mt-2 text-3xl font-semibold tracking-tight">
              {stat.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export function AdminCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-background/80 backdrop-blur-sm",
        className
      )}
    >
      {children}
    </div>
  );
}

export function AdminEmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <AdminCard className="px-6 py-16 text-center">
      <p className="font-medium">{title}</p>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
    </AdminCard>
  );
}
