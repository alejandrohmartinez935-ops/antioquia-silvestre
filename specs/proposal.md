# Proposal — Antioquia Silvestre

**Plataforma web de ecoturismo regional en Antioquia, Colombia**

| Campo | Valor |
| --- | --- |
| Documento | `specs/proposal.md` |
| Versión | 1.0.0 |
| Fecha | 2026-10-25 |
| Estado | Propuesta para aprobación |
| Metodología | SDD (Spec-Driven Development) |
| Fase siguiente | `specs/spec.md` → `specs/tasks.md` |

---

## 1. Resumen ejecutivo

Antioquia concentra una de las ofertas de ecoturismo más diversas de Colombia: embalses y montañas (Guatapé), cascadas y bosque húmedo (Jardín, San Rafael, Cocorná), aviturismo (Támesis, Jardín, Santa Rosa de Osos), patrimonio rural y cultural (Jericó, Guatapé) y páramos y bosques altoandinos (Santa Rosa de Osos, Jericó). Sin embargo, esa oferta se comunica de forma fragmentada: cuentas de redes sociales sin estructura, operadores sin sitio propio y portales genéricos que no responden a las preguntas reales del viajero (dificultad, duración, época del año, cómo llegar, qué llevar, con quién reservar).

**Antioquia Silvestre** es un sitio estático de alto rendimiento, bilingüe en intención visual pero en español, que presenta el territorio como una guía editorial curada: destinos filtrables, galería de paisajes, rutas con nivel de exigencia e itinerarios sugeridos, y un canal de reserva directo por WhatsApp. El sitio se construye con Astro, Tailwind CSS, JavaScript mínimo (sin framework de UI) y despliegue continuo en Vercel desde GitHub.

**Resultado esperado:** un producto editorial-digital que se sienta como una revista de naturaleza —no como un catálogo de agencia— y que convierta visitas en conversaciones de reserva con un costo de mantenimiento casi nulo.

---

## 2. Problema

### 2.1 Problema del viajero

1. **Información dispersa y no confiable.** El viajero encuentra fotos sin contexto, sin datos de dificultad ni duración, y sin advertencias estacionales.
2. **Fricción en la decisión.** No puede comparar destinos por categoría (senderismo, cascadas, aves, cultura), nivel de exigencia o tiempo disponible.
3. **Desconfianza en la reserva.** No hay un canal claro, humano y verificable para preguntar; los formularios genéricos no reciben respuesta.
4. **Brecha de accesibilidad.** La mayoría de los sitios turísticos regionales no cumplen criterios básicos de contraste, teclado, lectores de pantalla ni modo oscuro.

### 2.2 Problema del negocio (operador regional)

1. **Dependencia de redes sociales** y del alcance algorítmico para captar viajeros.
2. **Sin activo digital propio** que posicione en buscadores y sostenga la marca en el tiempo.
3. **Sin visibilidad de demanda**: no sabe qué destinos, temporadas o experiencias generan más interés.
4. **Alto costo de operación digital** cuando se usan plantillas pesadas, CMS innecesarios o agencias externas.

### 2.3 Oportunidad

- El turismo de naturaleza en Colombia sigue creciendo y Antioquia es una de las puertas de entrada.
- La búsqueda orgánica ("cascadas cerca de Medellín", "avistamiento de aves Antioquia", "Guatapé qué hacer") tiene intención alta y competencia de baja calidad editorial.
- Un sitio liviano, accesible y bien estructurado puede posicionarse sin pauta y convertir por WhatsApp, el canal de mayor confianza en la región.

---

## 3. Audiencia

### 3.1 Primaria — Viajero urbano de 25 a 45 años

- Vive en Medellín, Bogotá o el Eje Cafetero; viaja en pareja o con amigos.
- Busca escapadas de 1 a 3 días, presupuesto medio, experiencia natural auténtica.
- Decide desde el móvil, en sesiones cortas, y consulta por WhatsApp antes de reservar.
- Le importan: seguridad, dificultad real de la caminata, clima, transporte y costo aproximado.

### 3.2 Secundaria — Viajero especializado

- **Aviturista** nacional o extranjero: busca especies, temporadas, guías locales y logística.
- **Senderista/caminante:** compara distancia, desnivel, dificultad y época.
- **Viajero cultural:** patrimonio, café, gastronomía y comunidades.

