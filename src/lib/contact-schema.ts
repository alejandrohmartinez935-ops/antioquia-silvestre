import { z } from 'zod';

/**
 * Esquema compartido por el endpoint `/api/contacto`.
 * El cliente replica estas reglas en `src/scripts/contact-form.ts`
 * para dar retroalimentación inmediata sin esperar al servidor.
 */
export const contactSchema = z.object({
	nombre: z
		.string()
		.trim()
		.min(2, 'Escribe tu nombre completo.')
		.max(80, 'El nombre es demasiado largo.'),
	email: z
		.string()
		.trim()
		.regex(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, 'Revisa el correo electrónico.'),
	telefono: z
		.string()
		.trim()
		.max(30, 'El teléfono es demasiado largo.')
		.optional()
		.or(z.literal('')),
	destino: z.string().trim().max(80).optional().or(z.literal('')),
	personas: z.coerce
		.number()
		.refine(Number.isInteger, 'Indica un número entero.')
		.min(1, 'Debe ser al menos 1 persona.')
		.max(20, 'Para grupos mayores, escríbenos por WhatsApp.'),
	fechas: z.string().trim().max(120).optional().or(z.literal('')),
	mensaje: z
		.string()
		.trim()
		.min(15, 'Cuéntanos un poco más (mínimo 15 caracteres).')
		.max(1500, 'El mensaje es demasiado largo.'),
	consent: z
		.string()
		.refine((value) => value === 'on', 'Debes aceptar el tratamiento de datos.'),
	website: z.string().max(0, 'Solicitud inválida.').optional().or(z.literal('')),
	ts: z.string().optional(),
});

export type ContactPayload = z.infer<typeof contactSchema>;

/** Convierte los issues de Zod en un mapa `campo → primer mensaje`. */
export function fieldErrors(
	issues: Array<{ path: PropertyKey[]; message: string }>,
): Record<string, string> {
	const errors: Record<string, string> = {};

	for (const issue of issues) {
		const field = String(issue.path[0] ?? 'form');
		if (!errors[field]) errors[field] = issue.message;
	}

	return errors;
}
