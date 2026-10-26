# Spec — Antioquia Silvestre

**Especificación funcional, sistema de diseño y requisitos no funcionales**

| Campo | Valor |
| --- | --- |
| Documento | `specs/spec.md` |
| Versión | 1.0.0 |
| Fecha | 2026-10-25 |
| Depende de | `specs/proposal.md` |
| Estado | Aprobado — en implementación |
| Idioma del producto | Español (es-CO) |
| Dominio de ejemplo | `https://antioquiasilvestre.co` |
| Datos | Ficticios, con fines educativos (aviso visible en el sitio) |

---

## 1. Contexto técnico

### 1.1 Stack

| Capa | Tecnología | Versión objetivo | Notas |
| --- | --- | --- | --- |
| Framework | Astro | **7.4.2 instalado** (brief: v5) | Ver ADR-01 |
| Estilos | Tailwind CSS | 4.x | Vía `@tailwindcss/vite`, configuración en CSS con `@theme` |
| Tipografía | Fontsource Variable | últimas | Autoalojada, subset latin |
| Interactividad | TypeScript + Web Components nativos | — | Sin React/Vue/Svelte |
| Iconos | SVG inline propios | — | Sin librería de iconos |
| Contenido | Content Collections + Zod | — | Markdown + frontmatter tipado |
| Imágenes | `astro:assets` | — | AVIF/WebP, `srcset`, dimensiones explícitas |
| Formulario | Endpoint serverless + Zod + Resend | — | `prerender = false` |
| Despliegue | Vercel | — | Adapter `@astrojs/vercel`, static + 1 función |
| CI | GitHub Actions | — | `astro check` + build |
| Runtime | Node | ≥ 22 | `engines` ya definido |
| Gestor | Bun | 1.4.4 | `bun.lock` presente |

### 1.2 Comandos

```bash
bun install
bun dev                 # http://localhost:4321
bun run build
bun run preview
bun run check           # astro check (nuevo)
```

### 1.3 Decisiones de arquitectura (ADR)

#### ADR-01 — Astro 7.4.2 en lugar de Astro 5

- **Contexto:** el brief solicita Astro v5; el proyecto ya fue creado con Astro 7.4.2.
- **Decisión (confirmada):** mantener **Astro 7.4.2**.
- **Razón:** el alcance usa APIs estables presentes en ambas versiones (islands, content collections, `astro:assets`, endpoints). Retroeceder introduce riesgo sin beneficio.
- **Consecuencia:** las dependencias se fijan contra la versión instalada y se validan con `astro check` en CI.

#### ADR-02 — Cero framework de UI

- **Decisión:** interacciones con módulos TS pequeños y APIs nativas (`<dialog>`, `fetch`, `localStorage`, `IntersectionObserver`).
- **Razón:** presupuesto de JS ≤ 30 KB, máxima vida útil y menos dependencias.
- **Consecuencia:** filtros y lightbox se implementan a mano; exige disciplina de accesibilidad.

#### ADR-03 — Contenido en el repositorio

- **Decisión:** Content Collections con Markdown/YAML; sin CMS.
- **Razón:** costo cero, versionado, revisión por PR, rendimiento.
- **Consecuencia:** editar requiere Git; se documenta el flujo para personas no técnicas.

#### ADR-04 — Mapa ilustrado, no mapa de tiles

- **Decisión:** SVG del mapa de Antioquia con hotspots de destino + panel de detalle, alternativa en lista.
- **Razón:** sin claves API, sin JS de mapas, accesible y coherente con la identidad editorial.
- **Consecuencia:** no hay rutas GPS reales; se enlaza a Google Maps por destino.

#### ADR-05 — Tema con `data-theme` y script bloqueante mínimo

- **Decisión:** atributo `data-theme` en `<html>`, resuelto por script inline en `<head>` antes del paint.
- **Razón:** evitar FOUC y permitir que Tailwind use un variant `dark` basado en atributo.
- **Consecuencia:** script inline de ~300 bytes; documentar para CSP futura.

#### ADR-06 — Formulario con fallback

- **Decisión:** POST a `/api/contacto`; si falla, se ofrece WhatsApp con el mensaje prellenado.
- **Razón:** el canal de reserva no puede depender de un solo proveedor.
- **Consecuencia:** la UI debe manejar `success`, `error` y `fallback` sin perder los datos del formulario.

---

## 2. Arquitectura de información

### 2.1 Mapa de rutas

| Ruta | Tipo | Contenido | JS |
| --- | --- | --- | --- |
| `/` | Estática | Hero, destinos destacados, galería teaser, mapa teaser, CTA | Tema, menú, filtros teaser |
| `/destinos` | Estática | Índice completo + filtros por categoría | Filtros (~2 KB) |
| `/destinos/[slug]` | Estática (7) | Ficha: hero, datos, highlights, itinerario, tips, galería, CTA | Tema, menú, lightbox |
| `/rutas` | Estática | Mapa ilustrado + lista de rutas + dificultad + itinerarios | Mapa (~4 KB) |
| `/galeria` | Estática | Galería filtrable + lightbox | Filtros + lightbox (~3 KB) |
| `/contacto` | Estática | Formulario + WhatsApp + datos | Formulario (~3 KB) |
| `/gracias` | Estática | Confirmación post-envío, `noindex` | — |
| `/privacidad` | Estática | Política de tratamiento de datos | — |
| `/terminos` | Estática | Términos de uso y condiciones de reserva | — |
| `/404` | Estática | Error personalizado | — |
| `/api/contacto` | Serverless (Node) | Validación + envío de correo | — |
| `/sitemap-index.xml` | Generada | `@astrojs/sitemap` | — |
| `/robots.txt` | Estática | Reglas + sitemap | — |
| `/og/[slug].png` | Opcional | OG dinámica (fase 2) | — |

### 2.2 Navegación

**Header (desktop ≥ 1024 px)**

```text
[Logotipo]   Inicio · Destinos · Rutas · Galería · Contacto      [Tema] [Reservar →]
```

**Header (móvil)**

