import React, { ReactNode, FC } from 'react';
import clsx from 'clsx';
import { Link as RouterLink } from 'react-router-dom';

import styles from './Link.scss';

interface ILink {
  children: ReactNode;
  color: 'primary' | 'secondary';
  to: string;
}

const Link: FC<ILink> = ({ to, color = 'primary', children }) => {
  return (
    <RouterLink className={clsx(styles.link, styles[color])} to={to}>
      {children}
    </RouterLink>
  );
};

export default Link;
