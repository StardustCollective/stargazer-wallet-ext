import React, { FC } from 'react';
import { SafeAreaView } from 'react-native';
import IContainer from './types';

const Container: FC<IContainer> = (
{
  children
}
) => {
  return (
    <SafeAreaView>
      {children}
    </SafeAreaView>
  )
}

export default Container;