const FILTERS = ['todos', 'senderismo', 'cascadas', 'aves', 'cultura'] as const;
type Filter = (typeof FILTERS)[number];

const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-destino-filter]'));
const items = Array.from(document.querySelectorAll<HTMLElement>('[data-destination]'));
const count = document.querySelector<HTMLElement>('[data-results-count]');
const label = document.querySelector<HTMLElement>('[data-results-label]');
const empty = document.querySelector<HTMLElement>('[data-empty-state]');

const params = new URLSearchParams(window.location.search);
const fromUrl = params.get('categoria') ?? '';
const initial: Filter = (FILTERS as readonly string[]).includes(fromUrl) ? (fromUrl as Filter) : 'todos';

function apply(filter: Filter, syncUrl: boolean) {
	let visible = 0;

	for (const item of items) {
		const categories = (item.dataset.categories ?? '').split(' ');
		const show = filter === 'todos' || categories.includes(filter);
		item.hidden = !show;
		if (show) visible += 1;
	}

	for (const button of buttons) {
		button.setAttribute(
			'aria-pressed',
			String(button.dataset.destinoFilter === filter),
		);
	}

	if (count) count.textContent = String(visible);

	if (label) {
		label.textContent = visible === 1 ? 'destino disponible' : 'destinos disponibles';
	}

	if (empty) empty.hidden = visible !== 0;

	if (!syncUrl) return;

	const url = new URL(window.location.href);
	if (filter === 'todos') {
		url.searchParams.delete('categoria');
	} else {
		url.searchParams.set('categoria', filter);
	}
	history.replaceState(null, '', url);
}

for (const button of buttons) {
	button.addEventListener('click', () => {
		apply(button.dataset.destinoFilter as Filter, true);
	});
}

apply(initial, false);
