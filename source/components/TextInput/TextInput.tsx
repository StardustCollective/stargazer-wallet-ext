import React, { ReactNode, FC } from 'react';
import MUITextField from '@material-ui/core/TextField';

import styles from './TextInput.scss';

interface ITextInput {
  children: ReactNode;
}

const TextInput: FC<ITextInput> = ({ children }) => {
  return <MUITextField className={styles.textInput}>{children}</MUITextField>;
};

export default TextInput;
