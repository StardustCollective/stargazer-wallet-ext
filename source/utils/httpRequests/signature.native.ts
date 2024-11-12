const generateHmac = async (
  token: string,
  service: string,
  path: string,
  searchParams: string,
  body?: any
): Promise<string> => {
  let payload = Buffer.concat([
    Buffer.from(token),
    Buffer.from(service),
    Buffer.from(path),
    Buffer.from(searchParams),
  ]);

  if (!!body) {
    payload = Buffer.concat([payload, Buffer.from(JSON.stringify(body))]);
  }

  const hmac = crypto.createHmac('sha256', token);
  hmac.update(payload);

  const genHmac = hmac.digest('base64');

  return genHmac;
};

export { generateHmac };
