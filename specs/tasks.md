# Tasks — Antioquia Silvestre

**Plan de ejecución paso a paso (SDD)**

| Campo | Valor |
| --- | --- |
| Documento | `specs/tasks.md` |
| Versión | 1.0.0 |
| Fecha | 2026-10-25 |
| Base | `specs/spec.md` v1.0.0 |
| Convención | `T-XXX` · una tarea = un PR pequeño |
| Estado | Implementado · auditado en local · despliegue pendiente |

---

## Cómo usar este documento

1. **No empezar por código.** Resolver primero la Fase 0 (decisiones y datos).
2. Ejecutar en orden. Las tareas marcadas con `[B]` son bloqueantes.
3. Cada tarea indica **archivos**, **criterio de aceptación** y **verificación**.
4. Un PR no mezcla fases. Si cambia el alcance, se actualiza `spec.md` primero.
5. Marcar `[x]` solo cuando la Definition of Done de `spec.md` §12 se cumpla.

**Leyenda:** `[B]` bloqueante · `[P]` paralelizable · `[O]` opcional

---

## Fase 0 — Decisiones, datos y activos

> Objetivo: eliminar la ambigüedad antes de invertir en implementación.

- [x] **T-001 [B] Confirmar decisiones abiertas D-01…D-06** (`specs/proposal.md` §9, `specs/spec.md` §13).
  - **Aceptación:** cada decisión tiene respuesta escrita y, si cambia algo, se actualiza `spec.md`.
  - **Resolución:** D-01 Astro 7.4.2; D-02 Antioquia Silvestre; D-03 datos ficticios + Medellín + `.co`; D-04 banco libre con créditos.

- [x] **T-002 [B] Confirmar versión de Astro.**
  - **Aceptación:** se mantiene `7.4.2` o se fija `astro@^5` + adaptador compatible.
  - **Resolución:** se mantiene **7.4.2**.
  - **Verificación:** `bun run astro -- --version` coincide con la decisión; build verde.

- [x] **T-003 [B] Recopilar identidad y datos legales.**
  - Nombre comercial, tagline, RNT, NIT (si aplica), WhatsApp (formato `57XXXXXXXXXX`), correo, ciudad, horario, redes.
  - **Archivos:** `src/data/site.ts` (se crea en T-203), `README.md`.
  - **Resolución:** proyecto educativo con datos ficticios; ubicación Medellín; aviso de demostración en footer y legales.

- [x] **T-004 [B] Definir política de contenido y datos turísticos.**
  - Fuente de dificultad/tiempos, responsable de validación, fecha de revisión, aviso de "información de referencia".
  - **Resolución:** datos de referencia con aviso visible y `updatedAt`; revisión simulada por el equipo del proyecto.

- [x] **T-005 [P] Curar y descargar fotografía.**
  - Mínimo 24 imágenes: 7 hero (3:2) + 17 de galería (3:2 y 4:5).
  - **Archivos:** `src/assets/images/destinos/`, `public/og-default.jpg`, `CREDITS.md`.
  - **Aceptación:** licencia verificable por imagen, autor y URL registrados; sin marcas de agua.
  - **Verificación:** `CREDITS.md` completo; cada imagen pesa ≤ 500 KB en origen.

- [ ] **T-006 [O] Definir dominio y DNS.**
  - **Aceptación:** dominio elegido y acceso al DNS confirmado.
  - **Verificación:** nota en README con pasos de conexión.

**Puerta G0:** decisiones cerradas, datos reales disponibles, fotos licenciadas.

---

## Fase 1 — Fundaciones técnicas y sistema de diseño

> Objetivo: tema, tokens, layout y navegación funcionando. Sin contenido final.

- [x] **T-101 [B] Instalar dependencias base.**
  ```bash
  bun add @astrojs/vercel @astrojs/sitemap @tailwindcss/vite tailwindcss zod \
          @fontsource-variable/fraunces @fontsource-variable/manrope
  bun add -d @astrojs/check typescript
  ```
  - **Archivos:** `package.json`, `bun.lock`.
  - **Aceptación:** instalación sin errores; `bun run check` disponible.
  - **Verificación:** `bun run build` del starter sigue verde.

