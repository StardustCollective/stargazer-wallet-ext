import axios from 'axios';

import { interceptorRequest, interceptorResponseRejected } from './interceptors';
import { EXTERNAL_REQUESTS_BASE_URL } from 'constants/index';

const ExplorerApi = axios.create({
  baseURL: EXTERNAL_REQUESTS_BASE_URL,
});

ExplorerApi.interceptors.request.use(interceptorRequest);
ExplorerApi.interceptors.response.use(
  (response) => response,
  interceptorResponseRejected
);

export { ExplorerApi };
