import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const categorySlug = z.enum(['senderismo', 'cascadas', 'aves', 'cultura']);
const difficulty = z.enum(['facil', 'moderada', 'exigente']);

const destinos = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/destinos' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			municipality: z.string(),
			region: z.string(),
			summary: z.string(),
			categories: z.array(categorySlug).min(1),
			difficulty,
			durationDays: z.number().int().min(1).max(7),
			hikeDistanceKm: z.number().positive().optional(),
			elevationGainM: z.number().int().nonnegative().optional(),
			altitudeMasl: z.number().int().nonnegative().optional(),
			bestMonths: z.array(z.number().int().min(1).max(12)).min(1),
			coordinates: z.object({ lat: z.number(), lng: z.number() }),
			heroImage: image(),
			heroAlt: z.string(),
			gallery: z
				.array(
					z.object({
						src: image(),
						alt: z.string(),
						caption: z.string().optional(),
					}),
				)
				.default([]),
			highlights: z.array(z.string()).min(3),
			tips: z.array(z.string()).min(3),
			accessibilityNotes: z.string(),
			featured: z.boolean().default(false),
			order: z.number().int(),
			updatedAt: z.coerce.date(),
		}),
});

const rutas = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/rutas' }),
	schema: z.object({
		title: z.string(),
		destination: z.string(),
		difficulty,
		durationDays: z.number().int().min(1).max(7),
		distanceKm: z.number().positive(),
		elevationGainM: z.number().int().nonnegative().optional(),
		season: z.string(),
		startPoint: z.string(),
		coordinates: z.object({ lat: z.number(), lng: z.number() }),
		itinerary: z
			.array(
				z.object({
					day: z.number().int().min(1),
					title: z.string(),
					description: z.string(),
					activities: z.array(z.string()).min(1),
				}),
			)
			.min(1),
		recommendations: z.array(z.string()).min(2),
		updatedAt: z.coerce.date(),
	}),
});

const galeria = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/galeria' }),
	schema: ({ image }) =>
		z.object({
			src: image(),
			alt: z.string(),
			caption: z.string().optional(),
			location: z.string(),
			destination: z.string().optional(),
			category: z.enum(['paisaje', 'fauna', 'cultura', 'agua']),
			featured: z.boolean().default(false),
			credit: z.object({
				author: z.string(),
				source: z.string(),
				license: z.string(),
				url: z.string().optional(),
			}),
		}),
});

export const collections = { destinos, rutas, galeria };
