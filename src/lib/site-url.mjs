/**
 * Dominio de ejemplo del proyecto, usado solo cuando no hay ninguna URL
 * configurada (desarrollo local sin `.env`).
 */
export const FALLBACK_SITE_URL = 'https://antioquiasilvestre.co';

/**
 * Normaliza un dominio o URL: agrega `https://` si falta y quita la barra final.
 * @param {string} value
 * @returns {string}
 */
function normalize(value) {
	const trimmed = value.trim().replace(/\/+$/, '');
	return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

/**
 * Resuelve la URL canónica del sitio en este orden:
 * 1. `PUBLIC_SITE_URL` (dominio propio o entorno local).
 * 2. `VERCEL_PROJECT_PRODUCTION_URL` (dominio de producción del proyecto en Vercel).
 * 3. `VERCEL_URL` (URL del despliegue actual, útil en previews).
 * 4. Dominio de ejemplo del proyecto.
 *
 * @param {Record<string, string | undefined>} [env]
 * @returns {string}
 */
export function resolveSiteUrl(env = {}) {
	const explicit = env.PUBLIC_SITE_URL?.trim();
	if (explicit) return normalize(explicit);

	const vercel =
		env.VERCEL_PROJECT_PRODUCTION_URL?.trim() || env.VERCEL_URL?.trim();
	if (vercel) return normalize(vercel);

	return FALLBACK_SITE_URL;
}
