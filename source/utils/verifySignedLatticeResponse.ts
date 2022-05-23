import * as jose from 'jose';
import cryptoJS from 'crypto-js';
import { isProd } from './envUtil';

/**
 * ES512 https://www.rfc-editor.org/rfc/rfc7518.html#section-3.4
 */
export const PROD_SIGNATURE_GENERATION_PUB_KEY = {
  key: {
    kty: 'EC',
    crv: 'P-521',
    x: 'AQKGZGKLTcYkGEsRGGeSl9Auk9PllngBFedMmu903cil6sM0rSMmKUM1MDv94xBOMVfj_EvIcIgvLe94hZSQSvXp',
    y: 'AVv1D1btSrShTIYGyx7uKIxy9ls_FziCKgSWD4ajMo0leXP779CBRpedTRw5szyW9QIasXEOX53q0vfUXN5gZt5L',
  },
  alg: 'ES512',
};

/**
 * ES512 https://www.rfc-editor.org/rfc/rfc7518.html#section-3.4
 */
export const NON_PROD_SIGNATURE_GENERATION_PUB_KEY = {
  key: {
    kty: 'EC',
    crv: 'P-521',
    x: 'AIJJeZbqfq4w0dcrjdLOfrv7bFXIdb5VZPjr-pxApyGr07TYy7XyRvr4-tiXnU3zdF-VnBb-Mj-TpWs2eJZKemu2',
    y: 'Aeb5GwdLj0jiLQ4J9namuRggwEsduQPru61LL8lAZnLJr-4yn4n0qhA0HOlpmp_ZTVro7lw5yNKjlH9Oo-J3Yyky',
  },
  alg: 'ES512',
};

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
  const pubkey = await jose.importJWK(SIGNATURE_GENERATION_PUB_KEY.key, SIGNATURE_GENERATION_PUB_KEY.alg);

  let payload: Record<any, any>;
  try {
    payload = (await jose.jwtVerify(response.signature.token, pubkey)).payload;
  } catch (e) {
    return false;
  }

  const baseResponse = { ...response };
  delete baseResponse.signature;

  const baseResponseEncoded = JSON.stringify(baseResponse);
  const hash = cryptoJS.SHA256(baseResponseEncoded).toString();

  if (payload.hash !== hash) {
    return false;
  }

  return true;
};