```text
[Logotipo]                                        [Tema] [Menú]
```

- Header sticky con fondo translúcido + `backdrop-filter` y borde inferior al hacer scroll.
- Enlace activo con subrayado orgánico y `aria-current="page"`.
- CTA "Reservar" → WhatsApp con mensaje genérico.
- Skip link "Saltar al contenido" como primer elemento enfocable.

**Footer**

- Columnas: marca + manifiesto breve, navegación, contacto (WhatsApp, correo, ubicación), legal (privacidad, términos, RNT), créditos fotográficos.
- Línea final: © año, "Hecho en Antioquia", enlace a GitHub si aplica.

### 2.3 Jerarquía de encabezados

- Un solo `<h1>` por página.
- Secciones con `<h2>`; subsecciones con `<h3>`.
- No se usan encabezados para estilos; existe `.display`, `.eyebrow`, etc.

---

## 3. Sistema de diseño

**Dirección:** editorial natural, cálida y contenida. Luz de bosque, papel y arcilla; tipografía con contraste serif/sans; asimetría intencional; textura sutil; nada de gradientes morados, glassmorphism genérico ni grids uniformes de tarjetas idénticas.

### 3.1 Principios

1. **Territorio primero.** La fotografía manda; la interfaz se retira.
2. **Contraste con calidez.** Verde profundo + hueso + arcilla, no blanco puro ni negro puro.
3. **Asimetría con orden.** Bloques de distinto peso, siempre sobre una retícula de 12 columnas.
4. **Datos legibles.** Dificultad, tiempo y distancia se leen de un vistazo.
5. **Movimiento con propósito.** Solo para orientar, nunca para decorar en exceso.
6. **Accesible por defecto.** El modo oscuro es un tema diseñado, no una inversión automática.

### 3.2 Paleta — modo claro

| Token | Hex | Uso | Contraste |
| --- | --- | --- | --- |
| `--bg` | `#F7F5EE` | Fondo principal (hueso cálido) | — |
| `--bg-elevated` | `#FFFDF7` | Tarjetas, superficies elevadas | — |
| `--surface` | `#EDEAE0` | Bloques alternos, inputs | — |
| `--text` | `#14201A` | Texto principal | 15,4:1 sobre `--bg` |
| `--text-muted` | `#55645C` | Texto secundario | 5,7:1 sobre `--bg` |
| `--primary` | `#1B4D36` | Marca, botones, enlaces | 8,9:1 sobre `--bg` |
| `--primary-hover` | `#143C2A` | Hover/active | 11,1:1 |
| `--on-primary` | `#F7F5EE` | Texto sobre primario | 8,9:1 |
| `--accent` | `#A8451F` | Arcilla: CTA secundario, énfasis | 5,4:1 sobre `--bg` |
| `--accent-soft` | `#F3DCCF` | Fondos de etiqueta arcilla | — |
| `--ochre` | `#B8862B` | Detalle decorativo (no texto) | 3,0:1 |
| `--ochre-ink` | `#7A5410` | Texto sobre fondos claros | 6,2:1 |
| `--border` | `#D8D3C4` | Bordes, divisores | 1,5:1 (no textual) |
| `--focus` | `#0B6B45` | Anillo de foco | 6,0:1 sobre `--bg` |
| `--success` | `#2F7D5A` | Confirmaciones | 4,6:1 |
| `--error` | `#A32E2E` | Errores de formulario | 6,4:1 |

### 3.3 Paleta — modo oscuro

| Token | Hex | Uso | Contraste |
| --- | --- | --- | --- |
| `--bg` | `#0B1411` | Fondo principal (verde carbón) | — |
| `--bg-elevated` | `#111D18` | Tarjetas | — |
| `--surface` | `#16241E` | Bloques alternos, inputs | — |
| `--text` | `#EDEAE2` | Texto principal | 15,6:1 sobre `--bg` |
| `--text-muted` | `#A9B8AF` | Texto secundario | 9,1:1 sobre `--bg` |
| `--primary` | `#8FC7A8` | Marca, enlaces (verde musgo claro) | 9,7:1 sobre `--bg` |
| `--on-primary` | `#07120D` | Texto sobre primario | 9,7:1 |
| `--accent` | `#E08A5F` | Arcilla luminosa | 7,1:1 sobre `--bg` |
| `--accent-soft` | `#33211A` | Fondos de etiqueta arcilla | — |
| `--ochre` | `#E3B25C` | Detalle decorativo, aves | 9,6:1 |
| `--border` | `#2A3B33` | Bordes, divisores | — |
| `--focus` | `#8FC7A8` | Anillo de foco | 9,7:1 |
| `--success` | `#7FB89A` | Confirmaciones | 8,2:1 |
| `--error` | `#F08A80` | Errores | 7,7:1 |

**Reglas de color**

- Ningún texto usa `--border`, `--ochre` ni `--surface`. Para texto ocre se usa `--ochre-ink` en claro y `--ochre` en oscuro.
- Los estados hover no dependen solo del color: se acompañan de subrayado, elevación o icono.
- Los colores de categoría usan siempre la variante "ink" para texto y la variante suave para fondo.
- El modo oscuro no usa `#000` ni `#FFF` puros.

### 3.4 Colores de categoría

| Categoría | Claro (texto / fondo) | Oscuro (texto / fondo) | Icono |
| --- | --- | --- | --- |
| Senderismo | `#2F6B4F` / `#DDE9E1` | `#8FC7A8` / `#1A2E24` | Montaña |
| Cascadas | `#1F6F7A` / `#D8EAEC` | `#7FC4CE` / `#132A2C` | Gota de agua |
| Avistamiento de aves | `#7A5410` / `#F3E6C8` | `#E3B25C` / `#2E2413` | Ave |
| Cultura | `#A8451F` / `#F3DCCF` | `#E08A5F` / `#33211A` | Casa/patrimonio |

### 3.5 Tipografía