- [x] **T-102 [B] Configurar Tailwind v4 y tokens de diseño.**
  - **Archivos:** `astro.config.mjs`, `src/styles/global.css`, `src/env.d.ts`.
  - Incluir `@theme` con colores, tipografía, espaciado, radios, sombras, movimiento; variant `dark` por `[data-theme="dark"]`.
  - **Aceptación:** una clase utilitaria y un token se aplican correctamente en claro y oscuro.
  - **Verificación:** inspección de CSS generado; sin `@tailwind base` legacy.

- [x] **T-103 [B] Implementar tema claro/oscuro sin FOUC.**
  - **Archivos:** `src/layouts/Layout.astro`, `src/components/ui/ThemeToggle.astro`, `src/scripts/theme.ts` (o inline en Layout).
  - **Aceptación:** persistencia en `localStorage("as-theme")`, respeto a `prefers-color-scheme`, `aria-pressed` correcto, sin destello al recargar.
  - **Verificación:** prueba manual en claro/oscuro, recarga, localStorage bloqueado; captura de ambos temas.

- [x] **T-104 [B] Crear Layout base accesible.**
  - **Archivos:** `src/layouts/Layout.astro`, `src/components/seo/BaseHead.astro`.
  - `lang="es-CO"`, skip link, landmarks, `main` con `id="contenido"`, fuentes, favicon, `theme-color`.
  - **Aceptación:** navegación por Tab inicia en skip link y salta al contenido.
  - **Verificación:** axe sin violaciones críticas en página vacía.

- [x] **T-105 [B] Header responsive con menú móvil.**
  - **Archivos:** `src/components/layout/Header.astro`, `src/components/ui/Icon.astro`, `src/scripts/menu.ts`.
  - **Aceptación:** `aria-expanded`, Esc, clic fuera, foco atrapado, `aria-current`, CTA de WhatsApp.
  - **Verificación:** 320 px, 768 px, 1440 px; teclado; sin scroll horizontal.

- [x] **T-106 [B] Footer y navegación secundaria.**
  - **Archivos:** `src/components/layout/Footer.astro`.
  - **Aceptación:** contacto, legal, RNT, créditos y © visibles; enlaces válidos.
  - **Verificación:** revisión visual en ambos temas.

- [x] **T-107 [P] Componentes UI base.**
  - **Archivos:** `src/components/ui/{Button,SectionHeading,Eyebrow,Tag,Stat,Callout,Prose,Breadcrumbs,Icon}.astro`.
  - **Aceptación:** props tipadas, variantes primaria/secundaria/ghost, foco visible, estados hover/active/disabled.
  - **Verificación:** página de muestra temporal `/lab` (eliminada antes de G4).

- [x] **T-108 [P] Configurar fuentes autoalojadas.**
  - **Archivos:** `src/styles/global.css`, `package.json`.
  - **Aceptación:** Fraunces + Manrope variables, subset latin, `font-display: swap`, fallback métrico.
  - **Verificación:** sin solicitudes a Google Fonts; CLS ≤ 0,05.

- [x] **T-109 [P] Configurar metadatos y sitemap.**
  - **Archivos:** `astro.config.mjs`, `public/robots.txt`, `src/components/seo/BaseHead.astro`.
  - **Aceptación:** `site` configurado, sitemap generado, canonical absoluto, OG/Twitter por defecto.
  - **Verificación:** `bun run build` genera `sitemap-index.xml`.

**Puerta G1:** tema persistente, tokens aplicados, header/footer accesibles, build verde.

---

## Fase 2 — Contenido y datos

> Objetivo: el sitio puede renderizar contenido real y tipado.

- [x] **T-201 [B] Definir colecciones con Zod.**
  - **Archivos:** `src/content.config.ts`, `src/env.d.ts`.
  - Esquemas de `destinos`, `rutas`, `galeria` según `spec.md` §6.
  - **Aceptación:** frontmatter inválido rompe el build con mensaje claro.
  - **Verificación:** `bun run check` y build con un fixture inválido.

- [x] **T-202 [B] Cargar los 7 destinos.**
  - Guatapé, Jardín, Jericó, San Rafael, Támesis, Santa Rosa de Osos, Cocorná.
  - **Archivos:** `src/content/destinos/*.md`.
  - **Aceptación:** cada ficha con datos completos, 150–300 palabras de cuerpo, 3+ highlights, 3+ tips, coordenadas y `updatedAt`.
  - **Verificación:** build genera 7 rutas; revisión editorial.

