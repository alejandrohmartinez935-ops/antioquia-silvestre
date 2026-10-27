// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { loadEnv } from 'vite';
import { resolveSiteUrl } from './src/lib/site-url.mjs';

// `astro.config.mjs` se evalúa antes de que Astro cargue `.env`, por eso leemos
// las variables con Vite. Así `PUBLIC_SITE_URL` y las variables de Vercel
// (`VERCEL_PROJECT_PRODUCTION_URL`, `VERCEL_URL`) llegan al canonical, al
// sitemap y a los metadatos Open Graph.
const mode = process.env.NODE_ENV ?? 'production';
const env = loadEnv(mode, process.cwd(), '');

// https://astro.build/config
export default defineConfig({
	site: resolveSiteUrl(env),
	adapter: vercel(),
	integrations: [
		sitemap({
			// `/gracias` es una página de confirmación con `noindex`.
			filter: (page) => !page.includes('/gracias'),
		}),
	],
	vite: {
		plugins: [tailwindcss()],
	},
});
