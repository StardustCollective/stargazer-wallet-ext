import React, { FC } from 'react';
import IContainer from './types';

const Container: FC<IContainer> = (
  children
) => {
  return (
    <>
      {children}
    </>
  )
}

export default Container