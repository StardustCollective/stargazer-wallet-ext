import React, { FC } from 'react';
import TextInput from 'components/TextInput';
import ButtonV3, { BUTTON_SIZES_ENUM, BUTTON_TYPES_ENUM } from 'components/ButtonV3';
import TextV3 from 'components/TextV3';
import { COLORS_ENUMS } from 'assets/styles/colors';
import {
  ENTER_PASSWORD,
  WRONG_PASSWORD,
  CANCEL,
  SUBMIT,
  CONTINUE,
  PASSWORD_PLACEHOLDER,
} from './constants';
import { IEnterPassword } from './types';
import styles from './EnterPassword.scss';

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
      <div className={styles.inputContainer}>
        <TextV3.CaptionStrong color={COLORS_ENUMS.SECONDARY_TEXT}>
          {ENTER_PASSWORD}
        </TextV3.CaptionStrong>
        <TextInput
          type="password"
          control={control}
          name="password"
          placeholder={PASSWORD_PLACEHOLDER}
          autoFocus
          visiblePassword
          fullWidth
          variant={styles.input}
          inputRef={register({ required: true })}
          error={!!errors?.password?.message}
        />
        <div className={styles.errorContainer}>
          {!!errors?.password?.message && (
            <TextV3.Caption color={COLORS_ENUMS.RED}>{WRONG_PASSWORD}</TextV3.Caption>
          )}
        </div>
      </div>
      <div className={styles.buttonsContainer}>
        <ButtonV3
          type={BUTTON_TYPES_ENUM.GRAY_SOLID}
          size={BUTTON_SIZES_ENUM.LARGE}
          label={CANCEL}
          extraStyle={styles.button}
          onClick={handleOnCancel}
        />
        <ButtonV3
          type={primaryButtonType}
          size={BUTTON_SIZES_ENUM.LARGE}
          label={primaryButtonText}
          disabled={isSubmitDisabled}
          extraStyle={styles.button}
          onClick={handleSubmit((data: any) => {
            handleOnSubmit(data);
          })}
        />
      </div>
    </>
  );
};

export default EnterPassword;
