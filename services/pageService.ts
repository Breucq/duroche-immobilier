import { client } from './sanityClient';
import type { Page } from '../types';

const pageFields = `
  _id,
  title,
  "slug": slug.current,
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
    return client.fetch(query, { slug });
  },
};
