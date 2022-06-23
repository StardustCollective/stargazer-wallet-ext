import React, { FC } from 'react';
import IContainer from './types';
import styles from './Container.scss';

const Container: FC<IContainer> = (
  children
) => {

  return (
    <div className={styles.container}>
      {children.children as any}
    </div>
  )
}

export default Container