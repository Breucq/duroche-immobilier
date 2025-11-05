import { client } from './sanityClient';
import type { Article } from '../types';

const articleFields = `
  _id,
  title,
  slug,
  author,
  date,
  "image": image.asset->,
  summary,
  content
`;

export const articleService = {
  async getAll(): Promise<Article[]> {
    const query = `*[_type == "article"] | order(date desc) { ${articleFields} }`;
    return client.fetch(query);
  },

  async getBySlug(slug: string): Promise<Article | null> {
    const query = `*[_type == "article" && slug.current == $slug][0] { ${articleFields} }`;
    return client.fetch(query, { slug });
  },
};