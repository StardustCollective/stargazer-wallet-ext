import {AES, enc} from 'crypto-js';
import QuickCrypto from 'react-native-quick-crypto';
// import Payload from '@stardust-collective/dag4-keyring';

// TODO: import this from dag4-keyring
type Payload = {
  data: string;
  iv: string;
  salt?: string;
  // Present only on v2+ payloads. Legacy (crypto-js) payloads have no version.
  version?: number;
  iterations?: number;
  tag?: string;
};

type PayloadV2 = Required<Omit<Payload, 'iterations'>> & {iterations?: number};

const VAULT_VERSION = 2;
// OWASP 2023 recommendation for PBKDF2-HMAC-SHA256.
const PBKDF2_ITERATIONS = 600000;
const PBKDF2_DIGEST = 'sha256';
const KEY_LENGTH = 32;
const IV_LENGTH = 12;
const CIPHER = 'aes-256-gcm';

type DerivedKey = {password: string; salt: string; key: Uint8Array};

class RNEncryptor<T> {
  // The keyring re-encrypts the vault on every wallet change. Reusing the key derived at
  // unlock (with a fresh IV each time) keeps PBKDF2 to once per session instead of once
  // per save. Cleared on logout.
  private cachedKey: DerivedKey | null = null;

  clearKeyCache(): void {
    this.cachedKey = null;
  }

  async encrypt(password: string, data: T): Promise<string> {
    const {salt, key} = await this.getEncryptionKey(password);
    const iv = QuickCrypto.randomBytes(IV_LENGTH);

    const cipher = QuickCrypto.createCipheriv(CIPHER, key, iv);
    const encryptedData =
      cipher.update(JSON.stringify(data), 'utf8', 'hex') + cipher.final('hex');

    return JSON.stringify({
      version: VAULT_VERSION,
      iterations: PBKDF2_ITERATIONS,
      data: encryptedData,
      salt,
      iv: Buffer.from(iv).toString('hex'),
      tag: Buffer.from(cipher.getAuthTag()).toString('hex'),
    });
  }

  async decrypt(password: string, payload: string | Payload): Promise<T> {
    payload = (
      typeof payload === 'string' ? JSON.parse(payload) : payload
    ) as Payload;

    if (!RNEncryptor.isLegacyPayload(payload)) {
      return this.decryptV2(password, payload as PayloadV2);
    }

    // Legacy crypto-js passphrase mode (EVP_BytesToKey + AES-CBC). Read-only:
    // vaults in this format are re-encrypted as v2 after a successful unlock.
    const salt = payload.salt || '';
    return JSON.parse(
      AES.decrypt(payload.data, `${password}.${salt}`).toString(enc.Utf8),
    );
  }

  static isLegacyPayload(payload: string | Payload): boolean {
    const parsed = (
      typeof payload === 'string' ? JSON.parse(payload) : payload
    ) as Payload;

    return !parsed?.version || parsed.version < VAULT_VERSION;
  }

  private async getEncryptionKey(
    password: string,
  ): Promise<{salt: string; key: Uint8Array}> {
    if (this.cachedKey?.password === password) {
      return this.cachedKey;
    }

    const salt = this.generateSalt();
    const key = await this.deriveKey(password, salt, PBKDF2_ITERATIONS);
    this.cachedKey = {password, salt, key};
    return this.cachedKey;
  }

  private async decryptV2(password: string, payload: PayloadV2): Promise<T> {
    const iterations = payload.iterations || PBKDF2_ITERATIONS;
    const key = await this.deriveKey(password, payload.salt, iterations);

    try {
      const decipher = QuickCrypto.createDecipheriv(
        CIPHER,
        key,
        Buffer.from(payload.iv, 'hex'),
      );
      decipher.setAuthTag(Buffer.from(payload.tag, 'hex'));
      const text =
        decipher.update(payload.data, 'hex', 'utf8') + decipher.final('utf8');

      // The auth tag checked out, so the password is correct: keep the key for later saves.
      if (iterations === PBKDF2_ITERATIONS) {
        this.cachedKey = {password, salt: payload.salt, key};
      }

      return JSON.parse(text);
    } catch (err) {
      throw new Error('Incorrect password');
    }
  }

  private deriveKey(
    password: string,
    salt: string,
    iterations: number,
  ): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      QuickCrypto.pbkdf2(
        password,
        Buffer.from(salt, 'hex'),
        iterations,
        KEY_LENGTH,
        PBKDF2_DIGEST,
        (err, key) => (err || !key ? reject(err) : resolve(key)),
      );
    });
  }

  generateSalt(byteCount = 32): string {
    const view = new Uint8Array(byteCount);
    (global as any).crypto.getRandomValues(view);

    return Buffer.from(view).toString('hex');
  }
}

export default RNEncryptor;
