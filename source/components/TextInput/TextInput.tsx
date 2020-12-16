import React, {
  FC,
  useState,
  MouseEvent,
  Ref,
  ReactNode,
  ChangeEvent,
} from 'react';
import clsx from 'clsx';
import MUITextInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import styles from './TextInput.scss';

interface ITextInput {
  endAdornment?: ReactNode;
  fullWidth?: boolean;
  inputRef?: Ref<any>;
  name?: string;
  onChange?: (ev: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  placeholder?: string;
  type?: 'text' | 'password' | 'number';
  value?: string;
  variant?: string;
  visiblePassword?: boolean;
}

const TextInput: FC<ITextInput> = ({
  type = 'text',
  placeholder,
  fullWidth,
  visiblePassword = false,
  variant = '',
  inputRef,
  name = '',
  endAdornment,
  value,
  onChange,
}) => {
  const [showed, setShowed] = useState(false);
  const inputType = showed && type === 'password' ? 'text' : type;

  const handleClickShowPassword = () => {
    setShowed(!showed);
  };

  const handleMouseDownPassword = (event: MouseEvent) => {
    event.preventDefault();
  };

  return (
    <MUITextInput
      className={clsx(styles.textInput, variant)}
      type={inputType}
      placeholder={placeholder}
      fullWidth={fullWidth}
      inputRef={inputRef}
      value={value}
      onChange={onChange}
      name={name}
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
  );
};

export default TextInput;
