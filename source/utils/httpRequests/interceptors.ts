import axios, { InternalAxiosRequestConfig, HttpStatusCode, AxiosError } from 'axios';
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
import { setExternalToken } from 'state/auth';
import store from 'state/store';

let isRefreshing = false;
let subscribers: any[] = [];

// Function to add a new subscriber
const subscribeTokenRefresh = (callback: any) => {
  subscribers.push(callback);
};

// Function to trigger all subscribers with the new token
const onRefreshed = (newToken: string, signature: string) => {
  subscribers.forEach((callback) => callback(newToken, signature));
  subscribers = [];
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

const generateSignature = async (
  config: InternalAxiosRequestConfig,
  token: string
): Promise<string> => {
  const service = config.url.split('/')[0];
  const path = '/api';
  const searchParams = `?${config.url.split('?')[1]}`;

  const signature = await generateHmac(token, service, path, searchParams);
  return signature;
};

const interceptorRequest = async (
  config: InternalAxiosRequestConfig<any>
): Promise<InternalAxiosRequestConfig<any>> => {
  const { external } = store.getState().auth;

  let token = external?.token ?? '';

  if (!token) {
    token = await requestToken();
  }

  const signature = await generateSignature(config, token);

  config.headers[X_LATTICE_REQ_TOKEN] = token;
  config.headers[X_LATTICE_SIG] = signature;

  return config;
};

const interceptorResponseRejected = async (error: AxiosError): Promise<any> => {
  const { status, config } = error;

  if (status === HttpStatusCode.Forbidden) {
    if (!isRefreshing) {
      isRefreshing = true;

      try {
        // Request a new token
        const newToken = await requestToken();
        if (!newToken) throw new Error('Failed to refresh token');

        // Generate the new signature
        const signature = await generateSignature(config, newToken);
        if (!signature) throw new Error('Failed to generate signature');

        // Notify all subscribers that the token is refreshed
        onRefreshed(newToken, signature);
        isRefreshing = false;

        // Retry the original request with the new token
        config.headers[X_LATTICE_REQ_TOKEN] = newToken;
        config.headers[X_LATTICE_SIG] = signature;
        return axios(config);
      } catch (refreshError) {
        isRefreshing = false;
        return Promise.reject(refreshError);
      }
    }

    // If a token refresh is already in progress, queue the request
    return new Promise((resolve) => {
      subscribeTokenRefresh(async (newToken: string, signature: string) => {
        config.headers[X_LATTICE_REQ_TOKEN] = newToken;
        config.headers[X_LATTICE_SIG] = signature;
        resolve(axios(config));
      });
    });
  }

  return Promise.reject(error);
};

export { interceptorRequest, interceptorResponseRejected };
