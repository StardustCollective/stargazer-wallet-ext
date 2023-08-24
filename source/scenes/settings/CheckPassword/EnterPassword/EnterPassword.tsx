import React, { FC } from 'react';
import clsx from 'clsx';
import TextInput from 'components/TextInput';
import ButtonV3, { BUTTON_SIZES_ENUM, BUTTON_TYPES_ENUM } from 'components/ButtonV3';
import TextV3 from 'components/TextV3';
import { COLORS_ENUMS } from 'assets/styles/colors';
import { ENTER_PASSWORD, WRONG_PASSWORD, CANCEL, SUBMIT } from './constants';
import { IEnterPassword } from './types';
import styles from './EnterPassword.scss';

const EnterPassword: FC<IEnterPassword> = ({
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
          {ENTER_PASSWORD}
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
            <TextV3.Caption color={COLORS_ENUMS.RED}>{WRONG_PASSWORD}</TextV3.Caption>
          )}
        </div>
      </div>
      <div className={styles.buttonsContainer}>
        <ButtonV3
          type={BUTTON_TYPES_ENUM.TERTIARY_SOLID}
          size={BUTTON_SIZES_ENUM.LARGE}
          label={CANCEL}
          extraStyle={styles.button}
          onClick={handleOnCancel}
        />
        <ButtonV3
          type={BUTTON_TYPES_ENUM.PRIMARY_SOLID}
          size={BUTTON_SIZES_ENUM.LARGE}
          label={SUBMIT}
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

export default EnterPassword;
