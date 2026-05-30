import Link from "next/link";
import { LoginForm } from "@/components/login-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-6">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle>Panel de administración</CardTitle>
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
  );
}
