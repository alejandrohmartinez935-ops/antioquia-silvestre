import { getCollection, type CollectionEntry } from 'astro:content';

export type Destino = CollectionEntry<'destinos'>;
export type Ruta = CollectionEntry<'rutas'>;
export type Foto = CollectionEntry<'galeria'>;

export async function getDestinos(): Promise<Destino[]> {
	const items = await getCollection('destinos');
	return items.sort((a, b) => a.data.order - b.data.order);
}

export async function getDestino(id: string): Promise<Destino | undefined> {
	const items = await getCollection('destinos');
	return items.find((item) => item.id === id);
}

export async function getRutas(): Promise<Ruta[]> {
	const destinos = await getDestinos();
	const order = new Map(destinos.map((destino, index) => [destino.id, index]));
	const items = await getCollection('rutas');
	return items.sort(
		(a, b) => (order.get(a.data.destination) ?? 99) - (order.get(b.data.destination) ?? 99),
	);
}

export async function getGaleria(): Promise<Foto[]> {
	return getCollection('galeria');
}

export const difficultyMeta = {
	facil: {
		label: 'Fácil',
		description: 'Caminos cortos y poco desnivel',
		style: 'bg-hike-soft text-hike',
		dot: 'bg-hike',
	},
	moderada: {
		label: 'Moderada',
		description: 'Caminatas de 2 a 4 horas',
		style: 'bg-bird-soft text-bird',
		dot: 'bg-bird',
	},
	exigente: {
		label: 'Exigente',
		description: 'Jornadas largas y terreno irregular',
		style: 'bg-accent-soft text-accent',
		dot: 'bg-accent',
	},
} as const;

const monthShort = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

export function formatMonths(months: number[]): string {
	return months.map((month) => monthShort[month - 1]).join(' · ');
}

export function pluralize(count: number, singular: string, plural: string): string {
	return count === 1 ? singular : plural;
}

export async function getCategoriaCounts(): Promise<Record<string, number>> {
	const destinos = await getDestinos();
	const counts: Record<string, number> = {
		senderismo: 0,
		cascadas: 0,
		aves: 0,
		cultura: 0,
	};

	for (const destino of destinos) {
		for (const categoria of destino.data.categories) {
			counts[categoria] = (counts[categoria] ?? 0) + 1;
		}
	}

	return counts;
}
