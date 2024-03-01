import React, { FC } from 'react';
import WarningMessage from 'components/WarningMessage';
import RemoveWalletHeader from 'scenes/settings/RemoveWallet/RemoveWalletHeader';
import EnterPassword from './EnterPassword';
import PrivateKey from './PrivateKey';
import RecoveryPhrase from './RecoveryPhrase';
import { ICheckPassword } from './types';
import styles from './CheckPassword.scss';
import { SUBTITLE, TITLE } from './constants';

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
  const showWarningMessage = !isRemoveWallet || showRecoveryPhrase;
  const showRemoveWalletHeader = isRemoveWallet && !showRecoveryPhrase;
  const onPressDone = isRemoveWallet ? handleOnContinue : handleOnCancel;

  return (
    <div className={styles.container}>
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
          onPressCancel={handleOnCancel}
          onPressDone={onPressDone}
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
    </div>
  );
};

export default CheckPassword;
