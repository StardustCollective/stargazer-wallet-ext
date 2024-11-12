import axios from 'axios';

import { interceptorRequest, interceptorResponseRejected } from './interceptors';
import { EXTERNAL_REQUESTS_BASE_URL } from 'constants/index';

const ExternalApi = axios.create({
  baseURL: EXTERNAL_REQUESTS_BASE_URL,
});

ExternalApi.interceptors.request.use(interceptorRequest);
ExternalApi.interceptors.response.use(
  (response) => response,
  interceptorResponseRejected
);

export { ExternalApi };
