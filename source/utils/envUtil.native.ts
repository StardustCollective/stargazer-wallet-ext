import {
  STARGAZER_API_KEY as stargazerApiKey,
  ELPACA_KEY as elpacaKey,
  ELPACA_VALUE as elpacaValue,
  LATTICE_API_KEY as latticeKey,
} from '@env';

export const STARGAZER_API_KEY = stargazerApiKey;
export const ELPACA_KEY = elpacaKey;
export const ELPACA_VALUE = elpacaValue;
export const LATTICE_API_KEY = latticeKey;
export const isProd = __DEV__ !== true;
export const isNative = true;
