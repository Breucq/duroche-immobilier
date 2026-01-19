
import { client, urlFor } from './sanityClient';
import type { HomePageSettings } from '../types';

const SETTINGS_DOCUMENT_ID = 'homePageSettings';

export const homePageSettingsService = {
  async getSettings(): Promise<HomePageSettings> {
    const query = `*[_type == "homePageSettings" && _id == "${SETTINGS_DOCUMENT_ID}"][0]`;
    const settings = await client.fetch(query);
    
    // Optimisation : w=1280, h=720 (16:9) et fit('crop') pour forcer le ratio au serveur
    return {
      ...settings,
      heroBackgroundImage: settings.heroBackgroundImage 
        ? urlFor(settings.heroBackgroundImage).width(1280).height(720).fit('crop').quality(60).url() 
        : '',
      estimationBackgroundImage: settings.estimationBackgroundImage 
        ? urlFor(settings.estimationBackgroundImage).width(1280).height(720).fit('crop').quality(70).url() 
        : '',
    };
  },
};