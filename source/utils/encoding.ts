export const encodeToBase64 = (value: string): string => {
  return Buffer.from(value).toString('base64');
};

export const decodeFromBase64 = (value: string): string => {
  return Buffer.from(value, 'base64').toString();
};
