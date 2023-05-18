import { getLoggerV3 } from '../utils/logger.js';
import { login as apiLogin, QbittorrentApi } from './api.js';

export const loginV2 = async (qbittorrentSettings) => {
  const logger = getLoggerV3();
  const { url, method, headers, data } = qbittorrentSettings;

  console.log('Request URL:', url);
  console.log('Request Method:', method);
  console.log('Request Headers:', headers);
  console.log('Request Body:', data);

  const response = await apiLogin(qbittorrentSettings);
  // TODO: Differentiate between wrong credentials vs. qbit is not listening (wrong URL / port etc.)

  console.log('Response:', response.data);
  console.log('Response Code:', response.status);

  let cookiesArray = [];
  if (response.headers['set-cookie']) {
    cookiesArray = response.headers['set-cookie'].split(';');
  }

  if (cookiesArray.length === 0) {
    throw new Error(`Failed to authenticate`);
  }

  return new QbittorrentApi(url, cookiesArray[0]);
};
