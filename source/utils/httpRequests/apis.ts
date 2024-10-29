import axios from 'axios';

import { latticeInterceptor } from './interceptors';
import { EXTERNAL_REQUESTS_BASE_URL } from 'constants/index';

const ExplorerApi = axios.create({
  baseURL: EXTERNAL_REQUESTS_BASE_URL,
});

ExplorerApi.interceptors.request.use(latticeInterceptor);

export { ExplorerApi };
