
import { client, urlFor } from './sanityClient';
import type { SiteSettings, SanityImage } from '../types';

// The ID of the singleton document for site settings in Sanity
const SETTINGS_DOCUMENT_ID = 'siteSettings';

export const settingsService = {
  async getSettings(): Promise<SiteSettings> {
    const query = `*[_type == "siteSettings" && _id == "${SETTINGS_DOCUMENT_ID}"][0]`;
    const settings = await client.fetch(query);

    // FIX PageSpeed: 220px est la taille exacte de l'affichage header. Qualité 50.
    return {
      ...settings,
      logo: settings.logo ? urlFor(settings.logo).width(220).quality(50).auto('format').url() : '',
      footerLogo: settings.footerLogo ? urlFor(settings.footerLogo).width(220).quality(50).auto('format').url() : '',
      favicon: settings.favicon ? urlFor(settings.favicon).width(128).url() : '',
    };
  },
};