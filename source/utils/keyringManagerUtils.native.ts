import RNEncryptor from '../native/shims/encryptor';

export const getEncryptor = (): any => {
  return new RNEncryptor();
};
