const FILTERS = ['todas', 'paisaje', 'fauna', 'cultura', 'agua'] as const;
type Filter = (typeof FILTERS)[number];

const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-galeria-filter]'));
const items = Array.from(document.querySelectorAll<HTMLElement>('[data-photo]'));
const count = document.querySelector<HTMLElement>('[data-galeria-count]');
const label = document.querySelector<HTMLElement>('[data-galeria-label]');
const empty = document.querySelector<HTMLElement>('[data-galeria-empty]');

const params = new URLSearchParams(window.location.search);
const fromUrl = params.get('categoria') ?? '';
const initial: Filter = (FILTERS as readonly string[]).includes(fromUrl) ? (fromUrl as Filter) : 'todas';

function apply(filter: Filter, syncUrl: boolean) {
	let visible = 0;

	for (const item of items) {
		const show = filter === 'todas' || item.dataset.category === filter;
		item.hidden = !show;
		if (show) visible += 1;
	}

	for (const button of buttons) {
		button.setAttribute('aria-pressed', String(button.dataset.galeriaFilter === filter));
	}

	if (count) count.textContent = String(visible);
	if (label) label.textContent = visible === 1 ? 'fotografía' : 'fotografías';
	if (empty) empty.hidden = visible !== 0;

	if (!syncUrl) return;

	const url = new URL(window.location.href);
	if (filter === 'todas') {
		url.searchParams.delete('categoria');
	} else {
		url.searchParams.set('categoria', filter);
	}
	history.replaceState(null, '', url);
}

for (const button of buttons) {
	button.addEventListener('click', () => {
		apply(button.dataset.galeriaFilter as Filter, true);
	});
}

apply(initial, false);
