import React, { FC, useState, MouseEvent, ReactNode } from 'react';
import clsx from 'clsx';
import MUITextInput, { OutlinedInputProps } from '@material-ui/core/OutlinedInput';
import TextV3 from 'components/TextV3';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import { Control, FieldValues } from 'react-hook-form';
import styles from './TextInput.scss';
import { COLORS_ENUMS } from 'assets/styles/colors';

interface ITextInput extends Partial<OutlinedInputProps> {
  id?: string;
  endAdornment?: ReactNode;
  type?: 'text' | 'password' | 'number';
  variant?: string;
  showPassword?: boolean;
  visiblePassword?: boolean;
  error?: boolean;
  control?: Control<FieldValues>;
  classes?: object;
  labelRight?: string;
}

const TextInput: FC<ITextInput> = ({
  id,
  type = 'text',
  visiblePassword = false,
  showPassword = false,
  variant = '',
  error = false,
  endAdornment,
  classes,
  label,
  labelRight,
  ...otherProps
}) => {
  const [showed, setShowed] = useState(false);
  const [focused, setFocused] = useState(false);
  const inputType = (showed || showPassword) && type === 'password' ? 'text' : type;

  const handleClickShowPassword = () => {
    setShowed(!showed);
  };

  const handleMouseDownPassword = (event: MouseEvent) => {
    event.preventDefault();
  };

  return (
    <>
      {!!label && (
        <div className={styles.labelContainer}>
          <TextV3.CaptionStrong
            color={COLORS_ENUMS.SECONDARY_TEXT}
            extraStyles={styles.label}
          >
            {label}
          </TextV3.CaptionStrong>
          {!!labelRight && (
            <TextV3.Caption color={COLORS_ENUMS.SECONDARY_TEXT}>
              {labelRight}
            </TextV3.Caption>
          )}
        </div>
      )}
      <MUITextInput
        id={id}
        className={clsx(styles.textInput, variant, focused && styles.focusedInput)}
        classes={classes}
        type={inputType}
        error={error}
        {...otherProps}
        onBlur={() => setFocused(false)}
        onFocus={() => setFocused(true)}
        endAdornment={
          endAdornment ||
          (type === 'password' && visiblePassword ? (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                className={styles.iconButton}
                onMouseDown={handleMouseDownPassword}
                onClick={handleClickShowPassword}
                edge="end"
              >
                {showed ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ) : null)
        }
      />
    </>
  );
};

export default TextInput;
