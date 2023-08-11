import React, { FC, useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import TextInput from 'components/TextInput';
import ButtonV3, { BUTTON_SIZES_ENUM, BUTTON_TYPES_ENUM } from 'components/ButtonV3';
import TextV3 from 'components/TextV3';
import { COLORS_ENUMS } from 'assets/styles/colors';
import WarningMessage from 'components/WarningMessage';
import Dropdown from 'components/Dropdown';
import CopyIcon from 'assets/images/svg/copy.svg';
import Biometrics, { PROMPT_TITLES } from 'utils/biometrics';
import { ICheckPassword } from './types';
import styles from './styles';

const EnterPassword = ({
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
      <View style={styles.inputContainer}>
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
          inputContainerStyle={styles.input}
          inputRef={register({ required: true })}
          error={!!errors?.password?.message}
        />
        <View style={styles.errorContainer}>
          {!!errors?.password?.message && (
            <TextV3.Caption color={COLORS_ENUMS.RED}>Wrong password</TextV3.Caption>
          )}
        </View>
      </View>
      <View style={styles.buttonsContainer}>
        <ButtonV3
          type={BUTTON_TYPES_ENUM.TERTIARY_SOLID}
          size={BUTTON_SIZES_ENUM.LARGE}
          title="Cancel"
          extraStyles={styles.button}
          onPress={handleOnCancel}
        />
        <ButtonV3
          type={BUTTON_TYPES_ENUM.PRIMARY}
          size={BUTTON_SIZES_ENUM.LARGE}
          title="Submit"
          disabled={isSubmitDisabled}
          extraStyles={[styles.button, styles.submit]}
          onPress={handleSubmit((data) => {
            handleOnSubmit(data);
          })}
        />
      </View>
    </>
  );
};

const RecoveryPhrase = ({ walletPhrase, isCopied, copyText, ...props }) => {
  const phraseArray = walletPhrase.split(' ');
  return (
    <View style={styles.recoveryContainer}>
      <TextV3.CaptionStrong color={COLORS_ENUMS.SECONDARY_TEXT}>
        Recovery phrase
      </TextV3.CaptionStrong>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => copyText(walletPhrase)}
        style={styles.phraseContainer}
      >
        {phraseArray.map((phraseItem: string) => (
          <View key={phraseItem} style={styles.phraseItem}>
            <TextV3.Caption color={COLORS_ENUMS.BLACK} extraStyles={styles.phraseText}>
              {phraseItem}
            </TextV3.Caption>
          </View>
        ))}
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => copyText(walletPhrase)}
        style={styles.copyContainer}
      >
        <TextV3.CaptionStrong extraStyles={styles.copyText}>
          {isCopied ? 'Copied!' : 'Copy to clipboard'}
        </TextV3.CaptionStrong>
        {!isCopied && <CopyIcon height={20} width={32} />}
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        <ButtonV3
          type={BUTTON_TYPES_ENUM.PRIMARY}
          size={BUTTON_SIZES_ENUM.LARGE}
          title="Done"
          submit
          extraStyles={styles.doneButton}
          onPress={props.handleOnCancel}
        />
      </View>
    </View>
  );
};

const PrivateKey = ({
  privateKey,
  isCopied,
  copyText,
  networkOptions,
  wallet,
  ...props
}) => {
  return (
    <View style={styles.recoveryContainer}>
      <TextV3.CaptionStrong color={COLORS_ENUMS.SECONDARY_TEXT}>
        Network Type
      </TextV3.CaptionStrong>
      <View style={[styles.dropdownContainer, networkOptions.containerStyle]}>
        <Dropdown options={networkOptions} />
      </View>
      <TextV3.CaptionStrong color={COLORS_ENUMS.SECONDARY_TEXT}>
        Private Key
      </TextV3.CaptionStrong>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => copyText(privateKey)}
        style={styles.phraseContainer}
      >
        <TextV3.CaptionRegular color={COLORS_ENUMS.BLACK}>
          {privateKey}
        </TextV3.CaptionRegular>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => copyText(privateKey)}
        style={styles.copyContainer}
      >
        <TextV3.CaptionStrong extraStyles={styles.copyText}>
          {isCopied ? 'Copied!' : 'Copy to clipboard'}
        </TextV3.CaptionStrong>
        {!isCopied && <CopyIcon height={20} width={32} />}
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        <ButtonV3
          type={BUTTON_TYPES_ENUM.PRIMARY}
          size={BUTTON_SIZES_ENUM.LARGE}
          title="Done"
          submit
          extraStyles={styles.doneButton}
          onPress={props.handleOnCancel}
        />
      </View>
    </View>
  );
};

const CheckPassword: FC<ICheckPassword> = (props) => {
  const { walletPhrase, privateKey, warningMessage, handleOnSubmit, isBiometricEnabled } =
    props;
  const showRecoveryPhrase = !!walletPhrase && !!walletPhrase.length;
  const showPrivateKey = !!privateKey && !!privateKey.length;
  const showEnterPassword = !showRecoveryPhrase && !showPrivateKey;

  useEffect(() => {
    const authBiometrics = async () => {
      await authWithBiometrics();
    };

    authBiometrics();
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
    <View style={styles.container}>
      <WarningMessage message={warningMessage} />
      {showRecoveryPhrase && <RecoveryPhrase {...props} />}
      {showPrivateKey && <PrivateKey {...props} />}
      {showEnterPassword && <EnterPassword {...props} />}
    </View>
  );
};

export default CheckPassword;
