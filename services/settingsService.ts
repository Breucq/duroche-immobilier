import { client, urlFor } from './sanityClient';
import type { SiteSettings, SanityImage } from '../types';

// The ID of the singleton document for site settings in Sanity
const SETTINGS_DOCUMENT_ID = 'siteSettings';

export const settingsService = {
  async getSettings(): Promise<SiteSettings> {
    const query = `*[_type == "siteSettings" && _id == "${SETTINGS_DOCUMENT_ID}"][0]`;
    const settings = await client.fetch(query);

    // Build full image URLs from Sanity image objects
    // Fix: Increased width to 1200px to ensure sharpness on Retina/High-DPI screens
    return {
      ...settings,
      logo: settings.logo ? urlFor(settings.logo).width(1200).url() : '',
      footerLogo: settings.footerLogo ? urlFor(settings.footerLogo).width(1200).url() : '',
      favicon: settings.favicon ? urlFor(settings.favicon).width(128).url() : '',
    };
  },
};