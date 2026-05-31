import Link from "next/link";
import { Calendar } from "lucide-react";
import { AmbientOrbs } from "@/components/ambient-orbs";
import { LoginForm } from "@/components/login-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminLoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <AmbientOrbs />
      </div>

      <div className="w-full max-w-sm">
        <div className="landing-fade-up mb-8 text-center" style={{ animationDelay: "0.1s" }}>
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-foreground text-background">
            <Calendar className="size-6" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">ReservaYa</h1>
          <p className="mt-1 text-sm text-muted-foreground">Panel de administración</p>
        </div>

        <Card
          className="landing-fade-up border-0 bg-background/80 shadow-2xl shadow-foreground/10 backdrop-blur-xl"
          style={{ animationDelay: "0.25s" }}
        >
          <CardHeader className="pb-2 text-center">
            <CardTitle className="text-base">Iniciar sesión</CardTitle>
            <p className="text-sm text-muted-foreground">
              Introduce la contraseña para acceder
            </p>
          </CardHeader>
          <CardContent>
            <LoginForm />
            <p className="mt-6 text-center text-sm text-muted-foreground">
              <Link href="/admin" className="underline hover:text-foreground">
                ¿Qué es ReservaYa?
              </Link>
              {" · "}
              <Link href="/" className="underline hover:text-foreground">
                Inicio
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
