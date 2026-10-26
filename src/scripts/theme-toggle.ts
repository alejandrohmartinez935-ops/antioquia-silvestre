const STORAGE_KEY = 'as-theme';

const root = document.documentElement;
const media = window.matchMedia('(prefers-color-scheme: dark)');
const buttons = document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]');

function readStored(): 'light' | 'dark' | null {
	try {
		const value = localStorage.getItem(STORAGE_KEY);
		return value === 'light' || value === 'dark' ? value : null;
	} catch {
		return null;
	}
}

function sync(theme: string) {
	const isDark = theme === 'dark';

	buttons.forEach((button) => {
		button.setAttribute('aria-pressed', String(isDark));
		button.setAttribute('aria-label', isDark ? 'Activar modo claro' : 'Activar modo oscuro');
		button.setAttribute('title', isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
	});

	const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
	if (meta) meta.content = isDark ? '#0B1411' : '#F7F5EE';
}

function apply(theme: 'light' | 'dark', persist: boolean) {
	root.dataset.theme = theme;
	sync(theme);

	if (persist) {
		try {
			localStorage.setItem(STORAGE_KEY, theme);
		} catch {
			// Sin persistencia: el sitio sigue funcionando con la preferencia del sistema.
		}
	}
}

sync(root.dataset.theme ?? 'light');

buttons.forEach((button) => {
	button.addEventListener('click', () => {
		const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
		apply(next, true);
	});
});

media.addEventListener('change', (event) => {
	if (readStored()) return;
	apply(event.matches ? 'dark' : 'light', false);
});
