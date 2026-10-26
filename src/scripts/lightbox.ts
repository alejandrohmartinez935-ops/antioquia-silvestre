interface GalleryItem {
	src: string;
	alt: string;
	caption?: string;
	location: string;
	credit?: { author: string; license: string; url?: string };
}

const dialog = document.querySelector<HTMLDialogElement>('#lightbox');
const dataNode = document.querySelector<HTMLScriptElement>('#gallery-data');

if (dialog && dataNode) {
	const items: GalleryItem[] = JSON.parse(dataNode.textContent ?? '[]');

	const image = dialog.querySelector<HTMLImageElement>('[data-lightbox-image]');
	const location = dialog.querySelector<HTMLElement>('[data-lightbox-location]');
	const caption = dialog.querySelector<HTMLElement>('[data-lightbox-caption]');
	const credit = dialog.querySelector<HTMLElement>('[data-lightbox-credit]');
	const counter = dialog.querySelector<HTMLElement>('[data-lightbox-counter]');
	const closeButton = dialog.querySelector<HTMLButtonElement>('[data-lightbox-close]');

	let current = 0;
	let trigger: HTMLElement | null = null;

	function render(index: number) {
		if (items.length === 0) return;
		current = (index + items.length) % items.length;
		const item = items[current];

		if (image) {
			image.src = item.src;
			image.alt = item.alt;
		}
		if (location) location.textContent = item.location;
		if (caption) caption.textContent = item.caption ?? '';
		if (credit) {
			credit.textContent = item.credit
				? `Foto: ${item.credit.author} · ${item.credit.license} · Wikimedia Commons`
				: '';
		}
		if (counter) {
			counter.textContent = `${current + 1} / ${items.length}`;
		}
	}

	function open(index: number, opener: HTMLElement) {
		trigger = opener;
		render(index);
		dialog?.showModal();
		document.documentElement.classList.add('overflow-hidden');
		closeButton?.focus();
	}

	function close() {
		dialog?.close();
	}

	function step(delta: number) {
		render(current + delta);
	}

	document.querySelectorAll<HTMLElement>('[data-lightbox-open]').forEach((button) => {
		button.addEventListener('click', () => {
			open(Number(button.dataset.index ?? 0), button);
		});
	});

	dialog.querySelector('[data-lightbox-prev]')?.addEventListener('click', () => step(-1));
	dialog.querySelector('[data-lightbox-next]')?.addEventListener('click', () => step(1));
	closeButton?.addEventListener('click', close);

	dialog.addEventListener('keydown', (event) => {
		if (event.key === 'ArrowLeft') {
			event.preventDefault();
			step(-1);
		}
		if (event.key === 'ArrowRight') {
			event.preventDefault();
			step(1);
		}
	});

	dialog.addEventListener('click', (event) => {
		if (event.target === dialog) close();
	});

	dialog.addEventListener('close', () => {
		document.documentElement.classList.remove('overflow-hidden');
		trigger?.focus();
	});
}
