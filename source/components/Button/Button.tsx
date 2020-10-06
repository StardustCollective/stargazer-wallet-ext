import React, { ReactNode, FC } from 'react';
import clsx from 'clsx';
import MUIButton from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';

import styles from './Button.scss';

interface IButton {
  blockHeight?: number;
  // height of block button if fullWidth = true
  children: ReactNode;
  fullWidth?: boolean;
  linkTo?: string;
  onClick?: () => void;
  theme?: 'primary' | 'secondary';
  type: 'button' | 'submit';
  variant?: string;
}

const Button: FC<IButton> = ({
  theme = 'primary',
  fullWidth = false,
  blockHeight = 0,
  children,
  variant = '',
  linkTo = '#',
  ...otherProps
}) => {
  const classes = clsx(
    styles.button,
    styles[theme],
    {
      [styles.block]: fullWidth,
    },
    variant
  );
  const customStyle = {
    height: fullWidth && blockHeight ? blockHeight : 'fit-content',
  };
  const history = useHistory();
  const clickHandler = () => {
    if (linkTo !== '#') history.push(linkTo);
  };

  return (
    <MUIButton
      className={classes}
      fullWidth={fullWidth}
      style={customStyle}
      onClick={clickHandler}
      {...otherProps}
    >
      {children}
    </MUIButton>
  );
};

export default Button;
