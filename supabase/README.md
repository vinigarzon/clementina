# Supabase · Finca La Clementina

Esquema de base de datos y guía rápida para configurar el proyecto Supabase.

## Configuración inicial

### 1. Crear el proyecto

1. Ingresa a [supabase.com](https://supabase.com) y crea un proyecto nuevo.
2. Nombre sugerido: `finca-la-clementina`.
3. Región: **South America (São Paulo)** — la más cercana a Ecuador.
4. Guarda la contraseña de la base de datos que te genera.

### 2. Copiar las credenciales

En el panel del proyecto: **Project Settings → API**.

Necesitas tres valores:

- **Project URL** → variable `NEXT_PUBLIC_SUPABASE_URL`
- **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **service_role** key (secreta, no commitearla) → `SUPABASE_SERVICE_ROLE_KEY`

Pégalos en `.env.local` (en la raíz de `app/`):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

### 3. Aplicar el esquema

En el panel: **SQL Editor → New query**. Pega el contenido de
`supabase/migrations/0001_init.sql` y ejecuta.

Esto crea:

- Tabla `profiles` (extensión de `auth.users`).
- Tabla `team_members` (equipo).
- Tabla `gallery_assets` (galería).
- Tabla `event_types` (tipos de evento, seed con los 9 actuales).
- Tabla `audit_logs`.
- Enum `user_role` (super_admin, comercial, operaciones, apoyo).
- Trigger que crea un `profile` automáticamente cuando se registra un usuario en `auth.users`.
- Trigger `updated_at` automático.
- Row Level Security en todas las tablas.
- Seed de los 9 tipos de evento y de los 2 miembros del equipo.

### 4. Crear tu usuario super admin

Después del paso 3:

1. En el panel: **Authentication → Users → Add user → Create new user**.
2. Email: el tuyo.
3. Marca "Auto Confirm User".
4. Crea el usuario.

Eso disparará el trigger y creará tu fila en `profiles` con rol `apoyo` por defecto.
Para promoverte a `super_admin`, ve al **Table Editor → profiles → tu fila → editar `role` a `super_admin`**.

A partir de aquí, cuando entres a `/admin/login` en el sitio puedes iniciar sesión con ese email.

## Storage

En Sprint 2.5 vamos a usar Supabase Storage para subir imágenes desde el admin.
La configuración de buckets queda para entonces.

## Regenerar tipos TypeScript

Cuando agregues tablas o columnas, regenera los tipos:

```bash
npx supabase gen types typescript --project-id <tu-project-id> > src/types/database.ts
```

(Opcional: por ahora los tipos están a mano en `src/types/database.ts`.)
