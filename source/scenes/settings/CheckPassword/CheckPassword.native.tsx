import React, { FC, useEffect } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { scale } from 'react-native-size-matters';
import WarningMessage from 'components/WarningMessage';
import RemoveWalletHeader from 'scenes/settings/RemoveWallet/RemoveWalletHeader';
import Biometrics, { PROMPT_TITLES } from 'utils/biometrics';
import useSecureScreen from 'hooks/useSecureScreen';
import { KeyringWalletType } from '@stardust-collective/dag4-keyring';
import EnterPassword from './EnterPassword';
import PrivateKey from './PrivateKey';
import RecoveryPhrase from './RecoveryPhrase';
import { ICheckPassword } from './types';
import { TITLE, SUBTITLE_PHRASE, SUBTITLE_KEY } from './constants';
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
  const showWarningMessage = !isRemoveWallet || showRecoveryPhrase || showPrivateKey;
  const showRemoveWalletHeader = isRemoveWallet && !showRecoveryPhrase && !showPrivateKey;
  const hasRecoveryPhrase = wallet?.type === KeyringWalletType.MultiChainWallet;
  const headerSubtitle = hasRecoveryPhrase ? SUBTITLE_PHRASE : SUBTITLE_KEY;
  const onPressDone = isRemoveWallet ? handleOnContinue : handleOnCancel;

  useSecureScreen(showRecoveryPhrase || showPrivateKey);

  const authWithBiometrics = async () => {
    const biometryType = await Biometrics.getBiometryType();

    if (!biometryType) return;
    if (!isBiometricEnabled) return;

    try {
      // The keychain entry is biometry-bound, so reading it is the authentication step.
      let password = await Biometrics.getUserPasswordFromKeychain(PROMPT_TITLES.auth);
      if (password) {
        handleOnSubmit({ password });
      }
      password = null;
    } catch (err) {
      console.log('Biometric login failed');
    }
  };

  useEffect(() => {
    authWithBiometrics();
  }, []);

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.scrollViewContentContainer}
      extraScrollHeight={EXTRA_SCROLL_HEIGHT}
      enableOnAndroid
    >
      {showRemoveWalletHeader && (
        <RemoveWalletHeader wallet={wallet} title={TITLE} subtitle={headerSubtitle} />
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
          isRemoveWallet={isRemoveWallet}
          privateKey={privateKey}
          isCopied={isCopied}
          copyText={copyText}
          onPressCancel={handleOnCancel}
          onPressDone={onPressDone}
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