- [x] **T-203 [B] Crear configuración del sitio.**
  - **Archivos:** `src/data/site.ts`, `.env.example`.
  - **Aceptación:** WhatsApp, correo y URL desde variables de entorno; sin secretos.
  - **Verificación:** falta de variable pública produce error claro en build.

- [x] **T-204 [P] Cargar 7 rutas/itinerarios.**
  - **Archivos:** `src/content/rutas/*.md`.
  - **Aceptación:** dificultad, duración, distancia, desnivel, temporada e itinerario por días.
  - **Verificación:** validación Zod; revisión con guía local.

- [x] **T-205 [P] Cargar galería (24+ imágenes).**
  - **Archivos:** `src/content/galeria/*.md`, `src/assets/images/`, `CREDITS.md`.
  - **Aceptación:** `alt`, crédito, categoría, `width`/`height` y destino cuando aplique.
  - **Verificación:** todas las imágenes resuelven en build; sin faltantes.

- [x] **T-206 [P] Documentar edición de contenido.**
  - **Archivos:** `README.md`.
  - **Aceptación:** cómo añadir un destino/ruta/foto sin tocar componentes.
  - **Verificación:** seguir la guía en una copia limpia.

**Puerta G2:** 7 destinos + 7 rutas + 24 fotos validadas y renderizables.

---

## Fase 3 — Home editorial

- [x] **T-301 [B] Hero.**
  - **Archivos:** `src/components/home/Hero.astro`, `src/pages/index.astro`.
  - **Aceptación:** H1, subtítulo, CTA primario y secundario, imagen a sangre optimizada, `fetchpriority="high"`, contraste AA, CTA visibles a 375×667.
  - **Verificación:** Lighthouse del hero; captura desktop/móvil y ambos temas.

- [x] **T-302 [P] Banda de propuesta de valor.**
  - **Archivos:** `src/components/home/ValueStrip.astro`.
  - **Aceptación:** 3–4 beneficios concretos (guías locales, grupos pequeños, turismo responsable) sin iconos genéricos.
  - **Verificación:** revisión de copy; contraste.

- [x] **T-303 [B] Destinos destacados.**
  - **Archivos:** `src/components/home/FeaturedDestinations.astro`, `src/components/destinos/DestinationCard.astro`.
  - **Aceptación:** 3–4 destinos, layout asimétrico en desktop, una columna en móvil, enlace a ficha.
  - **Verificación:** sin CLS; navegación por teclado.

- [x] **T-304 [P] Galería teaser y mapa teaser.**
  - **Archivos:** `src/components/home/GalleryTeaser.astro`, `src/components/home/MapTeaser.astro`.
  - **Aceptación:** enlaces a `/galeria` y `/rutas`; no duplican toda la sección.
  - **Verificación:** revisión visual y de enlaces.

- [ ] **T-305 [P] CTA final + prueba social.**
  - **Archivos:** `src/components/home/FinalCTA.astro`, `src/components/home/Testimonials.astro`.
  - **Aceptación:** testimonios con nombre y origen (reales o marcados como ejemplo); CTA a WhatsApp y formulario.
  - **Verificación:** consentimiento de uso de testimonios.

**Puerta G3a:** home completa y navegable.

---

## Fase 4 — Destinos

- [x] **T-401 [B] Índice `/destinos`.**
  - **Archivos:** `src/pages/destinos/index.astro`, `src/components/destinos/DestinationGrid.astro`.
  - **Aceptación:** 7 tarjetas, datos clave visibles, grid responsive, breadcrumb.
  - **Verificación:** 320/768/1440 px; sin scroll horizontal.

- [x] **T-402 [B] Filtros por categoría.**
  - **Archivos:** `src/components/destinos/DestinationFilters.astro`, `src/scripts/filters.ts`.
  - **Aceptación:** US-02 completa: `aria-pressed`, URL `?categoria=`, `aria-live`, estado vacío, fallback sin JS.
  - **Verificación:** teclado + lector de pantalla; recarga con query param.

