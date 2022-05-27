import {
    TEST_PRIVATE_KEY as testPrivateKey,
    ETHERSCAN_API_KEY as etherscanApiKey,
    INFURA_CREDENTIAL as infuraCredentials,
    STARGAZER_PROVIDERS_BASE_URL as stargazerProvidersBaseUrl,
    STARGAZER_PROVIDERS_BASE_URL_PROD as stargazerProvidersBaseUrlProd,
    STARGAZER_API_KEY as stargazerApiKey
} from '@env';

export const TEST_PRIVATE_KEY = testPrivateKey;
export const ETHERSCAN_API_KEY = etherscanApiKey;
export const INFURA_CREDENTIAL = infuraCredentials;
export const STARGAZER_PROVIDERS_BASE_URL = stargazerProvidersBaseUrl;
export const STARGAZER_PROVIDERS_BASE_URL_PROD = stargazerProvidersBaseUrlProd;
export const STARGAZER_API_KEY = stargazerApiKey;
export const isProd = __DEV__ !== true;
export const isNative = true;