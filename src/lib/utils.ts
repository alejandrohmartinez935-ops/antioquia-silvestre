export function cn(...classes: Array<string | false | null | undefined>): string {
	return classes.filter(Boolean).join(' ');
}

export function whatsappLink(message: string, number: string): string {
	return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function formatDate(date: Date): string {
	return new Intl.DateTimeFormat('es-CO', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		timeZone: 'UTC',
	}).format(date);
}

export function readingTime(text: string): number {
	const words = text.trim().split(/\s+/).length;
	return Math.max(1, Math.round(words / 200));
}
