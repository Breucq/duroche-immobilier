import { client } from './sanityClient';
import type { Review } from '../types';

export const reviewService = {
  async getAll(): Promise<Review[]> {
    const query = `*[_type == "review"] | order(date desc, _createdAt desc)`;
    return await client.fetch(query);
  }
};
