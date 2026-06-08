# OpenONG

**Recaudación con IA para ONGs sostenibles.** OpenONG es una plataforma de código abierto y self-hostable que ayuda a las organizaciones sin fines de lucro a recaudar fondos: crea campañas de crowdfunding y una tienda solidaria, listas para recaudar en días.

Es un proyecto multi-tenant (cada organización vive en su propio subdominio) construido con Next.js 15.

- Repositorio: https://github.com/open-ong/openong
- Software libre · sin ataduras a un proveedor · control total sobre tus datos

## Características

- 🧩 Multi-tenant por subdominio (`tu-ong.tudominio.com`)
- 💸 Campañas de crowdfunding y tienda solidaria
- 🤖 Onboarding y generación de contenido asistidos por IA
- 🎙️ Onboarding por voz opcional (ElevenLabs)
- 🧱 Editor de páginas visual (Puck)
- 🔐 Autenticación y permisos (Clerk)
- 📊 Analítica de producto (PostHog)
- 🖼️ Gestión de imágenes (Cloudinary)

## Stack

- [Next.js 15](https://nextjs.org/) (App Router) + [React 19](https://react.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- [Upstash Redis](https://upstash.com/) como almacenamiento
- [Clerk](https://clerk.com/) para autenticación
- [Cloudinary](https://cloudinary.com/) para medios
- [Puck](https://puckeditor.com/) como editor de páginas
- [PostHog](https://posthog.com/) para analítica
- IA: [Anthropic](https://www.anthropic.com/) / [OpenAI](https://openai.com/) y [ElevenLabs](https://elevenlabs.io/)

## Setup

### Requisitos

- Node.js 18.17 o superior
- [pnpm](https://pnpm.io/) (recomendado)

### Pasos

1. Cloná el repositorio e instalá dependencias:

   ```bash
   git clone https://github.com/open-ong/openong.git
   cd openong
   pnpm install
   ```

2. Creá un archivo `.env` en la raíz con las variables de los servicios que uses (ver la sección siguiente). Para arrancar rápido en local, lo mínimo es **Redis** y **Clerk**.

3. Levantá el entorno de desarrollo:

   ```bash
   pnpm dev
   ```

4. Accedé a la aplicación:
   - Sitio principal (landing): http://localhost:3000
   - Panel de administración: http://localhost:3000/admin
   - Una organización: http://[nombre-ong].localhost:3000

## Variables de entorno

Configuralas en `.env`. Cada bloque corresponde a un servicio externo; al lado de cada uno se indica dónde obtener las credenciales.

### Aplicación

| Variable | Requerida | Descripción |
| --- | --- | --- |
| `NEXT_PUBLIC_ROOT_DOMAIN` | Recomendada | Dominio raíz para el ruteo multi-tenant. En local: `localhost:3000`. |

### Redis — [Upstash](https://console.upstash.com/)

Almacenamiento principal (organizaciones, campañas, etc.). Creá una base Redis y copiá las credenciales REST.

| Variable | Requerida | Descripción |
| --- | --- | --- |
| `KV_REST_API_URL` | Sí | URL REST de la base Upstash. |
| `KV_REST_API_TOKEN` | Sí | Token REST de la base Upstash. |

### Autenticación — [Clerk](https://dashboard.clerk.com/)

Manejo de usuarios, sesiones y permisos. Creá una aplicación en Clerk y copiá las API keys.

| Variable | Requerida | Descripción |
| --- | --- | --- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Sí | Publishable key del frontend. |
| `CLERK_SECRET_KEY` | Sí | Secret key del backend. |

### Medios — [Cloudinary](https://console.cloudinary.com/)

Subida y entrega de imágenes. Las credenciales están en el Dashboard de Cloudinary.

| Variable | Requerida | Descripción |
| --- | --- | --- |
| `CLOUDINARY_CLOUD_NAME` | Sí | Nombre del cloud. |
| `CLOUDINARY_API_KEY` | Sí | API key. |
| `CLOUDINARY_API_SECRET` | Sí | API secret. |

### Editor de páginas — [Puck](https://puckeditor.com/)

Editor visual de las páginas públicas de cada organización.

| Variable | Requerida | Descripción |
| --- | --- | --- |
| `PUCK_API_KEY` | Sí | API key de Puck Cloud. |

### Analítica — [PostHog](https://posthog.com/)

Eventos y métricas de producto. El token público se usa en el cliente; las claves de servidor son opcionales y solo se necesitan para consultar métricas desde el backend.

| Variable | Requerida | Descripción |
| --- | --- | --- |
| `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` | Sí | Project token (cliente). |
| `NEXT_PUBLIC_POSTHOG_HOST` | Sí | Host de ingest (ej. `https://us.i.posthog.com`). |
| `POSTHOG_PROJECT_ID` | Opcional | ID del proyecto (consultas de servidor). |
| `POSTHOG_PERSONAL_API_KEY` | Opcional | Personal API key (consultas de servidor). |
| `POSTHOG_API_HOST` | Opcional | Host de la API (ej. `https://us.posthog.com`). |

> **Personal API key:** al crearla en PostHog, configurá el acceso con scope **Projects** (seleccionando tu proyecto) en lugar de "All access", y otorgá el scope **Query → Read**. Así la key queda limitada a leer métricas del proyecto de OpenONG.

### IA — [Anthropic](https://console.anthropic.com/) / [OpenAI](https://platform.openai.com/)

Generación de contenido y onboarding asistido.

| Variable | Requerida | Descripción |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | Para features de IA | API key de Anthropic. |
| `OPENAI_API_KEY` | Para features de IA | API key de OpenAI. |
| `ONBOARDING_LLM_MODEL` | Opcional | Modelo a usar en el onboarding. |

### Onboarding por voz — [ElevenLabs](https://elevenlabs.io/) (opcional)

Asistente de voz para el onboarding. Desactivalo poniendo `NEXT_PUBLIC_ONBOARDING_VOICE_ENABLED=false`.

| Variable | Requerida | Descripción |
| --- | --- | --- |
| `NEXT_PUBLIC_ONBOARDING_VOICE_ENABLED` | Opcional | `true`/`false` para activar la voz. |
| `ELEVENLABS_API_KEY` | Si la voz está activa | API key de ElevenLabs. |
| `ELEVENLABS_AGENT_ID` | Si la voz está activa | ID del agente de voz. |
| `ELEVENLABS_BRANCH_ID` | Si la voz está activa | ID del branch del agente. |
| `NEXT_PUBLIC_ELEVENLABS_AGENT_ID` | Si la voz está activa | ID del agente expuesto al cliente. |
| `ONBOARDING_AGENT_SERVICE_TOKEN` | Si la voz está activa | Token de servicio del agente de onboarding. |

## Arquitectura multi-tenant

OpenONG usa un esquema multi-tenant basado en subdominios:

- Cada organización tiene su propio subdominio (`tu-ong.tudominio.com`).
- El middleware (`middleware.ts`) detecta el subdominio en local, producción y previews de Vercel, y rutea al contenido correcto.
- Los datos se guardan en Redis con un patrón de clave `subdomain:{nombre}`.
- El dominio raíz aloja la landing y el panel de administración.

## Despliegue

Pensado para desplegarse en Vercel (o cualquier hosting compatible con Next.js, dado que es self-hostable):

1. Subí el repositorio a tu GitHub.
2. Conectá el repositorio a tu proveedor.
3. Configurá las variables de entorno descritas arriba.
4. Desplegá.

Para dominios personalizados con multi-tenant, agregá un registro DNS wildcard (`*.tudominio.com`) apuntando a tu despliegue.

## Contribuir

OpenONG es de código abierto. Las contribuciones, issues y sugerencias son bienvenidas en https://github.com/open-ong/openong.

## Licencia

OpenONG se distribuye bajo la [Functional Source License 1.1 (FSL-1.1-MIT)](./LICENSE). Podés usar, modificar, auto-hospedar y redistribuir el software libremente para cualquier propósito permitido —incluido el uso interno de tu organización—; lo único que la licencia no permite es ofrecerlo como un producto o servicio que compita con OpenONG. Dos años después de cada versión publicada, esa versión pasa automáticamente a la licencia MIT.
