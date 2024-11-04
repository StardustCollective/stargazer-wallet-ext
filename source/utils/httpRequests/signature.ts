const generateHmac = async (
  token: string,
  service: string,
  path: string,
  searchParams: string
): Promise<string> => {
  const encoder = new TextEncoder();
  const algorithm = { name: 'HMAC', hash: 'SHA-256' };

  // Convert strings to ArrayBuffer
  const tokenBuffer = encoder.encode(token);
  const serviceBuffer = encoder.encode(service);
  const pathBuffer = encoder.encode(path);
  const searchParamsBuffer = encoder.encode(searchParams);

  // Concatenate buffers
  const payloadBuffer = new Uint8Array([
    ...tokenBuffer,
    ...serviceBuffer,
    ...pathBuffer,
    ...searchParamsBuffer,
  ]);

  // Import the token as a CryptoKey
  const key = await crypto.subtle.importKey('raw', tokenBuffer, algorithm, false, [
    'sign',
  ]);

  // Generate HMAC
  const hmacBuffer = await crypto.subtle.sign(algorithm.name, key, payloadBuffer);

  // Convert ArrayBuffer to base64
  const genHmac = btoa(String.fromCharCode(...new Uint8Array(hmacBuffer)));

  return genHmac;
};

export { generateHmac };
