const generateHmac = async (
  token: string,
  service: string,
  path: string,
  searchParams: string
): Promise<string> => {
  const payload = Buffer.concat([
    Buffer.from(token),
    Buffer.from(service),
    Buffer.from(path),
    Buffer.from(searchParams),
  ]);

  const hmac = crypto.createHmac('sha256', token);
  hmac.update(payload);

  const genHmac = hmac.digest('base64');

  return genHmac;
};

export { generateHmac };