| Rol | Familia | Variable | Pesos | Uso |
| --- | --- | --- | --- | --- |
| Display | **Fraunces Variable** | `--font-display` | 400–700, `opsz` | H1–H2, cifras grandes, citas |
| Texto/UI | **Manrope Variable** | `--font-body` | 400–700 | Párrafos, navegación, formularios |
| Datos | Manrope, `font-variant-numeric: tabular-nums` | — | 600 | Distancias, altitudes, duración |

- Autoalojadas (`@fontsource-variable/*`), subset latin, `font-display: swap`.
- Tracking display: `-0.02em`; texto: `0`.
- Medida de lectura: `65ch` máximo; párrafos con `text-wrap: pretty`; títulos con `text-wrap: balance`.

**Escala fluida**

| Token | `clamp()` | Uso |
| --- | --- | --- |
| `--step--1` | `clamp(0.83rem, 0.80rem + 0.15vw, 0.90rem)` | Metadatos, legal |
| `--step-0` | `clamp(1.00rem, 0.96rem + 0.20vw, 1.06rem)` | Cuerpo |
| `--step-1` | `clamp(1.20rem, 1.12rem + 0.40vw, 1.40rem)` | Lead, H4 |
| `--step-2` | `clamp(1.45rem, 1.30rem + 0.75vw, 1.85rem)` | H3 |
| `--step-3` | `clamp(1.75rem, 1.50rem + 1.25vw, 2.50rem)` | H2 sección |
| `--step-4` | `clamp(2.10rem, 1.70rem + 2.00vw, 3.40rem)` | H2 destacado |
| `--step-5` | `clamp(2.60rem, 1.90rem + 3.50vw, 4.75rem)` | H1 |
| `--step-6` | `clamp(3.20rem, 2.00rem + 6.00vw, 7.00rem)` | Hero editorial |

- Interlineado: display `0.98–1.08`, cuerpo `1.65`.
- `eyebrow`: Manrope 600, `0.75rem`, `letter-spacing: 0.14em`, mayúsculas.

### 3.6 Espaciado, retícula y radios

- Base 4 px. Escala: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128.
- Contenedor: `max-width: 1280px`, padding lateral `clamp(1.25rem, 4vw, 2.5rem)`.
- Retícula: 12 columnas, gap `clamp(1rem, 2vw, 2rem)`.
- Secciones: `padding-block: clamp(4rem, 9vw, 8rem)`; alternancia con `--surface` o fondo fotográfico.
- Radios: `4px` (chips pequeños), `12px` (inputs), `20px` (tarjetas), `32px` (bloques destacados), `999px` (pills). Detalle orgánico: una esquina distinta en imágenes hero (`border-radius: 28px 96px 28px 28px`).
- Sombras: solo dos. `--shadow-sm: 0 1px 2px rgb(20 32 26 / 0.06)`, `--shadow-md: 0 18px 40px -24px rgb(20 32 26 / 0.35)`.
- Textura: grano SVG (`feTurbulence`) al 3–4% sobre imágenes hero y bloques oscuros, con `pointer-events: none`.

### 3.7 Movimiento

