import React, { FC } from 'react';
import WarningMessage from 'components/WarningMessage';
import RemoveWalletHeader from 'scenes/settings/RemoveWallet/RemoveWalletHeader';
import { KeyringWalletType } from '@stardust-collective/dag4-keyring';
import EnterPassword from './EnterPassword';
import PrivateKey from './PrivateKey';
import RecoveryPhrase from './RecoveryPhrase';
import { ICheckPassword } from './types';
import styles from './CheckPassword.scss';
import { TITLE, SUBTITLE_PHRASE, SUBTITLE_KEY } from './constants';

const CheckPassword: FC<ICheckPassword> = ({
  control,
  walletPhrase,
  wallet,
  privateKey,
  warningMessage,
  isCopied,
  errors,
  isSubmitDisabled,
  networkOptions,
  register,
  copyText,
  handleOnContinue,
  handleSubmit,
  handleOnSubmit,
  handleOnCancel,
  isRemoveWallet,
}) => {
  const showRecoveryPhrase = !!walletPhrase && !!walletPhrase.length;
  const showPrivateKey = !!privateKey && !!privateKey.length;
  const showEnterPassword = !showRecoveryPhrase && !showPrivateKey;
  const showWarningMessage = !isRemoveWallet || showRecoveryPhrase || showPrivateKey;
  const showRemoveWalletHeader = isRemoveWallet && !showRecoveryPhrase && !showPrivateKey;
  const hasRecoveryPhrase = wallet?.type === KeyringWalletType.MultiChainWallet;
  const headerSubtitle = hasRecoveryPhrase ? SUBTITLE_PHRASE : SUBTITLE_KEY;
  const onPressDone = isRemoveWallet ? handleOnContinue : handleOnCancel;

  return (
    <div className={styles.container}>
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
          onPressCancel={handleOnCancel}
          onPressDone={onPressDone}
        />
      )}
      {showPrivateKey && (
        <PrivateKey
          isRemoveWallet={isRemoveWallet}
          networkOptions={networkOptions}
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
    </div>
  );
};

export default CheckPassword;
