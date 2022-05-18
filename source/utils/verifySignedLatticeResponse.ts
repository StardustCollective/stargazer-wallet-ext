import * as jose from 'jose';

const isProd = process.env.NODE_ENV === 'production';
const isNative = global.location === undefined;

/**
 * This key will not be valid until @juandavidkincaid
 * removes this comment
 */
export const PROD_SIGNATURE_GENERATION_PUB_KEY = jose.importSPKI(
  `-----BEGIN PUBLIC KEY-----
MIGbMBAGByqGSM49AgEGBSuBBAAjA4GGAAQA5Zfgx1RrLjXXCgr33XwJ7h4czNB2
+GIoXR8+9D0mmQdGIiQtD0q13q1IBfqUmQnym8KyjBIUkwj92cQRW6bwYWQAxWTe
JXPiuUmNq0hQK/j+DsAlUcqYFMIZOLY2JtOA8CwuBrn9mbB2fv4HuD2nWynngjz3
LgRAUG+P2BWXaaUanWk=
-----END PUBLIC KEY-----`,
  'ES512'
);

export const NON_PROD_SIGNATURE_GENERATION_PUB_KEY = jose.importSPKI(
  `-----BEGIN PUBLIC KEY-----
MIGbMBAGByqGSM49AgEGBSuBBAAjA4GGAAQBNPCJkdUBGuRwpyrSgtphtymSV5md
um4ghdNaAvRdskP9xrvoOptciBHWpLpm6O87OwbUmkjr33XpoSOfji4yU7MBs8EL
ujAMNYJ5L4xCbyPsO8zhxX04isjtD19OJsfBx3UIsndlgrzSCXtzbyEtPOXZSlkg
LdKtvv23PpYOYe2TS/Y=
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

  let hash: string;
  if (isNative) {
    const crypto = await import('react-native-fast-crypto');
    hash = crypto.createHash('sha256').update(baseResponseEncoded).digest('hex');
  } else {
    const jsCrypto = await import('crypto-js');
    hash = jsCrypto.SHA256(baseResponseEncoded).toString();
  }

  if (payload.hash !== hash) {
    return false;
  }

  return true;
};