| Token | Valor |
| --- | --- |
| `--dur-fast` | `150ms` |
| `--dur` | `240ms` |
| `--dur-slow` | `420ms` |
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` |

- Entradas: `opacity` + `translateY(12px)`, una sola vez, con `IntersectionObserver` y umbral 0.15.
- Hover de tarjeta: elevación + zoom de imagen `scale(1.03)`.
- `prefers-reduced-motion: reduce` desactiva transformaciones y parallax; conserva cambios de opacidad ≤ 120 ms.
- Sin animaciones bloqueantes ni loaders artificiales.

### 3.8 Iconografía e ilustración

- Iconos SVG inline, trazo `1.75`, `stroke-linecap: round`, 24×24, `currentColor`.
- Set mínimo: montaña, gota, ave, casa, reloj, regla, altitud, sol, luna, menú, cerrar, flecha, WhatsApp, correo, ubicación, check, alerta.
- Ilustración del mapa: trazo territorial simplificado, etiquetas legibles, sin pretensión cartográfica.

### 3.9 Dirección fotográfica

- Paisajes de Antioquia en formato horizontal 3:2 y vertical 4:5.
- Luz natural, niebla, verde profundo, agua en movimiento, textura de hoja y roca.
- Saturación contenida; sin HDR agresivo ni filtros azules.
- Overlay de texto: degradado lineal `rgba(11,20,17,0.72) → transparente` para garantizar contraste ≥ 4,5:1.
- Toda imagen lleva `alt` descriptivo, dimensiones explícitas y crédito.
- Registro en `CREDITS.md`: autor, fuente, licencia, URL.

### 3.10 Voz y tono

- Cercano, sensorial y preciso. "Caminar entre niebla", no "experiencia inmersiva 360".
- Sin superlativos vacíos ("el mejor del mundo").
- Datos siempre con contexto ("3 h ida y vuelta, 420 m de desnivel").
- Llamados a la acción en primera persona plural o imperativo amable: "Reserva tu caminata", "Escríbenos".
- Turismo responsable explícito: no dejar residuos, respetar senderos, contratar guías locales.

---

## 4. Componentes

| Componente | Archivo | Tipo | JS | Responsabilidad | A11y |
| --- | --- | --- | --- | --- | --- |
| `Layout` | `layouts/Layout.astro` | Astro | No | `<head>`, tema, skip link, header/footer | Landmarks, `lang="es-CO"` |
| `BaseHead` | `components/seo/BaseHead.astro` | Astro | No | Metadatos, OG, canonical, JSON-LD | — |
| `ThemeToggle` | `components/ui/ThemeToggle.astro` | Isla | Sí (~0,6 KB) | Alternar claro/oscuro, persistir | `aria-pressed`, teclado, 44×44 |
| `Header` | `components/layout/Header.astro` | Astro + isla | Sí (~1,2 KB) | Navegación, menú móvil, CTA | `aria-expanded`, focus trap, Esc |
| `Footer` | `components/layout/Footer.astro` | Astro | No | Enlaces, contacto, legal | Landmark `contentinfo` |
| `Hero` | `components/home/Hero.astro` | Astro | No | Imagen a sangre, H1, CTA, datos | `fetchpriority="high"`, contraste |
| `SectionHeading` | `components/ui/SectionHeading.astro` | Astro | No | Eyebrow + título + intro | Jerarquía correcta |
| `DestinationCard` | `components/destinos/DestinationCard.astro` | Astro | No | Imagen, categoría, datos clave | Enlace extendido, `alt` |
| `DestinationFilters` | `components/destinos/DestinationFilters.astro` | Isla | Sí (~2 KB) | Filtrar por categoría | `aria-pressed`, anuncio de resultados |
| `DifficultyBadge` | `components/destinos/DifficultyBadge.astro` | Astro | No | Nivel + icono + texto | No solo color |
| `RouteMap` | `components/rutas/RouteMap.astro` | Isla | Sí (~4 KB) | SVG + hotspots + panel | Lista alternativa, `tablist`/botones, teclado |
| `ItineraryTimeline` | `components/rutas/ItineraryTimeline.astro` | Astro | No | Días, actividades, notas | Lista ordenada semántica |
| `GalleryGrid` | `components/galeria/GalleryGrid.astro` | Isla | Sí (~2 KB) | Filtros + apertura de lightbox | Botones, `aria-label` |
| `Lightbox` | `components/galeria/Lightbox.astro` | Isla | Sí (~1,5 KB) | `<dialog>` con navegación | Focus trap nativo, Esc, flechas |
| `ContactForm` | `components/contacto/ContactForm.astro` | Isla | Sí (~3 KB) | Validación y envío | Labels, `aria-describedby`, `aria-live` |
| `WhatsAppCTA` | `components/ui/WhatsAppCTA.astro` | Astro | No | Enlace contextual `wa.me` | Texto visible, no solo icono |
| `Newsletter`/`Callout` | `components/ui/Callout.astro` | Astro | No | Avisos estacionales/legales | `role="note"` cuando aplique |
| `Breadcrumbs` | `components/ui/Breadcrumbs.astro` | Astro | No | Ruta de navegación | `nav aria-label="Ruta"` |
| `Prose` | `components/ui/Prose.astro` | Astro | No | Estilos de Markdown | Medida 65ch |
| `Stat` | `components/ui/Stat.astro` | Astro | No | Dato numérico + etiqueta | `dl/dt/dd` |

**Presupuesto JS por página**

| Página | Módulos | Objetivo gzip |
| --- | --- | --- |
| Home | theme, header, reveal | ≤ 8 KB |
| Destinos | + filtros | ≤ 12 KB |
| Detalle | + lightbox | ≤ 14 KB |
| Galería | + filtros + lightbox | ≤ 15 KB |
| Rutas | + mapa | ≤ 16 KB |
| Contacto | + formulario | ≤ 14 KB |

> Presupuesto total del bundle JS del sitio ≤ 30 KB gzip (compartido entre páginas). El contenido esencial funciona sin JS.

---

## 5. Historias de usuario

Formato: **Como** … **quiero** … **para** … Cada historia incluye criterios de aceptación verificables.

### US-01 — Entender la propuesta en 5 segundos

**Como** viajero que llega desde una búsqueda o redes, **quiero** ver de inmediato qué ofrece el sitio y para quién es, **para** decidir si sigo explorando.

**Criterios**
1. El hero ocupa el primer viewport y contiene: H1 con propuesta de valor, subtítulo de una línea, CTA primario "Explorar destinos" y CTA secundario "Ver rutas".
2. Hay una imagen de paisaje de Antioquia con `fetchpriority="high"`, dimensiones explícitas y sin CLS.
3. El contraste del texto sobre la imagen es ≥ 4,5:1 en ambos temas.
4. En móvil, el H1 no supera 3 líneas y los CTA son visibles sin scroll en 375×667.
5. El LCP del hero es ≤ 2,0 s en 4G simulada.

### US-02 — Explorar destinos por categoría

**Como** viajero con intereses concretos, **quiero** filtrar los destinos por senderismo, cascadas, aves o cultura, **para** ver solo lo relevante.

**Criterios**
1. Filtros visibles como pills; "Todos" activo por defecto.
2. Un clic/tap filtra inmediatamente sin recargar; la URL refleja el filtro (`?categoria=cascadas`).
3. El botón activo tiene `aria-pressed="true"` y estilo distinguible sin depender solo del color.
4. Se anuncia el número de resultados con `aria-live="polite"`.
5. Si no hay resultados, se muestra un estado vacío con enlace para limpiar el filtro.
6. Funciona con teclado y con JS deshabilitado (se muestran todos los destinos).
7. Cada tarjeta muestra: imagen, nombre, categoría(s), dificultad, duración y municipio.

### US-03 — Conocer un destino en profundidad

**Como** viajero que evalúa una visita, **quiero** una ficha completa del destino, **para** decidir si es adecuado para mí.

**Criterios**
1. Ruta `/destinos/[slug]` generada estáticamente para los 7 destinos.
2. Contiene: hero, resumen, datos de decisión (dificultad, duración, distancia, desnivel, mejor época, altitud), highlights, recomendaciones, galería y CTA de reserva.
3. Los datos se renderizan desde la colección de contenido y están tipados.
4. Incluye enlace "Cómo llegar" a Google Maps con coordenadas.
5. Incluye fecha de actualización visible.
6. Metadatos únicos, canonical y JSON-LD `TouristDestination`.
7. Breadcrumb Inicio → Destinos → [Destino].

### US-04 — Ver la galería y ampliar imágenes

**Como** visitante visual, **quiero** explorar fotos filtrables y verlas en grande, **para** imaginar la experiencia.

**Criterios**
1. Galería con filtros por categoría y por destino.
2. Cada imagen tiene `alt` descriptivo, crédito y dimensiones.
3. Al activar una imagen se abre un `<dialog>` con la versión grande, título, ubicación y crédito.
4. Navegación con flechas ← →, cierre con Esc y botón visible; foco atrapado dentro del diálogo y devuelto al disparador al cerrar.
5. `prefers-reduced-motion` elimina la transición de apertura.
6. Sin JS, las imágenes se muestran en grid con enlaces a la versión completa.

### US-05 — Planificar una ruta según mi nivel

**Como** caminante, **quiero** comparar rutas por dificultad, duración y desnivel, **para** elegir una acorde a mi condición.

**Criterios**
1. `/rutas` muestra mapa ilustrado y lista de rutas.
2. Cada ruta indica: dificultad (Fácil/Moderada/Exigente), duración, distancia, desnivel, época recomendada y destino.
3. El mapa permite seleccionar un destino con ratón, teclado y touch; el panel muestra el resumen y enlace a la ruta.
4. Existe una lista textual equivalente (no se depende del SVG para acceder al contenido).
5. El detalle incluye itinerario por días con actividades y recomendaciones.
6. La dificultad se comunica con texto e icono, no solo color.

### US-06 — Reservar por WhatsApp

**Como** viajero decidido, **quiero** escribir directamente al operador, **para** resolver dudas y reservar sin formularios largos.

**Criterios**
1. El CTA de WhatsApp está en el header y en cada ficha de destino.
2. El enlace usa `https://wa.me/<numero>?text=<mensaje>` con mensaje prellenado que incluye el destino cuando aplica.
3. El número proviene de una variable de entorno pública; nunca está hardcodeado en componentes.
4. En móvil, el CTA flotante no cubre contenido crítico ni el footer y respeta `safe-area-inset`.
5. El enlace tiene texto accesible y `rel="noopener noreferrer"`.

