import Biometrics from 'utils/biometrics';
import store from 'state/store';
import { setBiometryEnabled } from 'state/biometrics';

// Removes the stored password and biometric keys once no wallet is left.
export const clearBiometrics = async (): Promise<void> => {
  store.dispatch(setBiometryEnabled(false));
  await Biometrics.removeUserPasswordFromKeychain();
  await Biometrics.deleteKeys();
};
