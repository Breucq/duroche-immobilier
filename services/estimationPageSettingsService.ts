import { client } from './sanityClient';
import type { EstimationPageSettings } from '../types';

const SETTINGS_DOCUMENT_ID = 'estimationPageSettings';

export const estimationPageSettingsService = {
  async getSettings(): Promise<EstimationPageSettings | null> {
    const query = `*[_type == "estimationPageSettings"][0]`;
    const settings = await client.fetch(query);
    return settings || null;
  },
};
