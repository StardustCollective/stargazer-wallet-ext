import {
  STARGAZER_API_KEY as stargazerApiKey,
  LATTICE_API_KEY as latticeKey,
} from '@env';

export const STARGAZER_API_KEY = stargazerApiKey;
export const LATTICE_API_KEY = latticeKey;
export const isProd = __DEV__ !== true;
export const isNative = true;