- [x] **T-403 [B] Ficha de destino.**
  - **Archivos:** `src/pages/destinos/[slug].astro`, `src/components/destinos/DestinationHero.astro`, `src/components/ui/Stat.astro`.
  - **Aceptación:** US-03 completa; datos desde la colección; JSON-LD `TouristDestination`.
  - **Verificación:** las 7 rutas construidas; validador de datos estructurados.

- [x] **T-404 [P] Itinerario, tips y accesibilidad del destino.**
  - **Archivos:** `src/components/destinos/DestinationDetails.astro`, `src/components/rutas/ItineraryTimeline.astro`.
  - **Aceptación:** itinerario por días, recomendaciones, notas de accesibilidad y aviso de información de referencia.
  - **Verificación:** revisión editorial y semántica (`ol`, `dl`).

- [x] **T-405 [P] Enlaces "Cómo llegar" y destinos relacionados.**
  - **Archivos:** `src/components/destinos/GettingThere.astro`, `src/components/destinos/RelatedDestinations.astro`.
  - **Aceptación:** Google Maps con coordenadas; 2–3 destinos relacionados; sin enlaces rotos.
  - **Verificación:** clic en móvil abre app/navegador.

**Puerta G3b:** exploración y detalle completos.

---

## Fase 5 — Galería y lightbox

- [x] **T-501 [B] Grid de galería.**
  - **Archivos:** `src/pages/galeria.astro`, `src/components/galeria/GalleryGrid.astro`.
  - **Aceptación:** masonry/columnas CSS, `astro:assets`, `srcset`, `loading="lazy"`, `alt` y crédito.
  - **Verificación:** Lighthouse de imágenes; sin CLS.

- [x] **T-502 [B] Filtros de galería.**
  - **Archivos:** `src/scripts/gallery-filters.ts`, `src/components/galeria/GalleryFilters.astro`.
  - **Aceptación:** filtros por categoría y destino; estado en URL; `aria-live`; fallback sin JS.
  - **Verificación:** teclado; recarga con parámetros.

- [x] **T-503 [B] Lightbox con `<dialog>`.**
  - **Archivos:** `src/components/galeria/Lightbox.astro`, `src/scripts/lightbox.ts`.
  - **Aceptación:** US-04 completa: apertura, cierre, flechas, foco, contador, crédito, precarga adyacente.
  - **Verificación:** teclado, VoiceOver/NVDA, `prefers-reduced-motion`.

**Puerta G3c:** galería completamente operable y accesible.

---

## Fase 6 — Rutas y mapa

- [x] **T-601 [B] Página `/rutas`.**
  - **Archivos:** `src/pages/rutas.astro`, `src/components/rutas/RouteList.astro`, `src/components/destinos/DifficultyBadge.astro`.
  - **Aceptación:** US-05; lista con dificultad, duración, distancia, desnivel y temporada.
  - **Verificación:** lectura con teclado; sin depender del mapa.

- [x] **T-602 [B] Mapa ilustrado interactivo.**
  - **Archivos:** `src/components/rutas/RouteMap.astro`, `src/scripts/map.ts`, `src/assets/map-antioquia.svg`.
  - **Aceptación:** hotspots accesibles (botones), panel de detalle, selección con teclado/touch, estado `aria-pressed`, lista alternativa.
  - **Verificación:** navegación completa sin ratón; contraste de etiquetas.

- [x] **T-603 [P] Detalle de ruta e itinerario.**
  - **Archivos:** `src/components/rutas/RouteDetail.astro`, `src/components/rutas/ItineraryTimeline.astro`.
  - **Aceptación:** días, actividades, recomendaciones, dificultad y enlace al destino.
  - **Verificación:** revisión editorial; semántica de listas.

**Puerta G3d:** rutas y mapa funcionales.

---

## Fase 7 — Contacto, reservas y WhatsApp

- [x] **T-701 [B] CTA de WhatsApp reutilizable.**
  - **Archivos:** `src/components/ui/WhatsAppCTA.astro`, `src/lib/whatsapp.ts`.
  - **Aceptación:** US-06; mensaje prellenado con destino; número desde env; `rel="noopener noreferrer"`; `safe-area-inset`.
  - **Verificación:** enlace abre WhatsApp en móvil; sin número hardcodeado.

