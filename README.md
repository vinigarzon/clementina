# Finca La Clementina · App

Plataforma ejecutiva de eventos. Sitio público + backoffice operativo.

## Desarrollo local

```bash
# 1. Instalar dependencias (solo la primera vez o cuando cambie package.json)
npm install

# 2. Levantar el servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Scripts disponibles

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo con hot reload |
| `npm run build` | Build de producción |
| `npm run start` | Servir el build de producción localmente |
| `npm run lint` | Revisar errores de estilo |
| `npm run typecheck` | Revisar tipos de TypeScript sin compilar |

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 3** para estilos
- **Supabase** para base de datos, auth y storage (Sprint 2 en adelante)
- **next-intl** para i18n (Sprint 1)

## Estructura

```
app/
├── src/
│   └── app/                # Rutas (App Router)
│       ├── layout.tsx      # Layout raíz
│       ├── page.tsx        # Home /
│       └── globals.css     # Estilos globales y Tailwind
├── public/                 # Assets estáticos
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── next.config.mjs
└── .env.example            # Copia a .env.local y llena
```

## Variables de entorno

Copia `.env.example` a `.env.local` y llena lo necesario. **Nunca subas `.env.local` a Git.**

## Despliegue

Por ahora todo es local. Cuando estemos listos:
1. Push a GitHub (rama `main`).
2. Conectar el repo a Netlify.
3. Configurar variables de entorno en Netlify.
4. Auto-deploy en cada push a `main`.
