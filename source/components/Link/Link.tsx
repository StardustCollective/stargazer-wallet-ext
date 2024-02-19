import React, { ReactNode, FC } from 'react';
import clsx from 'clsx';
// import { Link as RouterLink } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import MULink from '@material-ui/core/Link';

import styles from './Link.scss';

interface ILink {
  id?: string;
  children: ReactNode;
  color?: 'primary' | 'secondary' | 'monotoneOne';
  noUnderline?: boolean;
  onClick?: () => void;
  extraStyles?: string;
}

const Link: FC<ILink> = ({
  id,
  color = 'primary',
  children,
  noUnderline = false,
  onClick,
  extraStyles,
}) => {
  const classes = clsx(styles.link, extraStyles, styles[color], {
    [styles.noUnderline]: noUnderline,
  });

  return (
    <Typography>
      <MULink id={id} className={classes} onClick={onClick}>
        {children}
      </MULink>
    </Typography>
  );
};

export default Link;
