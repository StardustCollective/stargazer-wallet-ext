import React, { FC } from 'react';
import clsx from 'clsx';
import styles from './Card.scss';

type ICard = {
  extraStyle?: string;
  children: React.ReactChild | React.ReactChild[];
};

const Card: FC<ICard> = ({ extraStyle, children }) => {
  return <div className={clsx(styles.container, extraStyle)}>{children}</div>;
};

export default Card;
