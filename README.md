# Antioquia Silvestre

Guía editorial de ecoturismo por Antioquia, Colombia. Siete destinos, siete rutas con itinerario, una galería con licencias Creative Commons y un formulario de contacto con respaldo por WhatsApp.

> **Sitio de demostración con fines educativos.** Los destinos existen, pero los precios, el RNT, el teléfono, el correo y la operación turística son ficticios.

## Stack

- [Astro 7](https://astro.build) con salida estática y adaptador de Vercel.
- [Tailwind CSS 4](https://tailwindcss.com) vía `@tailwindcss/vite` (configuración CSS-first).
- TypeScript y JavaScript vanilla, sin framework de UI.
- Colecciones de contenido con esquemas Zod.
- [Resend](https://resend.com) para el correo del formulario (opcional).
- Tipografías Fraunces y Manrope (Fontsource).

## Estructura

```text
/
├── public/                 # favicon, robots, imagen Open Graph
├── specs/                  # proposal, spec y tasks del proceso SDD
├── src/
│   ├── assets/images/      # 27 fotografías optimizadas
│   ├── components/         # home, destinos, rutas, galería, contacto, ui
│   ├── content/            # destinos, rutas y galería (Markdown + frontmatter)
│   ├── data/site.ts        # datos de marca, navegación y contacto
│   ├── layouts/Layout.astro
│   ├── lib/                # helpers de contenido, iconos y utilidades
│   ├── pages/              # rutas del sitio + /api/contacto
│   ├── scripts/            # tema, menú, filtros, lightbox, formulario
│   └── styles/global.css   # tokens de diseño y utilidades
├── astro.config.mjs
└── vercel.json
```

## Comandos

| Comando           | Acción                                         |
| :---------------- | :--------------------------------------------- |
| `bun install`     | Instala dependencias                           |
| `bun run dev`     | Servidor de desarrollo en `localhost:4321`     |
| `bun run build`   | Genera el sitio de producción en `dist/`       |
| `bun run preview` | Previsualiza el build local                    |
| `bun run astro`   | CLI de Astro (`astro add`, `astro sync`, etc.) |

## Variables de entorno

Copia `.env.example` como `.env` y ajusta los valores:

| Variable                | Uso                                                              |
| :---------------------- | :--------------------------------------------------------------- |
| `PUBLIC_SITE_URL`       | Opcional: fuerza la URL canónica, el sitemap y Open Graph. Si se omite, en Vercel se detecta el dominio del despliegue. |
| `PUBLIC_WHATSAPP_NUMBER`| Número internacional sin `+` ni espacios.                        |
| `PUBLIC_CONTACT_EMAIL`  | Correo visible en el sitio.                                      |
| `RESEND_API_KEY`        | API key de Resend. Sin ella, el formulario ofrece WhatsApp.      |
| `CONTACT_TO_EMAIL`      | Bandeja que recibe las consultas.                                |
| `CONTACT_FROM_EMAIL`    | Remitente verificado en Resend.                                  |

## Formulario de contacto

`POST /api/contacto` valida con Zod, descarta envíos por honeypot y por tiempo mínimo de llenado, y aplica un límite en memoria de 5 solicitudes cada 10 minutos por IP. La respuesta siempre es JSON:

```json
{ "ok": true, "message": "Mensaje enviado. Te responderemos pronto." }
```

Si el correo no está configurado o Resend falla, responde `503` con `{ "ok": false, "fallback": true }` y el cliente muestra un botón directo a WhatsApp.

## Contenido

Cada destino, ruta y fotografía vive en `src/content/` como Markdown con frontmatter validado. Para agregar un destino:

1. Crea `src/content/destinos/mi-destino.md` con los campos del esquema (`src/content.config.ts`).
2. Agrega su ruta en `src/content/rutas/mi-destino.md` (mismo `destination`).
3. Suma fotos en `src/content/galeria/` con su crédito.
4. Asigna coordenadas en `positions` de `src/components/rutas/RouteMap.astro` para el mapa ilustrado.

Las cadenas que contienen `: ` deben ir entre comillas en el YAML.

## Despliegue

1. Conecta el repositorio en Vercel (framework detectado: Astro) y confirma que la rama de producción es `main`.
2. Define las variables de entorno del proyecto. Todas son opcionales: sin `PUBLIC_SITE_URL`, el canonical, el sitemap y `robots.txt` usan el dominio del despliegue de Vercel.
3. Cada push a `main` ejecuta el workflow de `.github/workflows/ci.yml`.
4. Si el proyecto no está conectado a Git, redespliega desde el panel de Vercel (`Deployments → Redeploy`) después de cada cambio para publicar la última versión.

## Accesibilidad y rendimiento

- HTML semántico, navegación por teclado, `skip-link`, foco visible y `aria-live` en filtros y formularios.
- Tema claro/oscuro persistido en `localStorage` y respeto por `prefers-color-scheme`.
- Imágenes en AVIF/WebP con `srcset`, dimensiones explícitas y carga diferida.
- Lightbox con `<dialog>` nativo, foco atrapado por la plataforma y cierre con `Esc`.

## Créditos

Las fotografías provienen de Wikimedia Commons bajo licencias Creative Commons. Autor, licencia y enlace original están en [CREDITS.md](CREDITS.md) y en `/creditos`.

## Licencia

Contenido editorial y diseño: proyecto de demostración. Fotografías: licencias indicadas en `CREDITS.md`. Tipografías: SIL Open Font License 1.1.
