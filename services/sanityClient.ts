
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

/**
 * Récupération sécurisée des variables d'environnement.
 */
const projectId = (typeof process !== 'undefined' && process.env?.VITE_SANITY_PROJECT_ID) || 'jvrtf17r';
const dataset = (typeof process !== 'undefined' && process.env?.VITE_SANITY_DATASET) || 'production';

if (!projectId || !dataset) {
  throw new Error(
    'Sanity projectId or dataset not found. Check your environment configuration.'
  );
}

export const client = createClient({
  projectId,
  dataset,
  useCdn: true,
  apiVersion: '2023-05-03',
});

const builder = imageUrlBuilder(client);

/**
 * urlFor : Génère des URLs d'images optimisées.
 * .auto('format') : Conversion automatique en WebP (crucial pour le SEO).
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto('format').fit('max');
}