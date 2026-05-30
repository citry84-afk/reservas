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

## Próximos pasos (roadmap)

- [ ] Pagos con Stripe (señal / depósito anti no-show)
- [ ] Notificaciones por email (Resend)
- [ ] Recordatorios WhatsApp
- [ ] Videollamadas (Google Meet)
- [ ] Multi-profesional (varios perfiles)

## Licencia

MIT
