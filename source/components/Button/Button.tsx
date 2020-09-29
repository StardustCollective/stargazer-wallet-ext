import React, { ReactNode, FC } from 'react';
import clsx from 'clsx';
import MUIButton from '@material-ui/core/Button';
import styles from './Button.scss';

interface IButton {
  theme?: 'primary' | 'secondary';
  fullWidth?: boolean;
  blockHeight?: number; // height of block button if fullWidth = true
  children: ReactNode;
}

const Button: FC<IButton> = ({
  theme = 'primary',
  fullWidth = false,
  blockHeight = 0,
  children,
}) => {
  const classes = clsx(styles.button, styles[theme], {
    [styles.block]: fullWidth,
  });
  const customStyle = {
    height: fullWidth && blockHeight ? blockHeight : 'fit-content',
  };

  return (
    <MUIButton className={classes} fullWidth={fullWidth} style={customStyle}>
      {children}
    </MUIButton>
  );
};

export default Button;
