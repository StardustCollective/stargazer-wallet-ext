import axios from 'axios';

import { interceptor } from './interceptors';
import { EXTERNAL_REQUESTS_BASE_URL } from 'constants/index';

const ExplorerApi = axios.create({
  baseURL: EXTERNAL_REQUESTS_BASE_URL,
});

ExplorerApi.interceptors.request.use(interceptor);

export { ExplorerApi };
