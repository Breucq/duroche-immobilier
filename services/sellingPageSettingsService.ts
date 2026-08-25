import { client } from './sanityClient';
import type { SellingPageSettings } from '../types';

export const sellingPageSettingsService = {
  async getSettings(): Promise<SellingPageSettings | null> {
    const query = `*[_type == "sellingPageSettings" || _type == "sellingPage"] | order(_updatedAt desc)[0]`;
    return await client.fetch(query);
  },
};
