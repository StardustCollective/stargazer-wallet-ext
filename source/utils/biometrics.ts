import ReactNativeBiometrics from 'react-native-biometrics';
import * as Keychain from 'react-native-keychain';
import { RSA } from 'react-native-rsa-native';

import { setBiometryEnabled } from 'state/biometrics';
import store from 'state/store';

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
// v2 entries are bound to the current biometric set and never leave the device.
// Older entries were stored without access control and are rewritten on next use.
const STARGAZER_USER_V2 = 'stargazer-user-v2';
const PASSWORD_KEYCHAIN_OPTIONS = {
  accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
  accessible: Keychain.ACCESSIBLE.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY,
};
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

// Prompts for biometrics and checks the signature against the stored public key.
const verifyBiometricSignature = async (title: string) => {
  const { success, signature, secret } = await createSignature(title);
  const publicKey = await getPublicKeyFromKeychain();
  if (!success || !signature || !secret || !publicKey) {
    return false;
  }
  return verifySignature(signature, secret, publicKey);
};

const setUserPasswordInKeychain = async (password: string) => {
  try {
    const result = await Keychain.setInternetCredentials(
      STARGAZER,
      STARGAZER_USER_V2,
      password,
      PASSWORD_KEYCHAIN_OPTIONS
    );
    return !!result;
  } catch (err) {
    // Fails when the device has no passcode or no enrolled biometrics.
    return false;
  }
};

const getUserPasswordFromKeychain = async (title: string = PROMPT_TITLES.auth) => {
  // Reading a v2 entry shows the OS biometric prompt and fails if it is cancelled.
  const credentials = await Keychain.getInternetCredentials(STARGAZER, {
    ...PASSWORD_KEYCHAIN_OPTIONS,
    authenticationPrompt: { title },
  });

  if (!credentials) {
    return undefined;
  }

  if (credentials.username !== STARGAZER_USER_V2) {
    // Legacy entries have no access control, so gate them with a biometric signature once
    // and rewrite them as v2.
    if (!(await verifyBiometricSignature(title))) {
      return undefined;
    }
    await setUserPasswordInKeychain(credentials.password);
  }

  return credentials.password;
};

const removeUserPasswordFromKeychain = async () => {
  await Keychain.resetInternetCredentials(STARGAZER);
};

// Called whenever a password is set or verified: the password is only kept
// in the keychain while biometric unlock is turned on.
const syncUserPasswordInKeychain = async (password: string, biometryEnabled: boolean) => {
  if (biometryEnabled) {
    // On iOS a failed write has already deleted the previous entry, so biometric unlock
    // can no longer work: turn it off instead of leaving the toggle on with nothing stored.
    if (!(await setUserPasswordInKeychain(password))) {
      store.dispatch(setBiometryEnabled(false));
      await removeUserPasswordFromKeychain();
    }
  } else {
    await removeUserPasswordFromKeychain();
  }
};

export default {
  keyExists,
  getBiometryType,
  getPublicKeyFromKeychain,
  getUserPasswordFromKeychain,
  setUserPasswordInKeychain,
  removeUserPasswordFromKeychain,
  syncUserPasswordInKeychain,
  createKeys,
  deleteKeys,
  createSignature,
  verifySignature,
  verifyBiometricSignature,
};
