import React, { FC } from 'react';
import IContainer from './types';

const Container: FC<IContainer> = (
  children
) => {

  return (
    <div>
      {children.children}
    </div>
  )
}

export default Container
