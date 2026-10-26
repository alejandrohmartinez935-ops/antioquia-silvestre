interface ContactResponse {
	ok?: boolean;
	message?: string;
	errors?: Record<string, string>;
	fallback?: boolean;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^[+()\d\s.-]{7,30}$/;

const form = document.querySelector<HTMLFormElement>('[data-contact-form]');

if (form) {
	const status = form.querySelector<HTMLElement>('[data-form-status]');
	const submit = form.querySelector<HTMLButtonElement>('[data-form-submit]');
	const submitLabel = form.querySelector<HTMLElement>('[data-submit-label]');
	const timestamp = form.querySelector<HTMLInputElement>('[data-form-ts]');
	const success = document.querySelector<HTMLElement>('[data-form-success]');
	const successTitle = document.querySelector<HTMLElement>('[data-success-title]');

	/*
	 * Reutilizamos el enlace de WhatsApp que ya viene renderizado en el HTML
	 * para no duplicar el número ni el mensaje en el cliente.
	 */
	const whatsappHref =
		success?.querySelector<HTMLAnchorElement>('a[href^="https://wa.me"]')?.href ??
		document.querySelector<HTMLAnchorElement>('a[href^="https://wa.me"]')?.href ??
		'';

	if (timestamp) timestamp.value = String(Date.now());

	/*
	 * La página es estática: el destino de interés se preselecciona en el
	 * cliente a partir de `?destino=`, que llega desde la ficha del destino.
	 */
	const destinoParam = new URLSearchParams(window.location.search).get('destino');
	const destinoSelect = form.elements.namedItem('destino');
	if (
		destinoParam &&
		destinoSelect instanceof HTMLSelectElement &&
		[...destinoSelect.options].some((option) => option.value === destinoParam)
	) {
		destinoSelect.value = destinoParam;
	}

	function field(name: string): HTMLInputElement | HTMLTextAreaElement | null {
		const element = form?.elements.namedItem(name);
		return element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement
			? element
			: null;
	}

	function setError(name: string, message: string | null) {
		const slot = form?.querySelector<HTMLElement>(`[data-error-for="${name}"]`);
		const control = field(name);

		if (slot) {
			slot.textContent = message ?? '';
			slot.hidden = !message;
		}

		if (control) {
			if (message) {
				control.setAttribute('aria-invalid', 'true');
			} else {
				control.removeAttribute('aria-invalid');
			}
		}
	}

	function validate(): boolean {
		const nombre = field('nombre')?.value ?? '';
		const email = field('email')?.value ?? '';
		const telefono = field('telefono')?.value ?? '';
		const personas = Number(field('personas')?.value ?? '');
		const mensaje = field('mensaje')?.value ?? '';
		const consent = field('consent');

		const errors: Array<[string, string | null]> = [
			[
				'nombre',
				nombre.trim().length < 2
					? 'Escribe tu nombre (mínimo 2 caracteres).'
					: nombre.trim().length > 80
						? 'El nombre es demasiado largo.'
						: null,
			],
			['email', EMAIL.test(email.trim()) ? null : 'Revisa el correo electrónico.'],
			[
				'telefono',
				telefono.trim() === '' || PHONE.test(telefono.trim())
					? null
					: 'Revisa el número de teléfono.',
			],
			[
				'personas',
				Number.isInteger(personas) && personas >= 1 && personas <= 20
					? null
					: 'Indica un número entre 1 y 20.',
			],
			[
				'mensaje',
				mensaje.trim().length < 15
					? 'Cuéntanos un poco más (mínimo 15 caracteres).'
					: mensaje.trim().length > 1500
						? 'El mensaje es demasiado largo.'
						: null,
			],
			[
				'consent',
				consent instanceof HTMLInputElement && consent.checked
					? null
					: 'Debes aceptar el tratamiento de datos.',
			],
		];

		let firstInvalid: HTMLElement | null = null;

		for (const [name, message] of errors) {
			setError(name, message);
			if (message && !firstInvalid) firstInvalid = field(name);
		}

		if (firstInvalid) {
			firstInvalid.focus();
			firstInvalid.scrollIntoView({ block: 'center', behavior: 'smooth' });
			return false;
		}

		return true;
	}

	function showStatus(message: string, tone: 'error' | 'info') {
		if (!status) return;

		status.hidden = false;
		status.textContent = message;
		status.className =
			tone === 'error'
				? 'mt-4 rounded-field border border-error/40 bg-error/5 px-4 py-3 text-small text-error'
				: 'mt-4 rounded-field border border-brand/30 bg-brand/5 px-4 py-3 text-small text-brand';
	}

	function showFallback(message: string) {
		if (!status) return;

		status.hidden = false;
		status.className =
			'mt-4 rounded-field border border-ochre/40 bg-bird-soft/50 px-4 py-3 text-small text-ink';

		const text = document.createElement('span');
		text.textContent = `${message} `;

		const link = document.createElement('a');
		link.href = whatsappHref;
		link.target = '_blank';
		link.rel = 'noopener noreferrer';
		link.className = 'font-semibold text-brand underline';
		link.textContent = 'Abrir WhatsApp';

		status.replaceChildren(text, link);
	}

	function setLoading(loading: boolean) {
		if (submit) submit.disabled = loading;
		if (submitLabel) submitLabel.textContent = loading ? 'Enviando…' : 'Enviar consulta';
		form?.setAttribute('aria-busy', String(loading));
	}

	function showSuccess(message?: string) {
		form?.setAttribute('hidden', '');
		if (success) {
			success.hidden = false;
			if (message && successTitle) successTitle.textContent = message;
			success.scrollIntoView({ block: 'center', behavior: 'smooth' });
			successTitle?.focus({ preventScroll: true });
		}
	}

	form.addEventListener('submit', async (event) => {
		event.preventDefault();

		if (!validate()) {
			showStatus('Revisa los campos marcados antes de enviar.', 'error');
			return;
		}

		if (status) status.hidden = true;
		setLoading(true);

		const payload = Object.fromEntries(new FormData(form).entries());

		try {
			const response = await fetch(form.action, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
				body: JSON.stringify(payload),
			});

			let data: ContactResponse = {};
			try {
				data = (await response.json()) as ContactResponse;
			} catch {
				data = {};
			}

			if (response.ok && data.ok) {
				showSuccess(data.message);
				return;
			}

			if (data.errors) {
				for (const [name, message] of Object.entries(data.errors)) {
					setError(name, message);
				}
				const first = Object.keys(data.errors)[0];
				if (first) field(first)?.focus();
			}

			if (data.fallback) {
				showFallback(
					data.message ?? 'El envío por correo no está disponible. Escríbenos por WhatsApp.',
				);
				return;
			}

			showStatus(
				data.message ?? 'No pudimos enviar el mensaje. Inténtalo de nuevo en un momento.',
				'error',
			);
		} catch {
			showFallback(
				'No pudimos conectar con el servidor. Escríbenos por WhatsApp y te respondemos igual.',
			);
		} finally {
			setLoading(false);
		}
	});

	form.addEventListener('input', (event) => {
		const target = event.target;
		if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) return;
		if (target.getAttribute('aria-invalid') !== 'true') return;
		setError(target.name, null);
	});
}
