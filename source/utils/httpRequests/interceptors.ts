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

  return config;
};

export { latticeInterceptor };
