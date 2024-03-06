import React, { FC } from 'react';
import TextV3 from 'components/TextV3';
import TextInput from 'components/TextInput';
import { COLORS_ENUMS } from 'assets/styles/colors';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import ViewOn from 'assets/images/svg/view-on.svg';
import ViewOff from 'assets/images/svg/view-off.svg';
import styles from './PhraseInput.scss';
import { IPhraseInput } from './types';

const PhraseInput: FC<IPhraseInput> = ({
  value,
  index,
  hasError = false,
  showPassword,
  togglePassword,
  onChangeText,
}) => {
  return (
    <TextInput
      type="password"
      visiblePassword
      variant={styles.inputContainer}
      showPassword={showPassword}
      value={value}
      error={hasError}
      onChange={(ev) => {
        const text = ev.target.value;
        onChangeText(text, index);
      }}
      startAdornment={
        <TextV3.CaptionRegular extraStyles={styles.indexText} color={COLORS_ENUMS.BLACK}>
          {index + 1}.
        </TextV3.CaptionRegular>
      }
      endAdornment={
        <InputAdornment position="end">
          <IconButton
            aria-label="toggle password visibility"
            className={styles.iconButton}
            onMouseDown={(ev) => ev.preventDefault()}
            onClick={() => togglePassword(index)}
            edge="end"
          >
            {showPassword ? <img src={`/${ViewOn}`} /> : <img src={`/${ViewOff}`} />}
          </IconButton>
        </InputAdornment>
      }
    />
  );
};

export default PhraseInput;
