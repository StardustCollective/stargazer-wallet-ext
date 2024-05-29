import addMinutes from 'date-fns/addMinutes';
import compare from 'date-fns/compareAsc';

import sessionStorage from './sessionStorage';
import { decodeFromBase64, encodeToBase64 } from './encoding';

export const KEY_USAGES: KeyUsage[] = ['encrypt', 'decrypt'];
export const KEY_FORMAT = 'jwk';
export const ALGORITHM = 'AES-GCM';
export const SGW_KEY = 'sgw';
export const EXP_KEY = 'exp';
export const SGW_K_KEY = 'sgw-k';
export const IV_KEY = 'iv';
export const EXPIRATION_TIME = 15; // in minutes

/* 
  - Returns decrypted sgw
*/
export const getSgw = async (): Promise<string | null> => {
  const keyObject = await getEncryptedKey();
  if (!keyObject) return null;

  const { key, iv } = keyObject;

  const decryptedSgw = await decrypt(key, iv);
  if (!decryptedSgw) return null;

  return decryptedSgw;
};

/* 
  - Encrypts and stores sgw
*/
export const setSgw = async (value: string): Promise<boolean> => {
  try {
    const key = await generateKey();
    if (!key) return false;

    const encryptedData = await encrypt(key, value);
    if (!encryptedData) return false;

    const { encrypted, iv } = encryptedData;

    const storeResult = await storeEncryptedData(encrypted);
    if (!storeResult) return false;

    const storeKeyResult = await storeEncryptedKey(key, iv);
    if (!storeKeyResult) return false;

    const expResult = await setExpiration();
    if (!expResult) return false;

    return true;
  } catch (err) {
    return false;
  }
};

/* 
  - Removes sgw
*/
export const removeSgw = async (): Promise<boolean> => {
  try {
    await sessionStorage.removeItem(SGW_KEY);
    return true;
  } catch (err) {
    return false;
  }
};
/* 
  - Removes sgw-k
*/
export const removeSgwK = async (): Promise<boolean> => {
  try {
    await sessionStorage.removeItem(SGW_K_KEY);
    return true;
  } catch (err) {
    return false;
  }
};

/* 
  - Returns expiration time
*/
export const getExpiration = async (): Promise<string | null> => {
  return sessionStorage.getItem(EXP_KEY);
};

/* 
  - Sets expiration time 
*/
export const setExpiration = async (): Promise<boolean> => {
  try {
    const expDate = addMinutes(new Date(), EXPIRATION_TIME);
    const expTime = expDate.toISOString();

    await sessionStorage.setItem(EXP_KEY, expTime);
    return true;
  } catch (err) {
    return false;
  }
};

/* 
  - Removes expiration time
*/
export const removeExpiration = async (): Promise<boolean> => {
  try {
    await sessionStorage.removeItem(EXP_KEY);
    return true;
  } catch (err) {
    return false;
  }
};

/* 
  - Checks if the session expired
*/
export const sessionExpired = async (): Promise<boolean> => {
  try {
    const expString = await getExpiration();

    if (!expString) return true;

    const expDate = new Date(expString);
    const currentDate = new Date();

    // Compare the two dates and return 1 if the first date is after the second, -1 if the first date is before the second or 0 if dates are equal.
    const result = compare(expDate, currentDate);

    if (result > 0) return false;

    return true;
  } catch (err) {
    return true;
  }
};

export const clearSession = async (): Promise<boolean> => {
  const resultExp = await removeExpiration();
  const resultSgw = await removeSgw();
  const resultSgwK = await removeSgwK();

  if (resultExp && resultSgw && resultSgwK) return true;

  return false;
};

export const generateKey = async (): Promise<CryptoKey | null> => {
  try {
    const key = await window.crypto.subtle.generateKey(
      {
        name: ALGORITHM,
        length: 256,
      },
      true,
      KEY_USAGES
    );
    return key;
  } catch (err) {
    return null;
  }
};

export const encrypt = async (
  key: CryptoKey,
  data: string
): Promise<{ encrypted: Uint8Array; iv: Uint8Array } | null> => {
  try {
    const iv = window.crypto.getRandomValues(new Uint8Array(12)); // AES-GCM recommended IV size is 12 bytes
    const encodedData = new TextEncoder().encode(data);

    const encrypted = await window.crypto.subtle.encrypt(
      {
        name: ALGORITHM,
        iv: iv,
      },
      key,
      encodedData
    );

    return {
      encrypted: new Uint8Array(encrypted),
      iv: iv,
    };
  } catch (err) {
    return null;
  }
};

export const decrypt = async (key: CryptoKey, iv: Uint8Array): Promise<string | null> => {
  try {
    const sgwString = await sessionStorage.getItem(SGW_KEY);

    if (!sgwString) return null;

    const sgw = Uint8Array.from(decodeFromBase64(sgwString), (c) => c.charCodeAt(0));

    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: ALGORITHM,
        iv: iv,
      },
      key,
      sgw
    );

    return new TextDecoder().decode(decrypted);
  } catch (err) {
    return null;
  }
};

export const storeEncryptedData = async (data: any): Promise<boolean> => {
  try {
    const encryptedString = encodeToBase64(String.fromCharCode.apply(null, data));

    await sessionStorage.setItem(SGW_KEY, encryptedString);
    return true;
  } catch (err) {
    return false;
  }
};

export const storeEncryptedKey = async (key: CryptoKey, iv: any): Promise<boolean> => {
  try {
    const ivString = encodeToBase64(String.fromCharCode.apply(null, iv));
    const keyData: JsonWebKey = await window.crypto.subtle.exportKey(KEY_FORMAT, key);
    const keyString = JSON.stringify(keyData);
    const keyObject = {
      key: keyString,
      iv: ivString,
    };
    const objectString = JSON.stringify(keyObject);
    const encodedKey = encodeToBase64(objectString);

    await sessionStorage.setItem(SGW_K_KEY, encodedKey);
    return true;
  } catch (err) {
    return false;
  }
};

export const getEncryptedKey = async (): Promise<{
  key: CryptoKey;
  iv: Uint8Array;
} | null> => {
  try {
    const encodedKey: string = await sessionStorage.getItem(SGW_K_KEY);

    if (!encodedKey) return null;

    const decodedKeyObject = decodeFromBase64(encodedKey);
    const { key, iv } = JSON.parse(decodedKeyObject);

    const keyData: JsonWebKey = JSON.parse(key);
    const ivData = Uint8Array.from(decodeFromBase64(iv), (c) => c.charCodeAt(0));

    const keyImported = await window.crypto.subtle.importKey(
      KEY_FORMAT,
      keyData,
      ALGORITHM,
      true,
      KEY_USAGES
    );

    return {
      key: keyImported,
      iv: ivData,
    };
  } catch (err) {
    return null;
  }
};