### 3.3 Terciaria — Aliados y operadores

- Guías locales, hospedajes y transportadores que necesitan un canal de referencia confiable.
- Medios y creadores de contenido que buscan material verificado y citable.

### 3.4 Necesidades transversales

| Necesidad | Respuesta del producto |
| --- | --- |
| "¿Qué puedo hacer en 2 días?" | Itinerarios por destino y por nivel |
| "¿Es muy difícil?" | Badge de dificultad + distancia + desnivel |
| "¿Cuándo ir?" | Mejor época, clima y advertencias |
| "¿Cómo reservo?" | WhatsApp contextual + formulario |
| "¿Es confiable?" | RNT, equipo local, créditos fotográficos, política de privacidad |
| "Quiero ver más fotos" | Galería filtrable con lightbox accesible |

---

## 4. Propuesta de valor

> **"Antioquia, contada por su territorio."**
> Una guía editorial de ecoturismo que convierte paisaje en decisión: qué visitar, cuándo ir, cuánto exige y cómo reservar — en una experiencia rápida, accesible y hermosa.

### 4.1 Pilares

1. **Curaduría, no catálogo.** Siete destinos emblemáticos, cada uno con voz propia, datos verificables y recomendaciones concretas.
2. **Diseño con carácter natural.** Paleta verde/tierra, tipografía editorial, texturas sutiles, fotografía a sangre y composición asimétrica. Nada de plantillas genéricas.
3. **Rendimiento como feature.** HTML estático, cero frameworks de UI, imágenes AVIF/WebP, JS bajo demanda. El sitio debe sentirse instantáneo en 4G.
4. **Accesibilidad real.** WCAG 2.2 AA, teclado completo, foco visible, modo oscuro persistente, movimiento reducido.
5. **Conversión sin fricción.** WhatsApp siempre a un toque; formulario con validación clara y respuesta humana comprometida.

### 4.2 Diferenciadores

- **Modo oscuro nativo** diseñado desde el inicio (no invertido), con paleta verde profundo/carbón.
- **Mapa ilustrado interactivo** de rutas, sin dependencias de mapas ni claves de API, con alternativa textual accesible.
- **Fichas de destino con datos de decisión**: dificultad, duración, distancia, desnivel, mejor época, accesibilidad.
- **Cero JS de framework**: interacciones con islas pequeñas y `<dialog>` nativo.
- **Preparado para Vercel** con preview por PR, CI y variables de entorno documentadas.

---

## 5. Objetivos y métricas

### 5.1 Objetivos de negocio (90 días post-lanzamiento)

| ID | Objetivo | Métrica | Meta |
| --- | --- | --- | --- |
| O-1 | Generar demanda directa | Clics a WhatsApp | ≥ 120/mes |
| O-2 | Capturar intención | Envíos de formulario válidos | ≥ 30/mes |
| O-3 | Ganar visibilidad orgánica | Impresiones en Search Console | ≥ 10.000/mes |
| O-4 | Sostener calidad | Tasa de rebote móvil | ≤ 55% |
| O-5 | Entregar rápido | Core Web Vitals "Good" en campo | ≥ 90% de sesiones |

### 5.2 Objetivos de producto (medibles en el build)

| ID | Objetivo | Criterio |
| --- | --- | --- |
| P-1 | Rendimiento | Lighthouse móvil: Performance ≥ 95, LCP ≤ 2,0 s, CLS ≤ 0,05 |
| P-2 | Accesibilidad | Lighthouse A11y = 100; auditoría manual de teclado y lector de pantalla |
| P-3 | SEO | 100 en Lighthouse SEO, sitemap, canonical, JSON-LD válido |
| P-4 | Peso | JS de página ≤ 30 KB gzip; HTML+CSS ≤ 70 KB gzip |
| P-5 | Cobertura de contenido | 7 destinos, 24+ fotos, 7 rutas/itinerarios, 4 categorías |
| P-6 | Despliegue | Build en Vercel < 90 s; preview automático en cada PR |

### 5.3 No objetivos (éxito no medido por)

- Número de seguidores en redes.
- Cantidad de páginas indexadas por sí misma.
- Complejidad técnica o cantidad de dependencias.

---

## 6. Alcance

### 6.1 Dentro del alcance (v1)

**Contenido y páginas**

