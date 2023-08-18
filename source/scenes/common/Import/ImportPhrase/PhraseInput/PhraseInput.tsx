import React, { FC } from 'react';
import TextV3 from 'components/TextV3';
import TextInput from 'components/TextInput';
import { COLORS_ENUMS } from 'assets/styles/colors';
import { IPhraseInput } from './types';
import styles from './PhraseInput.scss';

const PhraseInput: FC<IPhraseInput> = ({ value, index, hasError, onChangeText }) => {
  return (
    <TextInput
      type="password"
      visiblePassword
      variant={styles.inputContainer}
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
    />
  );
};

export default PhraseInput;
