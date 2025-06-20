export const encodeArrayToBase64 = (value: Uint8Array): string => {
  if (typeof window !== 'undefined' && window.btoa) {
    return window.btoa(String.fromCharCode(...value));
  }
};

export const decodeArrayFromBase64 = (value: string): Uint8Array => {
  if (typeof window !== 'undefined' && window.atob) {
    const binaryString = window.atob(value);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }
};

export const stringToHex = (value: string): string => {
  return Buffer.from(value).toString('hex');
};