- Home editorial con hero, destinos destacados, galería, mapa de rutas, prueba social y CTA.
- Índice de destinos con filtros por categoría (senderismo, cascadas, avistamiento de aves, cultura).
- Página de detalle por destino (7 destinos: Guatapé, Jardín, Jericó, San Rafael, Támesis, Santa Rosa de Osos, Cocorná).
- Galería filtrable con lightbox accesible.
- Sección/página de rutas con mapa ilustrado, dificultad, duración, desnivel e itinerarios.
- Contacto: formulario validado + WhatsApp contextual.
- Páginas legales mínimas: privacidad (Ley 1581 de 2012) y términos.
- 404 personalizada.

**Sistema**

- Modo claro/oscuro con persistencia en `localStorage` y respeto a `prefers-color-scheme`, sin flash (FOUC).
- Sistema de diseño tokenizado (color, tipografía, espaciado, radios, sombras, movimiento).
- Navegación responsive con menú móvil accesible.
- Componentes reutilizables en Astro y colecciones de contenido tipadas.
- SEO técnico completo (metadatos, OG, sitemap, robots, JSON-LD).
- Endpoint serverless de contacto con validación y honeypot.
- Preparación de Vercel + GitHub Actions + documentación de despliegue.

**Calidad**

- Presupuestos de rendimiento y accesibilidad verificados.
- Pruebas manuales en Chrome, Firefox, Safari (iOS/macOS) y Edge.
- CI que ejecuta `astro check` y `astro build`.

### 6.2 Fuera del alcance (v1)

- Motor de reservas con disponibilidad en tiempo real y pagos en línea.
- Cuentas de usuario, favoritos persistentes o panel de cliente.
- CMS administrativo (Sanity/Strapi/Decap) — el contenido vive en el repositorio.
- Multi-idioma (i18n). Se deja la arquitectura preparada, pero v1 es solo español (es-CO).
- Reseñas verificadas de usuarios o sistema de rating.
- Mapa con rutas GPS trazadas sobre cartografía real (OpenStreetMap/Mapbox). v1 usa mapa ilustrado + enlaces a Google Maps.
- Blog/noticias y newsletter.
- Integración con pasarelas de pago o CRM.
- App móvil.

### 6.3 Supuestos

1. El cliente/operador entrega: nombre comercial definitivo, RNT, número de WhatsApp, correo, dirección y textos legales.
2. Las fotografías son de uso libre (Unsplash/Pexels) o cedidas por el operador, con créditos.
3. Los datos de dificultad, distancia y duración son aproximados y se marcan como referencia, no como garantía.
4. El dominio se conecta a Vercel en la fase de lanzamiento.
5. El volumen de formularios es bajo (< 500/mes), suficiente para un endpoint serverless sin cola.

### 6.4 Restricciones

- Sin backend propio ni base de datos en v1.
- Sin presupuesto para servicios de mapas o CMS.
- El contenido debe ser editable por una persona no técnica mediante archivos Markdown/YAML.
- El sitio debe funcionar sin JavaScript para el contenido esencial (navegación, lectura, enlaces).

---

## 7. Enfoque SDD

Este proyecto se ejecuta en tres artefactos secuenciales:

```text
specs/
├── proposal.md   ← este documento (por qué y qué)
├── spec.md       ← requisitos verificables, diseño y contratos (cómo debe comportarse)
└── tasks.md      ← plan de ejecución, dependencias y puertas de calidad
```

**Reglas de trabajo**

1. Ningún cambio de alcance sin actualizar `spec.md` primero.
2. Cada tarea de `tasks.md` referencia un requisito (`US-*`, `NFR-*`) y tiene criterio de aceptación.
3. La implementación no se considera terminada si no cumple la Definition of Done de `spec.md` §12.
4. Las decisiones técnicas se registran como ADR dentro de `spec.md` §3, con contexto y consecuencias.
5. El contenido (destinos, rutas, fotos) es parte de la especificación: se versiona con el código.

---

## 8. Riesgos y mitigaciones

