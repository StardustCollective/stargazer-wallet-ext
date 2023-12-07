import {AES, enc} from 'crypto-js';
// import Payload from '@stardust-collective/dag4-keyring';

// TODO: import this from dag4-keyring
type Payload = {
  data: string;
  iv: string;
  salt?: string;
};

class RNEncryptor<T> {
  async encrypt(password: string, data: T): Promise<string> {
    const salt = this.generateSalt();
    const iv = (global as any).crypto.getRandomValues(new Uint8Array(16));
    const text = JSON.stringify(data);

    const encryptedData = AES.encrypt(
      text,
      this.getKey(password, salt),
    ).toString();

    return JSON.stringify({
      data: encryptedData,
      salt,
      iv, // unused in this implementation
    });
  }

  async decrypt(password: string, payload: string | Payload): Promise<T> {
    payload = (
      typeof payload === 'string' ? JSON.parse(payload) : payload
    ) as Payload;
    const salt = payload.salt || '';

    return JSON.parse(
      AES.decrypt(payload.data, this.getKey(password, salt)).toString(enc.Utf8),
    );
  }

  getKey(password: string, salt: string): string {
    return `${password}.${salt}`;
  }

  generateSalt(byteCount = 32): string {
    const view = new Uint8Array(byteCount);
    (global as any).crypto.getRandomValues(view);

    return Buffer.from(view).toString('hex');
  }
}

export default RNEncryptor;
