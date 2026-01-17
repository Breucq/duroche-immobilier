import { client, urlFor } from './sanityClient';
import type { SiteSettings, SanityImage } from '../types';

// The ID of the singleton document for site settings in Sanity
const SETTINGS_DOCUMENT_ID = 'siteSettings';

export const settingsService = {
  async getSettings(): Promise<SiteSettings> {
    const query = `*[_type == "siteSettings" && _id == "${SETTINGS_DOCUMENT_ID}"][0]`;
    const settings = await client.fetch(query);

    // FIX PageSpeed: On demande du 400px max pour les logos, c'est largement suffisant.
    return {
      ...settings,
      logo: settings.logo ? urlFor(settings.logo).width(400).auto('format').url() : '',
      footerLogo: settings.footerLogo ? urlFor(settings.footerLogo).width(400).auto('format').url() : '',
      favicon: settings.favicon ? urlFor(settings.favicon).width(128).url() : '',
    };
  },
};