| ID | Riesgo | Prob. | Impacto | Mitigación |
| --- | --- | --- | --- | --- |
| R-01 | Datos turísticos inexactos (dificultad, tiempos, clima) | Alta | Alto | Marcar como referencia, revisar con guías locales, fecha de actualización visible |
| R-02 | Fotografías sin licencia o de baja calidad | Media | Alto | Descargar solo de Unsplash/Pexels, registrar autor y licencia en `CREDITS.md` |
| R-03 | Formulario cae en spam | Media | Medio | Honeypot + time-trap + validación Zod + límite de tamaño; Turnstile si escala |
| R-04 | Dependencia de un solo canal (WhatsApp) | Media | Medio | Formulario + correo + enlaces contextuales; medir ambos |
| R-05 | El destino se vuelve masivo y degrada el territorio | Baja | Alto | Mensajes de turismo responsable, cupos, recomendaciones de bajo impacto |
| R-06 | Deriva de rendimiento por imágenes | Alta | Medio | Pipeline `astro:assets`, presupuesto por imagen, auditoría en CI/preview |
| R-07 | Accesibilidad del mapa y la galería | Media | Alto | Alternativa textual, teclado, `<dialog>`, pruebas con lector de pantalla |
| R-08 | Cambio de versión mayor de Astro | Media | Medio | Fijar versión, actualizar en PR dedicado con `astro check` y build |
| R-09 | Vercel no recibe variables de entorno | Baja | Medio | `.env.example`, validación al arranque, fallback de contacto por WhatsApp |
| R-10 | Contenido desactualizado | Alta | Medio | Campo `updatedAt`, revisión trimestral, tarea de mantenimiento |

---

## 9. Decisiones (actualizado 2026-10-25)

| ID | Decisión | Resolución | Impacto |
| --- | --- | --- | --- |
| D-01 | **Versión de Astro.** El brief pide Astro v5; el proyecto ya tiene **Astro 7.4.2** instalado (verificado en `node_modules`). | **Resuelto:** se mantiene **Astro 7.4.2**. Las APIs usadas (islands, content collections, `astro:assets`, endpoints) son estables. | Ninguno; se documenta en ADR-01 |
| D-02 | **Nombre de marca.** Se usa "Antioquia Silvestre" como nombre de trabajo. | **Resuelto:** se confirma **Antioquia Silvestre**. | Copy, metadatos, logo y dominio quedan alineados |
| D-03 | **Datos de contacto reales.** WhatsApp, correo, RNT, dirección. | **Resuelto:** proyecto educativo con **datos ficticios**. Ubicación: **Medellín, Antioquia**. Dominio de ejemplo terminado en `.co`: `https://antioquiasilvestre.co`. | Se muestra un aviso de demostración; no se usa información de personas reales |
| D-04 | **Fotografía.** Banco de imágenes libre vs. fotos del operador. | Empezar con banco libre curado (Unsplash/Wikimedia) y registrar créditos. | Afecta peso y licencias; se documenta en `CREDITS.md` |
| D-05 | **Entrega del formulario.** Resend (recomendado) vs. Formspree/Web3Forms. | Resend con endpoint propio; fallback a WhatsApp si falla. | Cambia variables de entorno y costo |
| D-06 | **Analítica.** Vercel Analytics (simple, sin cookies) vs. Plausible/Umami. | Vercel Analytics en v1 (opcional). | Afecta privacidad y dependencias |

> **Nota de contexto:** este es un trabajo práctico con fines educativos. Los datos de contacto, precios, RNT, testimonios y disponibilidad son ficticios y así se declara en el footer y en las páginas legales. Los nombres de los destinos y su geografía son reales.

---

## 10. Criterios de éxito del proyecto

El proyecto se considera exitoso cuando:

1. Las siete fichas de destino y sus rutas están publicadas y son editables por Markdown.
2. Un usuario puede filtrar destinos y abrir un destino en menos de 3 toques desde el móvil.
3. El cambio de tema persiste entre visitas y no produce destello al cargar.
4. La galería funciona con teclado y lector de pantalla.
5. El formulario valida en cliente y servidor y responde con estados claros.
6. Lighthouse móvil cumple los umbrales de §5.2 en producción.
7. Cada PR genera un preview en Vercel y el merge a `main` publica automáticamente.
8. La documentación permite a otra persona desplegar y editar contenido sin ayuda.

---

## 11. Aprobación

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| Product owner | — | — | Pendiente |
| Diseño | — | — | Pendiente |
| Desarrollo | — | — | Pendiente |

> Al aprobar este documento se habilita la implementación de `specs/spec.md` y la ejecución de `specs/tasks.md`.
