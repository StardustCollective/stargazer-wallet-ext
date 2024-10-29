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

const generateHmac = async (
  token: string,
  service: string,
  path: string,
  searchParams: string
): Promise<string> => {
  const encoder = new TextEncoder();
  const algorithm = { name: 'HMAC', hash: 'SHA-256' };

  // Convert strings to ArrayBuffer
  const tokenBuffer = encoder.encode(token);
  const serviceBuffer = encoder.encode(service);
  const pathBuffer = encoder.encode(path);
  const searchParamsBuffer = encoder.encode(searchParams);

  // Concatenate buffers
  const payloadBuffer = new Uint8Array([
    ...tokenBuffer,
    ...serviceBuffer,
    ...pathBuffer,
    ...searchParamsBuffer,
  ]);

  // Import the token as a CryptoKey
  const key = await crypto.subtle.importKey('raw', tokenBuffer, algorithm, false, [
    'sign',
  ]);

  // Generate HMAC
  const hmacBuffer = await crypto.subtle.sign(algorithm.name, key, payloadBuffer);

  // Convert ArrayBuffer to base64
  const genHmac = btoa(String.fromCharCode(...new Uint8Array(hmacBuffer)));

  return genHmac;
};

const latticeInterceptor = async (
  config: InternalAxiosRequestConfig<any>
): Promise<InternalAxiosRequestConfig<any>> => {
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

  const { token } = tokenResponse.data.data;

  const service = config.url.split('/')[0];
  const path = '/api';
  const searchParams = `?${config.url.split('?')[1]}`;

  const signature = await generateHmac(token, service, path, searchParams);

  config.headers[X_LATTICE_REQ_TOKEN] = token;
  config.headers[X_LATTICE_SIG] = signature;

  console.log('service', service);

  return config;
};

export { latticeInterceptor };
