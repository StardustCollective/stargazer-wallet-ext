import React, { FC } from 'react';
import clsx from 'clsx';
import IContainer from './types';
import styles from './Container.scss';
import { CONTAINER_COLOR } from './enum';

const Container: FC<IContainer> = ({
  maxHeight = true,
  showHeight = true,
  color,
  children,
}) => {
  const heightStyles = maxHeight ? styles.maxHeightBottomBar : styles.maxHeight;

  const backgroundColor = {
    [CONTAINER_COLOR.EXTRA_LIGHT]: styles.extraLight,
    [CONTAINER_COLOR.LIGHT]: styles.light,
    [CONTAINER_COLOR.DARK]: styles.dark,
    [CONTAINER_COLOR.GRAY_LIGHT_300]: styles.grayLight300,
  };

  const backgroundStyle = backgroundColor[color] ?? styles.light;

  return (
    <div className={clsx(styles.container, showHeight && heightStyles, backgroundStyle)}>
      {children as any}
    </div>
  );
};

export default Container;