- [x] **T-702 [P] Página `/contacto`.**
  - **Archivos:** `src/pages/contacto.astro`, `src/components/contacto/ContactInfo.astro`.
  - **Aceptación:** formulario, WhatsApp, correo, horario, ubicación y enlace a privacidad.
  - **Verificación:** layout a 320 px; foco.

- [x] **T-703 [B] Esquema de validación compartido.**
  - **Archivos:** `src/lib/contact-schema.ts`.
  - **Aceptación:** Zod con límites de `spec.md` §7.5; mensajes en español.
  - **Verificación:** pruebas manuales de casos límite (email inválido, mensaje corto).

- [x] **T-704 [B] Endpoint `/api/contacto`.**
  - **Archivos:** `src/pages/api/contacto.ts`, `astro.config.mjs` (adapter), `.env.example`.
  - **Aceptación:** honeypot, time-trap, límite de body, rate limit best-effort, Resend, códigos 200/400/429/500/503.
  - **Verificación:** `curl` a local con casos válidos e inválidos; log sin PII.

- [x] **T-705 [B] Formulario con estados.**
  - **Archivos:** `src/components/contacto/ContactForm.astro`, `src/scripts/contact-form.ts`.
  - **Aceptación:** US-07 completa: validación inline, `aria-invalid`, `aria-live`, éxito a `/gracias`, error con fallback a WhatsApp conservando el mensaje.
  - **Verificación:** envío real en preview de Vercel; lector de pantalla.

- [x] **T-706 [P] Páginas legales.**
  - **Archivos:** `src/pages/privacidad.astro`, `src/pages/terminos.astro`, `src/pages/gracias.astro`.
  - **Aceptación:** contenido conforme a Ley 1581 de 2012; `/gracias` con `noindex`; enlaces en footer.
  - **Verificación:** revisión legal del operador.

**Puerta G3e:** conversión por WhatsApp y formulario operativa end-to-end.

---

## Fase 8 — SEO, rendimiento y accesibilidad

- [ ] **T-801 [B] Presupuesto de rendimiento.**
  - **Archivos:** configuración de build, `astro.config.mjs`, imágenes.
  - **Aceptación:** NFR-01 cumplido en móvil: Perf ≥ 95, LCP ≤ 2,0 s, CLS ≤ 0,05, INP ≤ 200 ms, JS ≤ 30 KB.
  - **Verificación:** Lighthouse móvil en preview de producción; informe archivado en el PR.

- [ ] **T-802 [B] Auditoría de accesibilidad.**
  - **Aceptación:** NFR-02 y US-12; axe sin violaciones críticas; teclado completo; zoom 200%; `prefers-reduced-motion`.
  - **Verificación:** checklist firmada + prueba con lector de pantalla.

- [x] **T-803 [P] SEO técnico y datos estructurados.**
  - **Archivos:** `BaseHead.astro`, `public/robots.txt`, JSON-LD por página.
  - **Aceptación:** NFR-03; títulos/descripciones únicos; OG 1200×630; Rich Results válido.
  - **Verificación:** Search Console (post-lanzamiento), validador de Google.

- [x] **T-804 [P] 404 y estados vacíos.**
  - **Archivos:** `src/pages/404.astro`.
  - **Aceptación:** enlaces útiles, mismo lenguaje visual, `noindex`.
  - **Verificación:** visita a URL inexistente.

- [x] **T-805 [P] Revisión de contenido y tono.**
  - **Aceptación:** sin placeholders, sin lorem ipsum, fechas y datos consistentes, créditos completos.
  - **Verificación:** lectura cruzada por una segunda persona.

**Puerta G4:** rendimiento, accesibilidad y SEO dentro de objetivo.

---

## Fase 9 — Git, GitHub y Vercel (CI/CD)

- [ ] **T-901 [B] Preparar el repositorio.**
  ```bash
  git checkout -b feat/spec-driven-ecoturismo
  # commits atómicos por fase
  ```
  - **Archivos:** `.gitignore` (añadir `.vercel`, `.env.local`, `.DS_Store`), `README.md`.
  - **Aceptación:** historial legible; sin secretos ni `node_modules` versionados.
  - **Verificación:** `git status` limpio; `git log --oneline` coherente.

