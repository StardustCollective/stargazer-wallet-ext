import React, { ReactNode, FC } from 'react';
import MUIButton from '@material-ui/core/Button';
import styles from './Button.scss';

interface IButton {
  children: ReactNode;
}

const Button: FC<IButton> = ({ children }) => {
  return <MUIButton className={styles.button}>{children}</MUIButton>;
};

export default Button;
