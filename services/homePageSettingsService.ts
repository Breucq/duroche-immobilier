
import { client, urlFor } from './sanityClient';
import type { HomePageSettings } from '../types';

const SETTINGS_DOCUMENT_ID = 'homePageSettings';

export const homePageSettingsService = {
  async getSettings(): Promise<HomePageSettings> {
    const query = `*[_type == "homePageSettings" && _id == "${SETTINGS_DOCUMENT_ID}"][0]`;
    const settings = await client.fetch(query);
    
    // Optimisation : w=1280 (au lieu de 1920) et q=60 (au lieu de 75)
    return {
      ...settings,
      heroBackgroundImage: settings.heroBackgroundImage ? urlFor(settings.heroBackgroundImage).width(1280).quality(60).url() : '',
      estimationBackgroundImage: settings.estimationBackgroundImage ? urlFor(settings.estimationBackgroundImage).width(1280).quality(70).url() : '',
    };
  },
};