### US-07 — Enviar una consulta por formulario

**Como** viajero que prefiere no usar WhatsApp, **quiero** enviar una consulta detallada, **para** recibir respuesta por correo.

**Criterios**
1. Campos: nombre, correo, teléfono (opcional), destino (select), fecha tentativa (opcional), número de personas, mensaje, aceptación de privacidad.
2. Validación en cliente con mensajes específicos en español y `aria-invalid` + `aria-describedby`.
3. Validación en servidor con el mismo esquema Zod; nunca se confía en el cliente.
4. Honeypot oculto y campo de tiempo mínimo (≥ 3 s) contra bots.
5. Estados: enviando (botón deshabilitado + spinner), éxito (redirección a `/gracias`), error (mensaje con opción de WhatsApp conservando el texto).
6. Respuesta del API en ≤ 5 s o fallback visible.
7. No se registran datos personales en logs.
8. Enlace a política de privacidad junto al checkbox.

### US-08 — Alternar tema claro/oscuro

**Como** visitante, **quiero** cambiar entre tema claro y oscuro, **para** adaptar el sitio a mi entorno y preferencia.

**Criterios**
1. Botón accesible (44×44, `aria-pressed`, `aria-label` dinámico) en header; opcionalmente flotante en móvil.
2. Por defecto respeta `prefers-color-scheme`.
3. La elección se guarda en `localStorage` (`as-theme`) y persiste entre páginas y visitas.
4. No hay destello de tema incorrecto (script inline antes del paint).
5. Ambos temas cumplen contraste AA en todos los estados.
6. Si `localStorage` falla, el sitio sigue funcionando con la preferencia del sistema.

### US-09 — Navegar en el móvil con una mano

**Como** usuario móvil, **quiero** un menú claro y objetivos táctiles cómodos, **para** moverme sin errores.

**Criterios**
1. Menú móvil con `aria-expanded`, cierre con Esc, clic fuera y al navegar.
2. Foco atrapado mientras está abierto y devuelto al botón al cerrar.
3. Objetivos táctiles ≥ 44×44 px con separación ≥ 8 px.
4. Sin scroll horizontal a 320 px de ancho.
5. El header no tapa el título al navegar por anclas (`scroll-margin-top`).

### US-10 — Encontrar el sitio en Google

**Como** operador, **quiero** que el contenido sea indexable y compartible, **para** atraer tráfico orgánico.

**Criterios**
1. `<title>` único (≤ 60 caracteres) y `meta description` (≤ 155) por página.
2. Open Graph y Twitter Card con imagen 1200×630.
3. `canonical` absoluto en todas las páginas.
4. `sitemap-index.xml` y `robots.txt` correctos.
5. JSON-LD válido: `TouristDestination` en fichas, `TravelAgency`/`LocalBusiness` en home, `BreadcrumbList` donde aplique.
6. HTML semántico con un solo H1 y jerarquía correcta.
7. `/gracias` y `/api/*` con `noindex`.

### US-11 — Desplegar sin fricción

**Como** desarrollador, **quiero** que cada cambio se valide y publique automáticamente, **para** entregar rápido y con seguridad.

**Criterios**
1. `bun run build` produce salida sin errores ni warnings de tipos.
2. GitHub Actions ejecuta `astro check` y build en cada PR.
3. Vercel crea preview por PR y publica `main` en producción.
4. Variables de entorno documentadas en `.env.example` y configuradas en Vercel.
5. Rollback a un deployment anterior en < 2 minutos.
6. README con pasos de instalación, contenido y despliegue.

### US-12 — Leer y navegar con tecnologías de asistencia

**Como** persona que usa lector de pantalla o teclado, **quiero** acceder a todo el contenido y las interacciones, **para** usar el sitio en igualdad de condiciones.

**Criterios**
1. Skip link funcional.
2. Orden de tabulación lógico; foco visible con anillo de 2 px y offset 2 px.
3. Todos los controles tienen nombre accesible.
4. Imágenes decorativas con `alt=""`; informativas con descripción.
5. Formularios con `label` asociado, errores anunciados y resumen de errores al enviar.
6. Diálogos con `aria-modal`, título accesible y retorno de foco.
7. Zoom 200% sin pérdida de contenido ni scroll horizontal.
8. Contenido comprensible sin CSS (orden DOM coherente).

---

## 6. Modelo de contenido

### 6.1 Colección `destinos`

`src/content/destinos/*.md` — 7 archivos.

