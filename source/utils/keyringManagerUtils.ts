// Web uses default implementation so just return undefined
export const getEncryptor = (): void => {
  return undefined;
};

// Web vaults are encrypted by the default dag4-keyring encryptor and never need an upgrade
export const isLegacyVault = (_encryptedVault: any): boolean => {
  return false;
};
