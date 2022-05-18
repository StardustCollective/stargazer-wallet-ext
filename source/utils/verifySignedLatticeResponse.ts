import * as jose from 'jose';
import cryptoJS from 'crypto-js';

const isProd = process.env.NODE_ENV === 'production';

/**
 * ES512 https://www.rfc-editor.org/rfc/rfc7518.html#section-3.4
 */
export const PROD_SIGNATURE_GENERATION_PUB_KEY = jose.importSPKI(
  `-----BEGIN PUBLIC KEY-----
MIGbMBAGByqGSM49AgEGBSuBBAAjA4GGAAQBAoZkYotNxiQYSxEYZ5KX0C6T0+WW
eAEV50ya73TdyKXqwzStIyYpQzUwO/3jEE4xV+P8S8hwiC8t73iFlJBK9ekBW/UP
Vu1KtKFMhgbLHu4ojHL2Wz8XOIIqBJYPhqMyjSV5c/vv0IFGl51NHDmzPJb1Ahqx
cQ5fnerS99Rc3mBm3ks=
-----END PUBLIC KEY-----`,
  'ES512'
);

/**
 * ES512 https://www.rfc-editor.org/rfc/rfc7518.html#section-3.4
 */
export const NON_PROD_SIGNATURE_GENERATION_PUB_KEY = jose.importSPKI(
  `-----BEGIN PUBLIC KEY-----
MIGbMBAGByqGSM49AgEGBSuBBAAjA4GGAAQAgkl5lup+rjDR1yuN0s5+u/tsVch1
vlVk+Ov6nECnIavTtNjLtfJG+vj62JedTfN0X5WcFv4yP5OlazZ4lkp6a7YB5vkb
B0uPSOItDgn2dqa5GCDASx25A+u7rUsvyUBmcsmv7jKfifSqEDQc6Wman9lNWuju
XDnI0qOUf06j4ndjKTI=
-----END PUBLIC KEY-----`,
  'ES512'
);

export const SIGNATURE_GENERATION_PUB_KEY = isProd
  ? PROD_SIGNATURE_GENERATION_PUB_KEY
  : NON_PROD_SIGNATURE_GENERATION_PUB_KEY;

export type SignedApiResponse = {
  data: Record<string, any>;
  meta?: Record<string, any>;
  signature: {
    key: 'stargazer-providers';
    token: string;
  };
};

export const verifySignedResponse = async (response: SignedApiResponse): Promise<boolean> => {
  let payload: Record<any, any>;
  try {
    payload = (await jose.jwtVerify(response.signature.token, await SIGNATURE_GENERATION_PUB_KEY)).payload;
  } catch (e) {
    return false;
  }

  const baseResponse = Object.assign({}, response);
  delete baseResponse.signature;

  const baseResponseEncoded = JSON.stringify(baseResponse);
  const hash = cryptoJS.SHA256(baseResponseEncoded).toString();

  if (payload.hash !== hash) {
    return false;
  }

  return true;
};
