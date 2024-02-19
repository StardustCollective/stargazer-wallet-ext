import ReactNativeBiometrics from 'react-native-biometrics';
import * as Keychain from 'react-native-keychain';
import { RSA } from 'react-native-rsa-native';

const biometrics = new ReactNativeBiometrics();

const GENERIC_PASSWORD_USERNAME = 'publicKey';
const STARGAZER_SIGN_MESSAGE = ' Stargazer signature message';
const ALGORITHM = 'SHA256withRSA';
export const PROMPT_TITLES = {
  signIn: 'Sign In',
  auth: 'Authenticate',
};
const BEGIN_PUBLIC_KEY = '-----BEGIN PUBLIC KEY-----';
const END_PUBLIC_KEY = '-----END PUBLIC KEY-----';
const STARGAZER = 'stargazer';
const STARGAZER_USER = 'stargazer-user';
const BIOMETRY_MAP = {
  FaceID: 'Face ID',
  TouchID: 'Touch ID',
  Biometrics: 'Touch ID/Face ID',
};

const getPublicKeyFromKeychain = async () => {
  const credentials = await Keychain.getGenericPassword();

  if (credentials) {
    return credentials.password;
  }

  return undefined;
};

const getUserPasswordFromKeychain = async () => {
  const credentials = await Keychain.getInternetCredentials(STARGAZER);

  if (credentials) {
    return credentials.password;
  }

  return undefined;
};

const setUserPasswordInKeychain = async (password: string) => {
  const result = await Keychain.setInternetCredentials(
    STARGAZER,
    STARGAZER_USER,
    password
  );

  if (result) {
    return true;
  }

  return false;
};

const getBiometryType = async () => {
  const { available, biometryType } = await biometrics.isSensorAvailable();

  if (available) {
    return BIOMETRY_MAP[biometryType];
  }

  return undefined;
};

const keyExists = async () => {
  const { keysExist } = await biometrics.biometricKeysExist();
  return keysExist;
};

const createKeys = async () => {
  // Create a public private key pair
  const { publicKey } = await biometrics.createKeys();
  // Store public key on keychain
  await Keychain.setGenericPassword(GENERIC_PASSWORD_USERNAME, publicKey);
};

const deleteKeys = async () => {
  // Delete keys
  const { keysDeleted } = await biometrics.deleteKeys();
  // Return if keys were deleted successfully
  return keysDeleted;
};

const createSignature = async (title: string) => {
  // Generate secret message
  const epochTimeSeconds = Math.round(new Date().getTime() / 1000).toString();
  const secret = epochTimeSeconds + STARGAZER_SIGN_MESSAGE;
  // Return signature created
  const signatureResult = await biometrics.createSignature({
    promptMessage: title,
    payload: secret,
  });
  return { ...signatureResult, secret };
};

const verifySignature = async (signature: string, secret: string, key: string) => {
  // Generate public key
  const publicKey = `${BEGIN_PUBLIC_KEY}\n${key}\n${END_PUBLIC_KEY}`;
  // Verify signature
  return RSA.verifyWithAlgorithm(signature, secret, publicKey, ALGORITHM);
};

export default {
  keyExists,
  getBiometryType,
  getPublicKeyFromKeychain,
  getUserPasswordFromKeychain,
  setUserPasswordInKeychain,
  createKeys,
  deleteKeys,
  createSignature,
  verifySignature,
};
