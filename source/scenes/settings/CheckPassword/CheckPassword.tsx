import React, { FC } from 'react';
import clsx from 'clsx';
import TextInput from 'components/TextInput';
import ButtonV3, { BUTTON_SIZES_ENUM, BUTTON_TYPES_ENUM } from 'components/ButtonV3';
import TextV3 from 'components/TextV3';
import { COLORS_ENUMS } from 'assets/styles/colors';
import WarningMessage from 'components/WarningMessage';
import Dropdown from 'components/Dropdown';
import CopyIcon from 'assets/images/svg/copy.svg';
import { ICheckPassword } from './types';
import styles from './CheckPassword.scss';

const EnterPassword: FC<ICheckPassword> = ({
  control,
  register,
  handleSubmit,
  handleOnSubmit,
  handleOnCancel,
  isSubmitDisabled,
  errors,
}) => {
  return (
    <>
      <div className={styles.inputContainer}>
        <TextV3.CaptionStrong color={COLORS_ENUMS.SECONDARY_TEXT}>
          Enter your wallet password
        </TextV3.CaptionStrong>
        <TextInput
          type="password"
          control={control}
          name="password"
          autoFocus
          visiblePassword
          fullWidth
          variant={styles.input}
          inputRef={register({ required: true })}
          error={!!errors?.password?.message}
        />
        <div className={styles.errorContainer}>
          {!!errors?.password?.message && (
            <TextV3.Caption color={COLORS_ENUMS.RED}>Wrong password</TextV3.Caption>
          )}
        </div>
      </div>
      <div className={styles.buttonsContainer}>
        <ButtonV3
          type={BUTTON_TYPES_ENUM.TERTIARY_SOLID}
          size={BUTTON_SIZES_ENUM.LARGE}
          label="Cancel"
          extraStyle={styles.button}
          onClick={handleOnCancel}
        />
        <ButtonV3
          type={BUTTON_TYPES_ENUM.PRIMARY_SOLID}
          size={BUTTON_SIZES_ENUM.LARGE}
          label="Submit"
          disabled={isSubmitDisabled}
          extraStyle={clsx(styles.button, styles.submit)}
          onClick={handleSubmit((data: any) => {
            handleOnSubmit(data);
          })}
        />
      </div>
    </>
  );
};

const RecoveryPhrase: FC<ICheckPassword> = ({
  walletPhrase,
  isCopied,
  copyText,
  ...props
}) => {
  const phraseArray = walletPhrase.split(' ');
  return (
    <div className={styles.recoveryContainer}>
      <TextV3.CaptionStrong color={COLORS_ENUMS.SECONDARY_TEXT}>
        Recovery phrase
      </TextV3.CaptionStrong>
      <div onClick={() => copyText(walletPhrase)} className={styles.phraseContainer}>
        {phraseArray.map((phraseItem: string) => (
          <div key={phraseItem} className={styles.phraseItem}>
            <TextV3.Caption color={COLORS_ENUMS.BLACK} extraStyles={styles.phraseText}>
              {phraseItem}
            </TextV3.Caption>
          </div>
        ))}
      </div>
      <div onClick={() => copyText(walletPhrase)} className={styles.copyContainer}>
        <TextV3.CaptionStrong extraStyles={styles.copyText}>
          {isCopied ? 'Copied!' : 'Copy to clipboard'}
        </TextV3.CaptionStrong>
        {!isCopied && <img src={`/${CopyIcon}`} height={20} width={32} />}
      </div>
      <div className={styles.buttonContainer}>
        <ButtonV3
          type={BUTTON_TYPES_ENUM.PRIMARY_SOLID}
          size={BUTTON_SIZES_ENUM.LARGE}
          label="Done"
          submit
          extraStyle={styles.doneButton}
          onClick={props.handleOnCancel}
        />
      </div>
    </div>
  );
};

const PrivateKey: FC<ICheckPassword> = ({
  privateKey,
  isCopied,
  copyText,
  networkOptions,
  wallet,
  ...props
}) => {
  return (
    <div className={styles.recoveryContainer}>
      <TextV3.CaptionStrong color={COLORS_ENUMS.SECONDARY_TEXT}>
        Network Type
      </TextV3.CaptionStrong>
      <div
        className={clsx(styles.dropdownContainer, networkOptions.containerStyle, {
          [styles.showPointer]: !networkOptions.disabled,
        })}
      >
        <Dropdown options={networkOptions} />
      </div>
      <TextV3.CaptionStrong color={COLORS_ENUMS.SECONDARY_TEXT}>
        Private Key
      </TextV3.CaptionStrong>
      <div onClick={() => copyText(privateKey)} className={styles.phraseContainer}>
        <TextV3.CaptionRegular
          color={COLORS_ENUMS.BLACK}
          extraStyles={styles.privateKeyText}
        >
          {privateKey}
        </TextV3.CaptionRegular>
      </div>
      <div onClick={() => copyText(privateKey)} className={styles.copyContainer}>
        <TextV3.CaptionStrong extraStyles={styles.copyText}>
          {isCopied ? 'Copied!' : 'Copy to clipboard'}
        </TextV3.CaptionStrong>
        {!isCopied && <img src={`/${CopyIcon}`} height={20} width={32} />}
      </div>
      <div className={styles.buttonContainer}>
        <ButtonV3
          type={BUTTON_TYPES_ENUM.PRIMARY_SOLID}
          size={BUTTON_SIZES_ENUM.LARGE}
          label="Done"
          submit
          extraStyle={styles.doneButton}
          onClick={props.handleOnCancel}
        />
      </div>
    </div>
  );
};

const CheckPassword: FC<ICheckPassword> = (props) => {
  const { walletPhrase, privateKey, warningMessage } = props;
  const showRecoveryPhrase = !!walletPhrase && !!walletPhrase.length;
  const showPrivateKey = !!privateKey && !!privateKey.length;
  const showEnterPassword = !showRecoveryPhrase && !showPrivateKey;
  return (
    <div className={styles.container}>
      <WarningMessage message={warningMessage} />
      {showRecoveryPhrase && <RecoveryPhrase {...props} />}
      {showPrivateKey && <PrivateKey {...props} />}
      {showEnterPassword && <EnterPassword {...props} />}
    </div>
  );
};

export default CheckPassword;
