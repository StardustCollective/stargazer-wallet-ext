import React, { FC } from 'react';
import WarningMessage from 'components/WarningMessage';
import EnterPassword from './EnterPassword';
import PrivateKey from './PrivateKey';
import RecoveryPhrase from './RecoveryPhrase';
import { ICheckPassword } from './types';
import styles from './CheckPassword.scss';

const CheckPassword: FC<ICheckPassword> = (props) => {
  const {
    control,
    walletPhrase,
    privateKey,
    warningMessage,
    isCopied,
    errors,
    isSubmitDisabled,
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
  return (
    <div className={styles.container}>
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
    </div>
  );
};

export default CheckPassword;
