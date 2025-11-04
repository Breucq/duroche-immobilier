import { client } from './sanityClient';
import type { EstimationPageSettings } from '../types';

const SETTINGS_DOCUMENT_ID = 'estimationPageSettings';

export const estimationPageSettingsService = {
  async getSettings(): Promise<EstimationPageSettings> {
    const query = `*[_type == "estimationPageSettings" && _id == "${SETTINGS_DOCUMENT_ID}"][0]`;
    const settings = await client.fetch(query);
    return settings;
  },
};