- [x] **T-902 [B] Configurar el adaptador de Vercel.**
  - **Archivos:** `astro.config.mjs`, `package.json`.
  ```js
  import vercel from '@astrojs/vercel';
  export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    return {
      site: resolveSiteUrl(env), // PUBLIC_SITE_URL → dominio de Vercel → ejemplo
      adapter: vercel(),
      // output: 'static' por defecto; /api/contacto usa prerender = false
    };
  });
  ```
  - **Aceptación:** build local genera salida compatible; endpoint responde en `astro dev`.
  - **Verificación:** `bun run build` y `bun run preview`.

- [x] **T-903 [B] Crear `.env.example` y documentar variables.**
  - **Archivos:** `.env.example`, `README.md`.
  - **Aceptación:** todas las variables de `spec.md` §6.5 con descripción y ejemplo; sin valores reales.
  - **Verificación:** build con `.env` local; validación de faltantes.

- [x] **T-904 [B] Añadir cabeceras y cache en `vercel.json`.**
  - **Archivos:** `vercel.json`.
  - **Aceptación:** NFR-08; headers de seguridad y cache de `/_astro/*`.
  - **Verificación:** `curl -I` en preview.

- [ ] **T-905 [B] Crear repositorio en GitHub y hacer push.**
  ```bash
  gh repo create antioquia-silvestre --private --source=. --remote=origin --push
  ```
  - **Aceptación:** `origin` configurado; rama `main` protegida (PR + CI requeridos).
  - **Verificación:** `git remote -v`; PR de prueba.

- [x] **T-906 [B] Configurar GitHub Actions.**
  - **Archivos:** `.github/workflows/ci.yml`.
  ```yaml
  name: CI
  on:
    pull_request:
    push:
      branches: [main]
  jobs:
    build:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: oven-sh/setup-bun@v2
          with: { bun-version: latest }
        - run: bun install --frozen-lockfile
        - run: bun run check
        - run: bun run build
        - uses: actions/upload-artifact@v4
          with: { name: dist, path: dist }
  ```
  - **Aceptación:** workflow verde en PR; falla si `astro check` falla.
  - **Verificación:** PR de prueba con error deliberado y su corrección.

- [ ] **T-907 [B] Conectar Vercel con GitHub.**
  - Importar repositorio, framework Astro, build `bun run build`, output `dist`.
  - Configurar variables en Preview y Production.
  - **Aceptación:** preview por PR y deploy de `main`; dominio de producción responde 200.
  - **Verificación:** abrir URL de preview; revisar logs; probar rollback.

- [x] **T-908 [P] Documentar operación y despliegue.**
  - **Archivos:** `README.md`, `specs/`.
  - **Aceptación:** instalación, edición de contenido, despliegue, rollback, variables y créditos.
  - **Verificación:** otra persona despliega siguiendo la guía.

- [ ] **T-909 [O] Conectar dominio personalizado.**
  - **Aceptación:** DNS apuntando a Vercel, HTTPS válido, `www` redirige al canonical.
  - **Verificación:** `curl -I https://<dominio>`; certificado activo.

**Puerta G5:** CI verde, previews funcionando, producción publicada y documentada.

---

## Fase 10 — QA final y lanzamiento

- [ ] **T-1001 [B] Matriz de pruebas manuales.**
  - Navegadores: Chrome, Firefox, Safari (macOS/iOS), Edge.
  - Dispositivos: 320, 375, 390, 768, 1024, 1440, 2560 px.
  - **Aceptación:** sin desbordes, sin errores de consola, interacciones correctas.
  - **Verificación:** tabla de resultados adjunta al PR.

- [ ] **T-1002 [B] Auditoría de rendimiento en producción.**
  - **Aceptación:** NFR-01 en URL real (no solo local); Web Vitals reportados.
  - **Verificación:** PageSpeed Insights + Vercel Analytics.

- [ ] **T-1003 [B] Auditoría de accesibilidad final.**
  - **Aceptación:** axe, teclado, zoom, lector de pantalla, contraste en ambos temas.
  - **Verificación:** informe con hallazgos y correcciones.

- [ ] **T-1004 [B] Revisión de enlaces y contenido.**
  - **Aceptación:** cero enlaces rotos; WhatsApp y correo reales; RNT visible; textos legales aprobados.
  - **Verificación:** rastreo de enlaces (p. ej. `lychee` o revisión manual).

