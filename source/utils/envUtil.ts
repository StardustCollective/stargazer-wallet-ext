export const TEST_PRIVATE_KEY = process.env.TEST_PRIVATE_KEY ;
export const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
export const INFURA_CREDENTIAL = process.env.INFURA_CREDENTIAL;
export const NODE_ENV = process.env.NODE_ENV;
export const STARGAZER_PROVIDERS_BASE_URL = process.env.STARGAZER_PROVIDERS_BASE_URL;
export const STARGAZER_PROVIDERS_BASE_URL_PROD = process.env.STARGAZER_PROVIDERS_BASE_URL_PROD;
export const STARGAZER_API_KEY = process.env.STARGAZER_API_KEY;
export const isProd = NODE_ENV === 'production';
export const isNative = false;