```ts
{
  title: string;                 // "Guatapé"
  slug: string;                  // "guatape"
  municipality: string;          // "Guatapé"
  region: string;                // "Oriente antioqueño"
  summary: string;               // 1–2 líneas para tarjeta
  categories: ("senderismo" | "cascadas" | "aves" | "cultura")[];
  difficulty: "facil" | "moderada" | "exigente";
  durationDays: number;          // 1, 2, 3
  hikeDistanceKm?: number;
  elevationGainM?: number;
  altitudeMasl?: number;
  bestMonths: number[];          // 1–12
  coordinates: { lat: number; lng: number };
  heroImage: ImageMetadata;
  gallery: { src: ImageMetadata; alt: string; caption?: string }[];
  highlights: string[];          // 3–6
  tips: string[];                // 3–6
  accessibilityNotes?: string;
  featured: boolean;
  order: number;
  updatedAt: Date;               // "2026-10-25"
}
```

Cuerpo Markdown: contexto narrativo (150–300 palabras), "Qué hacer", "Cómo llegar", "Turismo responsable".

### 6.2 Colección `rutas`

`src/content/rutas/*.md` — 1 ruta por destino (mínimo 7).

```ts
{
  title: string;
  slug: string;
  destination: string;           // referencia a destino.slug
  difficulty: "facil" | "moderada" | "exigente";
  durationDays: number;
  distanceKm: number;
  elevationGainM?: number;
  season: string;                // "Diciembre a marzo"
  startPoint: string;
  coordinates: { lat: number; lng: number };
  itinerary: {
    day: number;
    title: string;
    description: string;
    activities: string[];
  }[];
  recommendations: string[];
  updatedAt: Date;
}
```

### 6.3 Colección `galeria`

`src/content/galeria/*.md` o `galeria.yaml`.

```ts
{
  src: ImageMetadata;
  alt: string;
  caption?: string;
  location: string;
  destination?: string;          // slug
  category: "paisaje" | "fauna" | "cultura" | "agua";
  credit: { author: string; source: string; license: string; url?: string };
  width: number;
  height: number;
}
```

### 6.4 Configuración del sitio

`src/data/site.ts` exporta:

```ts
{
  name: "Antioquia Silvestre",
  tagline: string,
  description: string,
  url: string,                   // import.meta.env.PUBLIC_SITE_URL
  whatsapp: string,              // ficticio, solo dígitos, desde env
  email: string,                 // ficticio, desde env
  rnt: string,                   // ficticio, marcado como demostración
  location: string,              // "Medellín, Antioquia"
  demoNotice: string,            // "Sitio de demostración con fines educativos"
  socials: { instagram?: string; youtube?: string },
  nav: { label: string; href: string }[],
}
```

### 6.5 Variables de entorno

| Variable | Público | Requerida | Uso |
| --- | --- | --- | --- |
| `PUBLIC_SITE_URL` | Sí | Sí | Canonical, sitemap, OG |
| `PUBLIC_WHATSAPP_NUMBER` | Sí | Sí | Enlaces `wa.me` (solo dígitos, con indicativo 57) |
| `PUBLIC_CONTACT_EMAIL` | Sí | Sí | Footer y fallback |
| `RESEND_API_KEY` | No | Sí (prod) | Envío del formulario |
| `CONTACT_TO_EMAIL` | No | Sí | Destinatario |
| `CONTACT_FROM_EMAIL` | No | Sí | Remitente verificado en Resend |
| `PUBLIC_ANALYTICS_ENABLED` | Sí | No | Activar analítica |

`.env.example` documenta todas; el build falla con mensaje claro si falta una variable pública requerida.

---

## 7. Comportamientos interactivos (contratos)

### 7.1 Tema

```text
1. En <head>, antes de CSS: leer localStorage("as-theme").
2. Si existe ("light" | "dark"), aplicar <html data-theme="...">.
3. Si no, aplicar el resultado de matchMedia("(prefers-color-scheme: dark)").
4. Al montar el botón: reflejar estado con aria-pressed y aria-label ("Activar modo oscuro"/"Activar modo claro").
5. Al activar: alternar data-theme, guardar en localStorage, actualizar <meta name="theme-color">.
6. Si localStorage lanza excepción: continuar sin persistencia.
7. Escuchar cambios del sistema solo si el usuario no ha elegido manualmente.
```

### 7.2 Filtros de destinos/galería

```text
- Botones con data-filter; estado activo en aria-pressed.
- Filtrar por data-categories (lista separada por espacios).
- Sincronizar ?categoria= con history.replaceState.
- Al montar, leer la URL y aplicar el filtro.
- Anunciar "N destinos" en región aria-live.
- Mostrar estado vacío con botón "Ver todos".
- Sin JS: todos los elementos visibles.
```

### 7.3 Lightbox

```text
- Un <dialog> único por página, reutilizado.
- Abrir con showModal(); guardar el elemento disparador.
- Contenido: <img> grande (srcset), título, ubicación, crédito, contador "3 / 24".
- Teclado: Esc cierra, ←/→ navega, Tab cicla dentro.
- Clic en backdrop cierra; botón "Cerrar" siempre visible.
- Al cerrar: dialog.close() y devolver foco al disparador.
- Precargar solo la imagen siguiente/anterior.
```

### 7.4 Mapa de rutas

```text
- SVG con <path> del territorio y botones posicionados por coordenadas normalizadas.
- Interacción: click/tap/Enter/Space selecciona un destino.
- Panel lateral (desktop) o inferior (móvil) con: nombre, región, dificultad, duración, enlaces.
- Estado seleccionado con aria-pressed y cambio de estilo + texto.
- Lista de rutas debajo del mapa: fuente de verdad accesible.
- Sin JS: se muestra el SVG estático + lista completa.
```

### 7.5 Formulario

