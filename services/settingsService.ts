import { client, urlFor } from './sanityClient';
import type { SiteSettings, SanityImage } from '../types';

// The ID of the singleton document for site settings in Sanity
const SETTINGS_DOCUMENT_ID = 'siteSettings';

export const settingsService = {
  async getSettings(): Promise<SiteSettings> {
    const query = `*[_type == "siteSettings" && _id == "${SETTINGS_DOCUMENT_ID}"][0]`;
    const settings = await client.fetch(query);

    // OPTIMISATION : Qualité 90 pour le logo (petit fichier mais impact visuel fort)
    return {
      ...settings,
      logo: settings.logo ? urlFor(settings.logo).width(250).quality(90).auto('format').url() : '',
      footerLogo: settings.footerLogo ? urlFor(settings.footerLogo).width(250).quality(90).auto('format').url() : '',
      favicon: settings.favicon ? urlFor(settings.favicon).width(128).url() : '',
    };
  },
};