import React, { FC, useEffect } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { scale } from 'react-native-size-matters';
import WarningMessage from 'components/WarningMessage';
import RemoveWalletHeader from 'scenes/settings/RemoveWallet/RemoveWalletHeader';
import Biometrics, { PROMPT_TITLES } from 'utils/biometrics';
import EnterPassword from './EnterPassword';
import PrivateKey from './PrivateKey';
import RecoveryPhrase from './RecoveryPhrase';
import { ICheckPassword } from './types';
import { TITLE, SUBTITLE } from './constants';
import styles from './styles';

const EXTRA_SCROLL_HEIGHT = scale(25);

const CheckPassword: FC<ICheckPassword> = ({
  control,
  wallet,
  walletPhrase,
  privateKey,
  warningMessage,
  isCopied,
  errors,
  isSubmitDisabled,
  isBiometricEnabled,
  isRemoveWallet,
  networkOptions,
  register,
  handleSubmit,
  copyText,
  handleOnSubmit,
  handleOnContinue,
  handleOnCancel,
}) => {
  const showRecoveryPhrase = !!walletPhrase && !!walletPhrase.length;
  const showPrivateKey = !!privateKey && !!privateKey.length;
  const showEnterPassword = !showRecoveryPhrase && !showPrivateKey;
  const showWarningMessage = !isRemoveWallet || showRecoveryPhrase;
  const showRemoveWalletHeader = isRemoveWallet && !showRecoveryPhrase;
  const onPressDone = isRemoveWallet ? handleOnContinue : handleOnCancel;

  const authWithBiometrics = async () => {
    const biometryType = await Biometrics.getBiometryType();
    if (biometryType) {
      if (isBiometricEnabled) {
        const keyExist = await Biometrics.keyExists();
        if (keyExist) {
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

  useEffect(() => {
    authWithBiometrics();
  }, []);

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.scrollViewContentContainer}
      extraScrollHeight={EXTRA_SCROLL_HEIGHT}
    >
      {showRemoveWalletHeader && (
        <RemoveWalletHeader wallet={wallet} title={TITLE} subtitle={SUBTITLE} />
      )}
      {showWarningMessage && <WarningMessage message={warningMessage} />}
      {showRecoveryPhrase && (
        <RecoveryPhrase
          walletPhrase={walletPhrase}
          isCopied={isCopied}
          copyText={copyText}
          isRemoveWallet={isRemoveWallet}
          onPressDone={onPressDone}
          onPressCancel={handleOnCancel}
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
          isRemoveWallet={isRemoveWallet}
          errors={errors}
        />
      )}
    </KeyboardAwareScrollView>
  );
};

export default CheckPassword;
