import Link from "next/link";
import { AmbientOrbs } from "@/components/ambient-orbs";
import { RegisterForm } from "@/components/register-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegistroPage() {
  return (
    <div className="relative min-h-screen overflow-hidden px-6 py-12">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <AmbientOrbs />
      </div>

      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Crea tu agenda
          </h1>
          <p className="mt-2 text-muted-foreground">
            Regístrate como profesional y empieza a recibir reservas.
          </p>
        </div>

        <Card className="border-0 bg-background/80 shadow-xl backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-base">Nuevo perfil</CardTitle>
          </CardHeader>
          <CardContent>
            <RegisterForm />
            <p className="mt-6 text-center text-sm text-muted-foreground">
              ¿Ya tienes cuenta?{" "}
              <Link href="/admin/login" className="underline hover:text-foreground">
                Iniciar sesión
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
