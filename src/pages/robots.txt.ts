import type { APIRoute } from 'astro';
import { FALLBACK_SITE_URL } from '../lib/site-url.mjs';

/**
 * `robots.txt` generado en build para que el sitemap apunte siempre al dominio
 * real del despliegue (Vercel o dominio propio) y no a un dominio de ejemplo.
 */
export const GET: APIRoute = ({ site }) => {
	const base = site ?? new URL(FALLBACK_SITE_URL);
	const sitemap = new URL('sitemap-index.xml', base).href;
	const body = [
		'User-agent: *',
		'Allow: /',
		'Disallow: /gracias',
		'',
		`Sitemap: ${sitemap}`,
		'',
	].join('\n');

	return new Response(body, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
};
