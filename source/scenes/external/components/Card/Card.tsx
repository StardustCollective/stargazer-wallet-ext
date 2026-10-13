import clsx from 'clsx';
import React, { FC } from 'react';

import styles from './Card.scss';

type ICard = {
  extraStyle?: string;
  children: React.ReactNode;
};

const Card: FC<ICard> = ({ extraStyle, children }) => {
  return <div className={clsx(styles.container, extraStyle)}>{children}</div>;
};

export default Card;
