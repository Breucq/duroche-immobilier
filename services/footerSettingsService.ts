import { client, urlFor } from './sanityClient';
import type { FooterSettings } from '../types';

const SETTINGS_DOCUMENT_ID = 'footerSettings';

export const footerSettingsService = {
  async getSettings(): Promise<FooterSettings> {
    const query = `*[_type == "footerSettings" && _id == "${SETTINGS_DOCUMENT_ID}"][0]`;
    const settings = await client.fetch(query);
    
    return {
      ...settings,
      professionalCardLogo: settings.professionalCardLogo ? urlFor(settings.professionalCardLogo).width(600).url() : '',
    };
  },
};