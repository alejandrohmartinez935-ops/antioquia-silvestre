import { resolveSiteUrl } from '../lib/site-url.mjs';

// `import.meta.env` solo expone variables `PUBLIC_*`; las de Vercel viven en
// `process.env` durante el build. El resultado debe coincidir con `site` en
// `astro.config.mjs` (canonical, sitemap y JSON-LD).
const buildEnv = (
	globalThis as { process?: { env?: Record<string, string | undefined> } }
).process?.env;

export const site = {
	name: 'Antioquia Silvestre',
	tagline: 'Antioquia, contada por su territorio',
	description:
		'Guía de ecoturismo por Antioquia: destinos, cascadas, aviturismo, rutas de senderismo e itinerarios para viajar con calma y con guías locales.',
	url: resolveSiteUrl({
		...buildEnv,
		PUBLIC_SITE_URL: import.meta.env.PUBLIC_SITE_URL ?? buildEnv?.PUBLIC_SITE_URL,
	}),
	whatsapp: import.meta.env.PUBLIC_WHATSAPP_NUMBER ?? '573001234567',
	email: import.meta.env.PUBLIC_CONTACT_EMAIL ?? 'hola@antioquiasilvestre.co',
	phoneDisplay: '+57 300 123 4567',
	rnt: 'RNT 00000-2026',
	location: 'Medellín, Antioquia',
	region: 'Antioquia, Colombia',
	schedule: 'Lunes a sábado · 8:00 a 18:00',
	demoNotice:
		'Sitio de demostración con fines educativos. Los datos de contacto, precios y RNT son ficticios.',
	nav: [
		{ label: 'Inicio', href: '/' },
		{ label: 'Destinos', href: '/destinos' },
		{ label: 'Rutas', href: '/rutas' },
		{ label: 'Galería', href: '/galeria' },
		{ label: 'Contacto', href: '/contacto' },
	],
	stats: [
		{ value: '7', label: 'destinos curados' },
		{ value: '4', label: 'formas de viajar' },
		{ value: '100%', label: 'guías locales' },
	],
} as const;

export const categories = [
	{
		slug: 'senderismo',
		label: 'Senderismo',
		short: 'Caminar',
		description: 'Caminos de montaña, bosques y páramos para medir el día en pasos.',
		icon: 'mountain',
		color: 'hike',
	},
	{
		slug: 'cascadas',
		label: 'Cascadas',
		short: 'Agua',
		description: 'Caídas de agua, quebradas y pozos naturales entre vegetación espesa.',
		icon: 'droplet',
		color: 'water',
	},
	{
		slug: 'aves',
		label: 'Avistamiento de aves',
		short: 'Aves',
		description: 'Bosques andinos y cafeteros donde el canto madruga más que tú.',
		icon: 'bird',
		color: 'bird',
	},
	{
		slug: 'cultura',
		label: 'Cultura',
		short: 'Cultura',
		description: 'Pueblos de tapia, café, memoria campesina y patrimonio vivo.',
		icon: 'landmark',
		color: 'culture',
	},
] as const;

export type CategorySlug = (typeof categories)[number]['slug'];

export const categoryBySlug = (slug: string) => categories.find((category) => category.slug === slug);
