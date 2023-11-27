import React, { FC, useEffect } from 'react';
import { ScrollView } from 'react-native';
import WarningMessage from 'components/WarningMessage';
import Biometrics, { PROMPT_TITLES } from 'utils/biometrics';
import EnterPassword from './EnterPassword';
import PrivateKey from './PrivateKey';
import RecoveryPhrase from './RecoveryPhrase';
import { ICheckPassword } from './types';
import styles from './styles';

const CheckPassword: FC<ICheckPassword> = (props) => {
  const {
    control,
    walletPhrase,
    privateKey,
    warningMessage,
    isCopied,
    errors,
    isSubmitDisabled,
    isBiometricEnabled,
    networkOptions,
    register,
    handleSubmit,
    copyText,
    handleOnSubmit,
    handleOnCancel,
  } = props;
  const showRecoveryPhrase = !!walletPhrase && !!walletPhrase.length;
  const showPrivateKey = !!privateKey && !!privateKey.length;
  const showEnterPassword = !showRecoveryPhrase && !showPrivateKey;

  useEffect(() => {
    authWithBiometrics();
  }, []);

  const authWithBiometrics = async () => {
    const biometryType = await Biometrics.getBiometryType();
    if (!!biometryType) {
      if (!!isBiometricEnabled) {
        const keyExist = await Biometrics.keyExists();
        if (!!keyExist) {
          try {
            const { success, signature, secret } = await Biometrics.createSignature(
              PROMPT_TITLES.auth
            );
            const publicKey = await Biometrics.getPublicKeyFromKeychain();
            if (success && signature && secret && publicKey) {
              const verified = await Biometrics.verifySignature(
                signature,
                secret,
                publicKey
              );
              if (verified) {
                let password = await Biometrics.getUserPasswordFromKeychain();
                if (password) {
                  handleOnSubmit({ password });
                }
                password = null;
              }
            }
          } catch (err) {
            console.log('Biometric login failed', err);
          }
        }
      } else {
        console.log('Biometric is disabled.');
      }
    } else {
      console.log('Biometric is not available.');
    }
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollViewContentContainer}
    >
      <WarningMessage message={warningMessage} />
      {showRecoveryPhrase && (
        <RecoveryPhrase
          walletPhrase={walletPhrase}
          isCopied={isCopied}
          copyText={copyText}
          onPressDone={handleOnCancel}
        />
      )}
      {showPrivateKey && (
        <PrivateKey
          networkOptions={networkOptions}
          privateKey={privateKey}
          isCopied={isCopied}
          copyText={copyText}
          onPressDone={handleOnCancel}
        />
      )}
      {showEnterPassword && (
        <EnterPassword
          control={control}
          register={register}
          handleSubmit={handleSubmit}
          handleOnSubmit={handleOnSubmit}
          handleOnCancel={handleOnCancel}
          isSubmitDisabled={isSubmitDisabled}
          errors={errors}
        />
      )}
    </ScrollView>
  );
};

export default CheckPassword;