```text
POST /api/contacto  (application/json)
Body: { nombre, email, telefono?, destino?, fecha?, personas, mensaje, privacidad, website /*honeypot*/, startedAt }

200 → { ok: true }
400 → { ok: false, errors: { campo: "mensaje" } }
429 → { ok: false, error: "rate_limited" }
500 → { ok: false, error: "send_failed" }

Reglas:
- Zod compartido en src/lib/contact-schema.ts.
- Trim + límites: nombre 2–80, mensaje 20–1500, email válido, personas 1–20.
- Rechazar si website tiene contenido o startedAt < 3 s.
- Content-Type JSON y body ≤ 16 KB.
- Rate limit best-effort por IP (5/h) + nota de limitación serverless.
- Si falta RESEND_API_KEY: responder 503 y la UI ofrece WhatsApp.
```

---

## 8. Requisitos no funcionales

### NFR-01 — Rendimiento

| Métrica | Objetivo (móvil, 4G) |
| --- | --- |
| Lighthouse Performance | ≥ 95 |
| LCP | ≤ 2,0 s |
| INP | ≤ 200 ms |
| CLS | ≤ 0,05 |
| TBT | ≤ 200 ms |
| JS por página | ≤ 16 KB gzip |
| JS total del sitio | ≤ 30 KB gzip |
| HTML + CSS | ≤ 70 KB gzip |
| Fuentes | ≤ 120 KB total |
| Imagen hero | ≤ 180 KB (AVIF) |
| Imagen de tarjeta | ≤ 90 KB |
| Build | ≤ 90 s en Vercel |

**Implementación obligatoria:** `astro:assets` con `widths`/`sizes`, AVIF + WebP, `loading="lazy"` salvo hero, `decoding="async"`, dimensiones explícitas, CSS crítico en el HTML, sin librerías de animación.

### NFR-02 — Accesibilidad (WCAG 2.2 AA)

- Contraste ≥ 4,5:1 texto normal, ≥ 3:1 texto grande y componentes.
- Todos los controles operables con teclado; foco visible.
- Objetivos táctiles ≥ 24×24 (mínimo legal) y ≥ 44×44 (objetivo del proyecto).
- `prefers-reduced-motion` respetado.
- Formularios con etiquetas persistentes (no solo placeholder).
- Zoom 200% y reflow a 320 px sin scroll horizontal.
- Sin trampas de teclado; diálogos con manejo de foco.
- Textos alternativos revisados uno a uno.
- Auditado con axe + navegación manual con teclado + VoiceOver/NVDA.

### NFR-03 — SEO y contenido

- HTML semántico, un H1 por página.
- Títulos y descripciones únicos.
- URLs limpias, en minúsculas, sin fechas.
- `sitemap-index.xml`, `robots.txt`, canonical absoluto.
- OG image 1200×630 por destino (estática o generada).
- JSON-LD sin errores en Rich Results Test.
- Enlaces internos entre destinos, rutas y galería.
- Contenido en español con `lang="es-CO"`.

### NFR-04 — Seguridad

- HTTPS obligatorio (Vercel).
- Cabeceras: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` mínima, `X-Frame-Options: DENY`, `Strict-Transport-Security`.
- Sin secretos en cliente; solo variables `PUBLIC_*`.
- Validación y saneamiento de entrada en servidor.
- Honeypot + time-trap + rate limit.
- Dependencias auditadas (`bun audit`) antes de cada release.
- CSP con hashes en fase 2 (documentar inline scripts).

### NFR-05 — Privacidad

- Sin cookies de terceros ni píxeles publicitarios.
- Analítica agregada y sin cookies (Vercel Analytics) o consentimiento.
- Política de privacidad conforme a Ley 1581 de 2012 (Colombia).
- Retención de mensajes: solo el correo operativo; sin base de datos.
- Enlace visible a la política junto al formulario.

### NFR-06 — Compatibilidad

- Chrome, Edge, Firefox y Safari: últimas 2 versiones.
- iOS 16+, Android 10+.
- Resoluciones 320 px a 2560 px.
- Sin dependencia de APIs no soportadas sin fallback (`dialog` tiene polyfill solo si se detecta).

### NFR-07 — Mantenibilidad

- TypeScript estricto (`astro check` en CI).
- Componentes con una responsabilidad y props tipadas.
- Tokens de diseño en un único archivo CSS.
- Contenido separado de presentación.
- Convención de nombres: componentes `PascalCase.astro`, utilidades `kebab-case.ts`, clases Tailwind + componentes semánticos.
- Sin `!important` salvo utilidad documentada.
- README y `CREDITS.md` actualizados.

### NFR-08 — Vercel y CI/CD

| Requisito | Implementación |
| --- | --- |
| Adaptador | `@astrojs/vercel` en `astro.config.mjs` |
| Salida | `static` para páginas + función Node para `/api/contacto` |
| Build | `bun run build` (Vercel detecta Bun por `bun.lock`) |
| Node | 22.x fijado en `engines` y configuración del proyecto |
| Preview | Automático por PR (Vercel Git Integration) |
| Producción | Push/merge a `main` |
| Variables | Configuradas en Vercel (Preview + Production) |
| Cabeceras | `vercel.json` con headers de seguridad y cache |
| CI | GitHub Actions: install → `astro check` → build |
| Rollback | Instant rollback desde el dashboard de Vercel |
| Dominio | Conexión y DNS en fase de lanzamiento |

**Cache:** assets con hash `immutable` (1 año); HTML `max-age=0, must-revalidate`; imágenes optimizadas con cache larga.

**`vercel.json` (base):**

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=(self)" },
        { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" }
      ]
    },
    {
      "source": "/_astro/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    }
  ]
}
```

### NFR-09 — Observabilidad

- Vercel Analytics (si se aprueba D-06): page views y Web Vitals.
- Logs de función para errores de envío (sin datos personales).
- Alertas: correo al operador si falla el envío (fallback manual).
- Revisión mensual de Search Console.

### NFR-10 — Contenido y tono

- Español neutro colombiano; sin anglicismos innecesarios.
- Datos con fuente cuando sean externos.
- Fechas en formato `25 de octubre de 2026`.
- Marcas de "información de referencia" en datos variables (clima, tiempos).
- Créditos de imagen obligatorios.

---

## 9. Estados y casos límite

