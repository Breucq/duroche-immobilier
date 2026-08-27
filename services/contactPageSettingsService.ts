import { client } from './sanityClient';
import type { ContactPageSettings } from '../types';

const CONTACT_PAGE_DOCUMENT_ID = 'contactPageSettings';

export const contactPageSettingsService = {
  async getSettings(): Promise<ContactPageSettings | null> {
    try {
      const query = `*[_type == "contactPageSettings" && _id == "${CONTACT_PAGE_DOCUMENT_ID}"][0]`;
      const settings = await client.fetch(query);
      if (!settings) {
        // Essayer aussi de trouver le premier document du type s'il n'a pas cet ID exact
        const fallbackQuery = `*[_type == "contactPageSettings"][0]`;
        return await client.fetch(fallbackQuery);
      }
      return settings;
    } catch (error) {
      console.error('Erreur lors de la récupération des paramètres de la page contact:', error);
      return null;
    }
  },
};
