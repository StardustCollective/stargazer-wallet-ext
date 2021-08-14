import React, { ReactNode, FC } from 'react';
import clsx from 'clsx';
// import { Link as RouterLink } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import  MULink from '@material-ui/core/Link';

import styles from './Link.scss';

interface ILink {
  children: ReactNode;
  color?: 'primary' | 'secondary';
  noUnderline?: boolean;
  onClick?: () => void;
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
    <Typography>
      <MULink className={classes} onClick={onClick}>
        {children}
      </MULink>
    </Typography>
  );
};

export default Link;