| Caso | Comportamiento esperado |
| --- | --- |
| Sin JS | Todo el contenido visible; filtros muestran todo; galería enlaza a imagen completa; formulario muestra `action` alternativa o datos de contacto |
| Imagen no carga | Fondo `--surface` + texto alternativo visible; sin layout shift |
| Fuente no carga | Fallback `Georgia, serif` / `system-ui, sans-serif` con métricas ajustadas |
| localStorage bloqueado | Tema del sistema, sin errores en consola |
| Filtro sin resultados | Estado vacío con mensaje y "Ver todos" |
| `?categoria=` inválida | Se ignora y se muestra "Todos" |
| API de contacto caída | Mensaje de error + botón de WhatsApp con el mensaje prellenado |
| Envío duplicado | Botón deshabilitado durante el envío; idempotencia por UI |
| Rate limit | Mensaje claro con alternativa de WhatsApp/correo |
| Imagen de galería rota | Placeholder con `alt` y crédito |
| Viewport 320 px | Sin scroll horizontal; menú usable |
| Modo oscuro + imágenes | Overlays ajustados para mantener contraste |
| Usuario con `prefers-reduced-motion` | Sin parallax ni transformaciones de entrada |
| Enlace profundo a `/destinos/[slug]` inexistente | 404 con enlaces a destinos |

---

## 10. Estructura de archivos objetivo

```text
/
├── .github/workflows/ci.yml
├── public/
│   ├── favicon.svg
│   ├── og-default.jpg
│   └── robots.txt
├── specs/
│   ├── proposal.md
│   ├── spec.md
│   └── tasks.md
├── src/
│   ├── assets/
│   │   └── images/            # fotos optimizables
│   ├── components/
│   │   ├── contacto/
│   │   ├── destinos/
│   │   ├── galeria/
│   │   ├── home/
│   │   ├── layout/
│   │   ├── rutas/
│   │   ├── seo/
│   │   └── ui/
│   ├── content/
│   │   ├── destinos/
│   │   ├── rutas/
│   │   └── galeria/
│   ├── content.config.ts
│   ├── data/site.ts
│   ├── layouts/Layout.astro
│   ├── lib/
│   │   ├── contact-schema.ts
│   │   └── utils.ts
│   ├── pages/
│   │   ├── api/contacto.ts
│   │   ├── destinos/[slug].astro
│   │   ├── destinos/index.astro
│   │   ├── galeria.astro
│   │   ├── rutas.astro
│   │   ├── contacto.astro
│   │   ├── gracias.astro
│   │   ├── privacidad.astro
│   │   ├── terminos.astro
│   │   ├── 404.astro
│   │   └── index.astro
│   ├── styles/global.css
│   └── env.d.ts
├── astro.config.mjs
├── vercel.json
├── .env.example
├── CREDITS.md
└── README.md
```

---

## 11. Trazabilidad requisito → tarea

| Requisito | Tareas |
| --- | --- |
| US-01 Hero | T-301, T-302, T-303 |
| US-02 Filtros | T-401, T-402 |
| US-03 Ficha destino | T-403, T-404, T-405 |
| US-04 Galería/lightbox | T-501, T-502, T-503 |
| US-05 Rutas/mapa | T-601, T-602, T-603 |
| US-06 WhatsApp | T-701, T-702 |
| US-07 Formulario | T-703, T-704, T-705 |
| US-08 Tema | T-102, T-103 |
| US-09 Móvil | T-104, T-105 |
| US-10 SEO | T-801, T-802, T-803 |
| US-11 Vercel/CI | T-901…T-907 |
| US-12 A11y | T-101, T-802, T-1003 |
| NFR-01 Perf | T-201, T-204, T-801, T-1002 |
| NFR-08 Vercel | T-901…T-907 |

---

## 12. Definition of Done

Una tarea se considera terminada cuando:

- [ ] Cumple todos sus criterios de aceptación.
- [ ] `bun run check` y `bun run build` pasan sin errores.
- [ ] Funciona en claro y oscuro, a 320 px y 1440 px.
- [ ] Es operable con teclado y tiene foco visible.
- [ ] No introduce JS fuera del presupuesto.
- [ ] Las imágenes tienen `alt`, dimensiones y peso dentro del límite.
- [ ] No hay errores ni warnings en consola.
- [ ] Se actualizó la documentación o el contenido afectado.
- [ ] El PR tiene preview de Vercel y descripción con captura (si aplica).

**Puertas de calidad del proyecto**

| Puerta | Criterio |
| --- | --- |
| G1 — Fundaciones | Tema persistente sin FOUC, tokens aplicados, header/footer accesibles |
| G2 — Contenido | 7 destinos + 7 rutas + 24 fotos cargadas y validadas por Zod |
| G3 — Funcional | Filtros, lightbox, mapa y formulario operativos |
| G4 — Calidad | Lighthouse móvil ≥ 95/100/100/100; axe sin violaciones críticas |
| G5 — Entrega | CI verde, preview por PR, producción en Vercel, README completo |

---

## 13. Decisiones cerradas y pendientes menores

**Cerradas**

1. Astro 7.4.2 (D-01).
2. Nombre: Antioquia Silvestre (D-02).
3. Datos ficticios, ubicación Medellín, dominio `antioquiasilvestre.co`, aviso de demostración educativa (D-03).
4. Fotografía de banco libre con créditos (D-04).

**Pendientes menores (no bloquean v1)**

5. Proveedor definitivo del formulario: Resend es la implementación de referencia; si no hay API key se usa el fallback de WhatsApp (D-05).
6. Analítica: Vercel Analytics queda desactivada por defecto hasta que exista proyecto en Vercel (D-06).
7. El dominio es de ejemplo; no se conecta DNS real en este trabajo práctico.

---

## 14. Aviso de demostración

Todo el sitio debe declarar, de forma visible y no intrusiva:

> **Sitio de demostración con fines educativos.** Los datos de contacto, precios, disponibilidad y RNT son ficticios. Los destinos y su geografía son reales.

Se incluye en el footer, en `/terminos` y en el correo de confirmación del formulario de contacto.
