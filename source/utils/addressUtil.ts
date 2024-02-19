export const removeEthereumPrefix = (address: string): string => {
  return address.replace('ethereum:', '');
};
