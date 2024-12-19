import React, { FC } from 'react';
import LoadingDotsProps from './types';
import styles from './LoadingDots.scss';

const LoadingDots: FC<LoadingDotsProps> = ({
  color = '#fff',
  width = 40,
  height = 8,
  containerHeight = 20,
}): JSX.Element => {
  return (
    <div className={styles.loadingContainer} style={{ height: containerHeight }}>
      <div
        className={styles.loader}
        style={{ '--loader-color': color, width, height } as React.CSSProperties}
      />
    </div>
  );
};

export default LoadingDots;
