# Nexso Web v2

Sitio corporativo de [Nexso](https://nexso.cl): landing en español (Chile) con formulario de contacto, SEO orientado a buscadores y asistentes de IA, y un cron en Vercel que alerta oportunidades de **Compra Ágil** (Mercado Público) filtradas por palabra clave.

## Stack

- **Next.js 16** (App Router, Turbopack en dev)
- **React 19**, **TypeScript**, **Tailwind CSS v4**
- **Motion** (animaciones), **Phosphor Icons**
- **Resend** (correo transaccional)
- **Vercel** (deploy, Analytics, Cron Jobs)

## Inicio rápido

```bash
npm install
# Crea .env.local con las variables de la tabla inferior
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # build de producción
npm run start   # servir build local
npm run lint    # ESLint
```

## Estructura del proyecto

```
app/
  page.tsx              # Landing (secciones + FAQ SEO)
  layout.tsx            # Metadata, fuentes, JSON-LD
  robots.ts / sitemap.ts
  api/
    contact/route.ts    # POST formulario de contacto
    cron/compra-agil/   # Cron Compra Ágil (GET/POST)
components/             # UI por sección (Hero, Contact, etc.)
lib/
  contact/              # Validación y envío Resend (contacto)
  compra-agil/          # API Mercado Público, filtro, email cron
  seo/                  # URLs, schema, helpers metadata
public/
  llms.txt              # Resumen para crawlers de IA
vercel.json             # Cron: cada hora en :00
```

## Funcionalidades

### Landing

Página única con navegación por anclas: servicios, método, integraciones, sector público/privado, cumplimiento, FAQ y contacto. Animaciones con `prefers-reduced-motion` respetado donde aplica.

### Formulario de contacto

`POST /api/contact` — valida campos, honeypot (`website`) y envía correo vía Resend a los destinatarios configurados.

### Cron Compra Ágil

Cada hora (`0 * * * *`), Vercel invoca `GET /api/cron/compra-agil` con el header que define la plataforma cuando existe `CRON_SECRET` en el proyecto.

El job:

1. Consulta `https://api2.mercadopublico.cl/v2/compra-agil` con la **última hora completa en Chile** (`America/Santiago`). La API usa hora civil chilena con sufijo `Z` (ej. `cambio_desde=2026-06-02T16:00:00Z`, no UTC convertido).
2. Estado por defecto: `publicada`, **50** resultados por página y recorrido de **todas** las páginas según `paginacion.total_paginas` (pausa entre requests para respetar rate limit).
3. Filtra oportunidades de **desarrollo de software** con reglas por categoría (ignore case, sin tildes):
   - **software** — contiene «software»
   - **licencia** — contiene «licencia», excepto licencia de conducir
   - **desarrollo** — solo «desarrollo de programa/aplicación/sistema/software»
   - **plataforma** — solo contexto digital (plataforma web/cloud/digital, o cerca de términos IT; excluye plataformas elevadoras, de carga, etc.)
4. Si hay coincidencias, envía un correo HTML con estilo Nexso (`#005ad6`) y enlaces al detalle en Mercado Público.

**Probar en local** (con `npm run dev` y variables cargadas):

```bash
curl -X POST http://localhost:3000/api/cron/compra-agil \
  -H "Authorization: Bearer TU_CRON_SECRET"
```

Respuesta JSON de ejemplo: `totalFetched`, `matched`, `emailed`, `window`.

### SEO

Metadata en `layout.tsx`, `robots.txt` (incluye bots de IA), `sitemap.xml`, JSON-LD y `public/llms.txt`.

## Variables de entorno

Crea `.env.local` en la raíz (no commitear). Referencia:

| Variable | Uso |
|----------|-----|
| `RESEND_API_KEY` | API key de [Resend](https://resend.com) |
| `CONTACT_FROM_EMAIL` | Remitente verificado, ej. `Nexso <contacto@nexso.cl>` |
| `CONTACT_TO_EMAILS` | Destinatarios contacto (coma) |
| `CRON_SECRET` | Secreto para autorizar el cron (Vercel lo envía como `Bearer`) |
| `MERCADO_PUBLICO_TICKET` | Ticket API Mercado Público (header `ticket`) |
| `MERCADO_PUBLICO_API_BASE` | Opcional; default `https://api2.mercadopublico.cl` |
| `COMPRA_AGIL_DETAIL_BASE` | Opcional; base URLs de detalle; default `https://www.mercadopublico.cl` |
| `COMPRA_AGIL_ESTADO` | Opcional; default `publicada` |
| `COMPRA_AGIL_KEYWORDS` | Opcional; reglas activas separadas por coma: `software,licencia,desarrollo,plataforma` (default: todas) |
| `COMPRA_AGIL_PAGE_SIZE` | Opcional; 15–50 (API); default `50` |
| `COMPRA_AGIL_PAGE_DELAY_MS` | Opcional; pausa entre páginas; default `400` (sube automáticamente tras 429) |
| `COMPRA_AGIL_FETCH_TIMEOUT_MS` | Opcional; timeout por request API; default `20000` |
| `COMPRA_AGIL_MAX_PAGES` | Opcional; tope de páginas (`0` o vacío = todas) |
| `COMPRA_AGIL_MAX_RETRIES` | Opcional; reintentos ante HTTP 429; default `3` |
| `COMPRA_AGIL_FROM_EMAIL` | Opcional; remitente alertas (si no, usa `CONTACT_FROM_EMAIL`) |
| `COMPRA_AGIL_TO_EMAILS` | Opcional; destinatarios alertas (si no, usa `CONTACT_TO_EMAILS`) |

En **Vercel**, configura las mismas variables en el proyecto y despliega; el cron de `vercel.json` solo corre en producción (plan con Cron Jobs habilitado).

## Deploy en Vercel

1. Conecta el repositorio e importa el proyecto (root: `nexso-web-v2` si el monorepo lo requiere).
2. Añade todas las variables de entorno anteriores.
3. Deploy: el cron se registra automáticamente desde `vercel.json`.

El cron tiene **maxDuration 300 s** (requiere plan **Pro**). En Hobby el tope de Vercel es 60 s; con muchas páginas y rate limit (429) puede no alcanzar. Si ves `Task timed out after 60 seconds`, confirma plan Pro o sube `COMPRA_AGIL_PAGE_DELAY_MS` (ej. `800`) para reducir 429.

Documentación: [Next.js en Vercel](https://nextjs.org/docs/app/building-your-application/deploying), [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs).

## Licencia

Proyecto privado — uso interno Nexso / Stimar.
