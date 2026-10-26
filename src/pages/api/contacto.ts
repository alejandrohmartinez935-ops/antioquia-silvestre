import type { APIRoute } from 'astro';
import { contactSchema, fieldErrors, type ContactPayload } from '../../lib/contact-schema';

export const prerender = false;

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(key: string): boolean {
	const now = Date.now();
	const entry = hits.get(key);

	if (!entry || entry.resetAt < now) {
		hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
		return false;
	}

	entry.count += 1;
	return entry.count > MAX_REQUESTS;
}

function json(body: unknown, status = 200): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json; charset=utf-8' },
	});
}

async function readPayload(request: Request): Promise<Record<string, unknown>> {
	const type = request.headers.get('content-type') ?? '';

	if (type.includes('application/json')) {
		try {
			return (await request.json()) as Record<string, unknown>;
		} catch {
			return {};
		}
	}

	const form = await request.formData();
	return Object.fromEntries(form.entries());
}

async function sendWithResend(data: ContactPayload): Promise<boolean> {
	const apiKey = import.meta.env.RESEND_API_KEY;
	const to = import.meta.env.CONTACT_TO_EMAIL;
	const from = import.meta.env.CONTACT_FROM_EMAIL ?? 'Antioquia Silvestre <onboarding@resend.dev>';

	if (!apiKey || !to) return false;

	const lines = [
		`Nombre: ${data.nombre}`,
		`Correo: ${data.email}`,
		`Teléfono: ${data.telefono || 'No indicado'}`,
		`Destino de interés: ${data.destino || 'Por definir'}`,
		`Personas: ${data.personas}`,
		`Fechas: ${data.fechas || 'Por definir'}`,
		'',
		data.mensaje,
	];

	const response = await fetch('https://api.resend.com/emails', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${apiKey}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			from,
			to: [to],
			subject: `Nueva consulta de ${data.nombre} · Antioquia Silvestre`,
			text: lines.join('\n'),
			reply_to: data.email,
		}),
	});

	if (!response.ok) {
		console.error('Resend error', response.status, await response.text());
		return false;
	}

	return true;
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
	let payload: Record<string, unknown>;

	try {
		payload = await readPayload(request);
	} catch {
		return json({ ok: false, message: 'No pudimos leer la solicitud.' }, 400);
	}

	const ip = clientAddress ?? request.headers.get('x-forwarded-for') ?? 'desconocida';
	if (rateLimited(ip)) {
		return json(
			{ ok: false, message: 'Demasiados intentos. Espera unos minutos o escríbenos por WhatsApp.' },
			429,
		);
	}

	const honeypot = String(payload.website ?? '');
	if (honeypot.length > 0) {
		return json({ ok: true, message: 'Solicitud recibida.' });
	}

	const created = Number(payload.ts ?? 0);
	if (created > 0 && Date.now() - created < 2500) {
		return json(
			{ ok: false, message: 'La solicitud se envió demasiado rápido. Inténtalo de nuevo.' },
			400,
		);
	}

	const parsed = contactSchema.safeParse(payload);

	if (!parsed.success) {
		return json(
			{
				ok: false,
				message: 'Revisa los campos marcados.',
				errors: fieldErrors(parsed.error.issues),
			},
			422,
		);
	}

	const delivered = await sendWithResend(parsed.data).catch((error) => {
		console.error('Error enviando el correo', error);
		return false;
	});

	if (!delivered) {
		return json(
			{
				ok: false,
				fallback: true,
				message:
					'El envío por correo no está disponible en este momento. Escríbenos por WhatsApp y te respondemos igual.',
			},
			503,
		);
	}

	return json({ ok: true, message: 'Mensaje enviado. Te responderemos pronto.' });
};

export const GET: APIRoute = () =>
	json({ ok: false, message: 'Método no permitido.' }, 405);
