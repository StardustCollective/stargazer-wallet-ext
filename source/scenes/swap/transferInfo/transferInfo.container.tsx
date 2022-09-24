import React, { useEffect, useState, FC } from 'react';

///////////////////////////
// Imports
///////////////////////////

import { useLinkTo } from '@react-navigation/native';

///////////////////////////
// Types
///////////////////////////

import {
  ISwapTokensContainer
} from './types';

///////////////////////////
// Components
///////////////////////////

import TransferInfo from './TransferInfo';
import Container from 'components/Container';

///////////////////////////
// Constants
///////////////////////////

const SwapTokenContainer: FC<ISwapTokensContainer> = ({navigation, route}) => {
    
  const linkTo = useLinkTo();

  const onNextPressed = () => {
    linkTo('/confirmDetails');
  }

  return (
    <Container>
      <TransferInfo onNextPressed={onNextPressed}/>
    </Container>
  );
};

export default SwapTokenContainer;
