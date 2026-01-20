import { Buffer } from '@craftzdog/react-native-buffer';
import { createHmac } from 'react-native-quick-crypto';

const generateHmac = async (
  token: string,
  service: string,
  path: string,
  searchParams: string,
  body?: any
): Promise<string> => {
  // Build the payload by concatenating all parts
  const parts = [Buffer.from(token), Buffer.from(service), Buffer.from(path), Buffer.from(searchParams)];

  if (body) {
    parts.push(Buffer.from(JSON.stringify(body)));
  }

  const payload = Buffer.concat(parts);

  return createHmac('sha256', token).update(payload).digest('base64');
};

export { generateHmac };
