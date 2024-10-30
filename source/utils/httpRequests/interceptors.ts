import axios, { InternalAxiosRequestConfig, HttpStatusCode } from 'axios';
import { GetLatticeTokenResponse } from './types';
import {
  X_LATTICE_API_KEY,
  X_LATTICE_REQ_TOKEN,
  X_LATTICE_SIG,
  TOKEN,
} from './constants';
import { LATTICE_API_KEY } from 'utils/envUtil';
import { EXTERNAL_REQUESTS_BASE_URL } from 'constants/index';
import { generateHmac } from './signature';
import store from 'state/store';
import { setExternalToken } from 'state/auth';
import { fromUnixTime, isAfter } from 'date-fns';

const tokenExpired = () => {
  const { external } = store.getState().auth;

  if (!external || !external?.token) return true;

  const { exp } = external;

  const expirationDate = fromUnixTime(exp);
  const currentDate = new Date();

  return isAfter(currentDate, expirationDate);
};

const requestToken = async () => {
  const tokenResponse = await axios.get<GetLatticeTokenResponse>(
    `${EXTERNAL_REQUESTS_BASE_URL}/${TOKEN}`,
    {
      headers: {
        [X_LATTICE_API_KEY]: LATTICE_API_KEY,
      },
    }
  );

  if (tokenResponse.status !== HttpStatusCode.Ok) return;
  if (!tokenResponse?.data?.data?.token) return;

  const { token, exp } = tokenResponse.data.data;

  store.dispatch(setExternalToken({ token, exp }));

  return token;
};

const interceptor = async (
  config: InternalAxiosRequestConfig<any>
): Promise<InternalAxiosRequestConfig<any>> => {
  const { external } = store.getState().auth;

  const isExpired = tokenExpired();
  let token = external?.token ?? '';

  if (isExpired) {
    token = await requestToken();
  }

  const service = config.url.split('/')[0];
  const path = '/api';
  const searchParams = `?${config.url.split('?')[1]}`;

  const signature = await generateHmac(token, service, path, searchParams);

  config.headers[X_LATTICE_REQ_TOKEN] = token;
  config.headers[X_LATTICE_SIG] = signature;

  return config;
};

export { interceptor };