- [ ] **T-1005 [B] Prueba de conversión end-to-end.**
  - **Aceptación:** formulario envía y llega al correo; WhatsApp abre con mensaje correcto; fallback funciona con API caída.
  - **Verificación:** envío real desde móvil y desktop.

- [ ] **T-1006 [P] Backup y plan de mantenimiento.**
  - **Aceptación:** repositorio respaldado, revisión trimestral de contenido, monitoreo de Search Console, actualización de dependencias.
  - **Verificación:** checklist en README.

- [ ] **T-1007 [P] Cierre SDD.**
  - **Aceptación:** `proposal.md`, `spec.md` y `tasks.md` reflejan lo construido; decisiones actualizadas; `CREDITS.md` completo.
  - **Verificación:** revisión final del PR de release.

---

## Resumen de esfuerzo (referencia)

| Fase | Tareas | Estimación |
| --- | --- | --- |
| 0 — Decisiones | 6 | 0,5–1 día |
| 1 — Fundaciones | 9 | 2–3 días |
| 2 — Contenido | 6 | 2–3 días (incluye curaduría) |
| 3 — Home | 5 | 1,5–2 días |
| 4 — Destinos | 5 | 1,5–2 días |
| 5 — Galería | 3 | 1 día |
| 6 — Rutas | 3 | 1,5 días |
| 7 — Contacto | 6 | 1,5–2 días |
| 8 — Calidad | 5 | 1–2 días |
| 9 — CI/CD | 9 | 1 día |
| 10 — QA | 7 | 1 día |
| **Total** | **64** | **~15–20 días de trabajo efectivo** |

---

## Orden de ejecución recomendado (camino crítico)

```text
T-001 → T-002 → T-003 → T-101 → T-102 → T-103 → T-104 → T-105
      → T-201 → T-202 → T-203 → T-301 → T-303 → T-401 → T-402
      → T-403 → T-501 → T-503 → T-601 → T-602 → T-701 → T-703
      → T-704 → T-705 → T-801 → T-802 → T-901 → T-902 → T-905
      → T-906 → T-907 → T-1001 → T-1005
```

**Paralelizables desde el inicio:** T-005 (fotos), T-204/T-205 (contenido), T-107/T-108 (UI/fuentes), T-706 (legales).

---

## Registro de decisiones

| ID | Decisión | Fecha | Estado |
| --- | --- | --- | --- |
| D-01 | Versión de Astro | 2026-10-25 | Astro 7.4.2 |
| D-02 | Nombre de marca | 2026-10-25 | Antioquia Silvestre |
| D-03 | Datos de contacto/legales | 2026-10-25 | Ficticios · Medellín · `.co` |
| D-04 | Fuente de fotografía | 2026-10-25 | Banco libre con créditos |
| D-05 | Servicio de formulario | — | Resend (fallback WhatsApp) |
| D-06 | Analítica | — | Vercel Analytics opcional |

---

## Resultados de QA (2026-10-26)

Auditorías ejecutadas sobre el build de producción servido en local (`.vercel/output/static`), salvo donde se indica.

| Prueba | Herramienta | Resultado |
| --- | --- | --- |
| Accesibilidad por página | Lighthouse (accesibilidad) | 100 en las 17 páginas y en ambos temas |
| Buenas prácticas / SEO | Lighthouse | 100 / 100 en todas las páginas auditadas |
| Reglas axe (WCAG 2.1 AA + best practice) | axe-core 4.10 | 0 violaciones en 12 páginas × tema claro/oscuro |
| Desbordamiento horizontal | iframe a 360, 390 y 768 px | 0 px de desbordamiento en 10 páginas |
| JS enviado | Medición en runtime | 2,3–6,1 KB en línea, 0 archivos JS externos (límite: 30 KB) |
| FCP / LCP local | Performance API | 80–164 ms / 96–164 ms |
| CLS local | Performance API | 0,000 (antes 0,052 por swap de tipografía) |
| Enlaces internos | Rastreo de las 15 URL del sitio | 200 en todas |
| Teclado | Manual | `skip-link` visible y funcional, foco al `main`, lightbox con `Esc`/flechas y retorno de foco |

**Defectos corregidos en esta ronda:**

