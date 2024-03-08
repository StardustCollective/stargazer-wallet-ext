import React, { FC } from 'react';
import { View } from 'react-native';
import TextV3 from 'components/TextV3';
import TextInput from 'components/TextInput';
import ButtonV3, { BUTTON_SIZES_ENUM, BUTTON_TYPES_ENUM } from 'components/ButtonV3';
import { COLORS_ENUMS } from 'assets/styles/colors';
import { CANCEL, CONTINUE, ENTER_PASSWORD, SUBMIT, WRONG_PASSWORD } from './constants';
import { IEnterPassword } from './types';
import styles from './styles';

const EnterPassword: FC<IEnterPassword> = ({
  control,
  register,
  handleSubmit,
  handleOnSubmit,
  handleOnCancel,
  isSubmitDisabled,
  isRemoveWallet,
  errors,
}) => {
  const primaryButtonText = isRemoveWallet ? CONTINUE : SUBMIT;
  const primaryButtonType = isRemoveWallet
    ? BUTTON_TYPES_ENUM.ERROR_SOLID
    : BUTTON_TYPES_ENUM.NEW_PRIMARY_SOLID;
  return (
    <>
      <View style={styles.inputContainer}>
        <TextV3.CaptionStrong color={COLORS_ENUMS.SECONDARY_TEXT}>
          {ENTER_PASSWORD}
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
            <TextV3.Caption color={COLORS_ENUMS.RED}>{WRONG_PASSWORD}</TextV3.Caption>
          )}
        </View>
      </View>
      <View style={styles.buttonsContainer}>
        <ButtonV3
          type={BUTTON_TYPES_ENUM.TERTIARY_SOLID}
          size={BUTTON_SIZES_ENUM.LARGE}
          title={CANCEL}
          extraStyles={styles.button}
          onPress={handleOnCancel}
        />
        <ButtonV3
          type={primaryButtonType}
          size={BUTTON_SIZES_ENUM.LARGE}
          title={primaryButtonText}
          disabled={isSubmitDisabled}
          extraStyles={styles.button}
          onPress={handleSubmit((data) => {
            handleOnSubmit(data);
          })}
        />
      </View>
    </>
  );
};

export default EnterPassword;
