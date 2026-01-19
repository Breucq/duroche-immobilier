
import { client, urlFor } from './sanityClient';
import type { HomePageSettings } from '../types';

const SETTINGS_DOCUMENT_ID = 'homePageSettings';

export const homePageSettingsService = {
  async getSettings(): Promise<HomePageSettings> {
    const query = `*[_type == "homePageSettings" && _id == "${SETTINGS_DOCUMENT_ID}"][0]`;
    const settings = await client.fetch(query);
    
    // Optimisation : Qualité baissée à 50 pour gagner les 120Ko signalés par PageSpeed
    return {
      ...settings,
      heroBackgroundImage: settings.heroBackgroundImage 
        ? urlFor(settings.heroBackgroundImage).width(1280).height(720).fit('crop').quality(50).url() 
        : '',
      estimationBackgroundImage: settings.estimationBackgroundImage 
        ? urlFor(settings.estimationBackgroundImage).width(1280).height(720).fit('crop').quality(60).url() 
        : '',
    };
  },
};