# ReservaYa

Sistema de reservas para profesionales independientes: psicólogos, abogados, fisioterapeutas, consultores y más.

Flujo simple en 3 pasos para el cliente. Panel de administración para gestionar servicios, horarios y citas.

## Características

- **Reserva pública** — Enlace personalizado `/reservar/tu-nombre`
- **Servicios configurables** — Duración y precio por servicio
- **Horario semanal** — Disponibilidad automática con cálculo de huecos libres
- **Panel admin** — Ver, gestionar y cancelar reservas
- **Mobile-first** — Interfaz limpia y rápida

## Stack

- [Next.js 16](https://nextjs.org) (App Router)
- [Drizzle ORM](https://orm.drizzle.team) + [Turso/libSQL](https://turso.tech)
- [shadcn/ui](https://ui.shadcn.com) + Tailwind CSS
- Despliegue en [Vercel](https://vercel.com)

## Desarrollo local

```bash
# Instalar dependencias
npm install

# Configurar entorno
cp .env.example .env.local

# Crear tablas y datos de demo
npm run db:setup

# Arrancar
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

| Ruta | Descripción |
|------|-------------|
| `/` | Landing |
| `/reservar/maria-garcia` | Demo de reserva pública |
| `/admin` | Panel (contraseña: `admin123` o `ADMIN_PASSWORD`) |

## Despliegue en Vercel + GitHub

### 1. Subir a GitHub

```bash
git add .
git commit -m "Initial commit: ReservaYa booking app"
git remote add origin https://github.com/TU_USUARIO/reservas.git
git push -u origin main
```

### 2. Crear base de datos Turso (gratis)

```bash
# Instalar Turso CLI: https://docs.turso.tech/cli
turso db create reservas-db
turso db show reservas-db --url
turso db tokens create reservas-db
```

### 3. Conectar en Vercel

1. Importa el repo en [vercel.com/new](https://vercel.com/new)
2. Añade variables de entorno:
   - `DATABASE_URL` → URL de Turso (`libsql://...`)
   - `DATABASE_AUTH_TOKEN` → Token de Turso
   - `ADMIN_PASSWORD` → Contraseña segura para el panel
3. Deploy

### 4. Inicializar producción

Tras el primer deploy, ejecuta migraciones contra Turso:

```bash
DATABASE_URL="libsql://..." DATABASE_AUTH_TOKEN="..." npm run db:push
DATABASE_URL="libsql://..." DATABASE_AUTH_TOKEN="..." npm run db:seed
```

Luego configura tu perfil en `/admin/configuracion`.

## Alternativa: Netlify

Netlify también soporta Next.js. Conecta el mismo repo y configura las mismas variables de entorno. Vercel es la opción recomendada por integración nativa con Next.js.

## Emails de confirmación

Al confirmar una reserva se envían dos emails (via [Resend](https://resend.com)):

- **Cliente** — confirmación con fecha, hora y referencia
- **Profesional** — notificación con datos del cliente y enlace al panel

### Configurar Resend

1. Crea cuenta en [resend.com](https://resend.com) y genera una API key
2. Añade las variables de entorno:

```bash
RESEND_API_KEY=re_xxxxxxxx
EMAIL_FROM=ReservaYa <onboarding@resend.dev>   # dominio de prueba
NEXT_PUBLIC_APP_URL=https://reservas-psi.vercel.app
```

3. En producción, verifica tu dominio en Resend y usa `EMAIL_FROM=ReservaYa <reservas@tudominio.com>`

Sin `RESEND_API_KEY` la app funciona igual; simplemente no envía emails.

## Próximos pasos (roadmap)

- [x] Notificaciones por email (Resend)
- [ ] Pagos con Stripe (señal / depósito anti no-show)
- [ ] Recordatorios WhatsApp
- [ ] Videollamadas (Google Meet)
- [ ] Multi-profesional (varios perfiles)

## Licencia

MIT