- Contraste del bloque `FinalCTA` en tema oscuro (`accent` se aclaraba a `#e08a5f`); ahora usa un clay oscuro fijo.
- Botones fantasma del hero y del teaser de rutas: `variant="secondary"` imponía `text-brand` y ganaba la cascada; se añadió `variant="outline-light"`.
- Listas de definición con `<div>` intermedio y notas dentro de `<dl>` en `/destinos`, ficha de destino y `/contacto`.
- `<aside>` anidado dentro de `<main>` en cuatro páginas (landmark redundante).
- Cabecera móvil: el botón «Reservar» no se ocultaba por conflicto de `hidden` con `inline-flex` y desbordaba 33 px a 360 px.
- `col-span-2` en la nota de la cabecera de `/destinos` y `/contacto` creaba una columna implícita en móvil.
- `aria-label` del logotipo y de los nodos del mapa duplicaba el texto visible (fallo `label-content-name-mismatch`).
- Preload de Fraunces y Manrope: elimina el desplazamiento de fuente (CLS 0,052 → 0).

**Pendiente de esta fase:** Lighthouse de rendimiento y Web Vitals sobre la URL real (T-1002), zoom 200 % y lector de pantalla (T-1003), y matriz en Firefox/Safari (T-1001).

### Corrección post-despliegue (2026-10-26)

El primer despliegue en Vercel quedó publicado en `https://antioquia-silvestre.vercel.app`, pero canonical, `og:url`, `og:image`, JSON-LD, `robots.txt` y sitemap seguían apuntando al dominio de ejemplo `https://antioquiasilvestre.co`, que no está publicado.

- `src/lib/site-url.mjs` centraliza la resolución: `PUBLIC_SITE_URL` → `VERCEL_PROJECT_PRODUCTION_URL` → `VERCEL_URL` → dominio de ejemplo.
- `astro.config.mjs` lee `.env` con `loadEnv` y pasa la URL a `site`, de modo que el sitemap usa el dominio real.
- `src/data/site.ts` aplica la misma resolución para el JSON-LD.
- `robots.txt` pasó de archivo estático a endpoint (`src/pages/robots.txt.ts`) para citar el sitemap del despliegue actual.
- El sitemap excluye `/gracias`, que es `noindex`.
- Verificado en build con `VERCEL_PROJECT_PRODUCTION_URL`: canonical, Open Graph, JSON-LD, `robots.txt` y sitemap resuelven a `https://antioquia-silvestre.vercel.app`.

---

## Estado de implementación (2026-10-25)

**Build:** 17 páginas HTML + `/api/contacto`, 585 variantes de imagen y sitemap generados con `bun run build`.

**Desviaciones respecto al plan:**

- **T-304:** el teaser de mapa vive dentro de `RouteTeaser.astro` (ilustración SVG), sin componente `MapTeaser` separado.
- **T-305:** `FinalCTA` implementado; no se incluyeron testimonios para no inventar prueba social.
- **T-404:** el itinerario se muestra en `/rutas` y se enlaza desde la ficha; no se duplica en la página de destino.
- **T-502:** el filtro de galería opera por categoría; no hay filtro por destino.
- **T-503:** lightbox sin precarga de imágenes adyacentes.
- **T-602:** los hotspots del mapa son enlaces ancla accesibles; no requieren panel JS.
- **T-701:** `whatsappLink()` en `src/lib/utils.ts` en lugar de un componente `WhatsAppCTA`.
- **T-705:** el éxito se muestra en un panel inline con `aria-live` y foco gestionado; `/gracias` existe como página `noindex` de respaldo.
- **T-703:** esquema Zod compartido en `src/lib/contact-schema.ts`; la validación del cliente replica las reglas en `src/scripts/contact-form.ts`.

**Pendiente:**

- `astro check` no corre con TypeScript 7 (requiere TS 6 o `@astrojs/ts-content-mapper`); CI ejecuta solo build.
- Lighthouse de rendimiento en URL de producción, zoom 200 %, lector de pantalla y navegadores distintos de Chromium (T-1001, T-1002, T-1003).
- Repositorio remoto, protección de rama, conexión con Vercel y dominio (T-901, T-905, T-907, T-909).

> **Siguiente paso:** conectar GitHub/Vercel, desplegar y repetir las auditorías sobre la URL de producción.
