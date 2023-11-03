import React, { FC } from 'react';
import clsx from 'clsx';
import IContainer from './types';
import styles from './Container.scss';

const Container: FC<IContainer> = ({ maxHeight = true, children }) => {
  const heightStyles = maxHeight ? styles.maxHeightBottomBar : styles.maxHeight;

  return <div className={clsx(styles.container, heightStyles)}>{children as any}</div>;
};

export default Container;
