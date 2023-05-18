import { getLoggerV3 } from '../utils/logger.js';
import { login as apiLogin, QbittorrentApi } from './api.js';

export const loginV2 = async (qbittorrentSettings) => {
  const logger = getLoggerV3();
  const response = await apiLogin(qbittorrentSettings);
  // TODO: Differentiate between wrong credentials vs. qbit is not listening (wrong URL / port etc.)

  console.log('Response Headers:', response.headers);
  console.log('Response Body:', response.data);

  let cookiesArray = [];

  if (Array.isArray(response.headers['set-cookie'])) {
    cookiesArray = response.headers['set-cookie'];
  } else if (typeof response.headers['set-cookie'] === 'string') {
    cookiesArray = [response.headers['set-cookie']];
  }

  if (cookiesArray.length === 0) {
    throw new Error(`Failed to authenticate`);
  }

  return new QbittorrentApi(qbittorrentSettings.url, cookiesArray[0]);
};
