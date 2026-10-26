const header = document.querySelector<HTMLElement>('[data-site-header]');
const dialog = document.querySelector<HTMLDialogElement>('#mobile-menu');
const openButton = document.querySelector<HTMLButtonElement>('[data-menu-open]');
const closeButton = document.querySelector<HTMLButtonElement>('[data-menu-close]');

function syncScrollState() {
	header?.toggleAttribute('data-scrolled', window.scrollY > 8);
}

function openMenu() {
	if (!dialog || !openButton) return;
	dialog.showModal();
	openButton.setAttribute('aria-expanded', 'true');
}

function closeMenu() {
	if (!dialog || !openButton) return;
	dialog.close();
}

openButton?.addEventListener('click', openMenu);
closeButton?.addEventListener('click', closeMenu);

dialog?.querySelectorAll('a').forEach((link) => {
	link.addEventListener('click', closeMenu);
});

dialog?.addEventListener('close', () => {
	openButton?.setAttribute('aria-expanded', 'false');
	openButton?.focus();
});

dialog?.addEventListener('click', (event) => {
	if (event.target === dialog) closeMenu();
});

syncScrollState();
window.addEventListener('scroll', syncScrollState, { passive: true });
