import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
const dataset = import.meta.env.VITE_SANITY_DATASET;

if (!projectId || !dataset) {
  throw new Error(
    'Sanity projectId or dataset not found. Make sure you have created a .env.local file with VITE_SANITY_PROJECT_ID and VITE_SANITY_DATASET variables.'
  );
}

export const client = createClient({
  projectId,
  dataset,
  useCdn: true, // `false` si vous voulez toujours les données les plus fraîches
  apiVersion: '2023-05-03',
});

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}