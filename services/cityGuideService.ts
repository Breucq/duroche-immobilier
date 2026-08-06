import { client } from './sanityClient';
import type { CityGuide } from '../types';

const cityGuideFields = `
  _id,
  cityName,
  slug,
  postalCode,
  metaTitle,
  metaDescription,
  title,
  subtitle,
  coverImage,
  intro,
  content,
  keyPoints,
  faqs
`;

export const cityGuideService = {
  async getByCityName(cityName: string): Promise<CityGuide | null> {
    if (!cityName) return null;
    const cleanName = cityName.trim();
    // Query exact or case-insensitive match on cityName or slug
    const query = `*[_type == "cityGuide" && (
      lower(cityName) == lower($cleanName) ||
      lower(slug.current) == lower($cleanName)
    )][0] { ${cityGuideFields} }`;
    
    return client.fetch(query, { cleanName });
  },

  async getAll(): Promise<CityGuide[]> {
    const query = `*[_type == "cityGuide"] | order(cityName asc) { ${cityGuideFields} }`;
    return client.fetch(query);
  }
};
