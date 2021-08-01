import React, { ReactNode, FC } from 'react';
import clsx from 'clsx';
import styles from './Link.scss';

interface ILink {
  children: ReactNode;
  color?: 'primary' | 'secondary';
  noUnderline?: boolean;
  onClick?: () => void;
  to: string;
}

const Link: FC<ILink> = ({
  color = 'primary',
  children,
  noUnderline = false,
  onClick,
}) => {
  const classes = clsx(styles.link, styles[color], {
    [styles.noUnderline]: noUnderline,
  });

  return (
    <span className={classes} onClick={onClick}>
      {children}
    </span>
  );
};

export default Link;
