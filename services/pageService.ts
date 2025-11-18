import { client, urlFor } from './sanityClient';
import type { Page } from '../types';

const pageFields = `
  _id,
  title,
  subtitle,
  "coverImage": coverImage.asset->,
  slug,
  content,
  metaTitle,
  metaDescription,
  metaKeywords,
  showInHeader,
  showInFooter
`;

export const pageService = {
  async getAll(): Promise<Page[]> {
    const query = `*[_type == "page"] | order(title asc) { ${pageFields} }`;
    return client.fetch(query);
  },

  async getBySlug(slug: string): Promise<Page | null> {
    const query = `*[_type == "page" && slug.current == $slug][0] { ${pageFields} }`;
    const page = await client.fetch(query, { slug });
    
    if (page && page.coverImage) {
        // Ensure we pass a valid image object or URL string structure if expected by types
        // But usually for pages we might want to process the URL right here if GenericPage expects a string
        // However, GenericPage might use urlFor. Let's check types. 
        // The interface says SanityImage. So we keep the object structure.
    }
    
    return page;
  },
};