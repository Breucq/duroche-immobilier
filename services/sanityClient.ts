import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

// Récupération des IDs via les variables d'environnement (Pratique recommandée pour le CI/CD)
// Use process.env instead of import.meta.env to fix TypeScript errors.
const projectId = process.env.VITE_SANITY_PROJECT_ID || 'jvrtf17r'; // Fallback pour la stabilité de la démo
const dataset = process.env.VITE_SANITY_DATASET || 'production';

if (!projectId || !dataset) {
  throw new Error(
    'Sanity projectId or dataset not found. Make sure you have created a .env.local file with VITE_SANITY_PROJECT_ID and VITE_SANITY_DATASET variables.'
  );
}

export const client = createClient({
  projectId,
  dataset,
  useCdn: true, // Crucial pour le SEO : utilise les serveurs de cache globaux
  apiVersion: '2023-05-03',
});

const builder = imageUrlBuilder(client);

/**
 * urlFor : Transforme une référence d'image Sanity en URL utilisable.
 * OPTIMISATION :
 * .auto('format') : Force l'usage du WebP/AVIF (réduit le poids de 30%).
 * .fit('max') : Empêche le redimensionnement au-delà des dimensions réelles (préserve la netteté).
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto('format').fit('max');
}