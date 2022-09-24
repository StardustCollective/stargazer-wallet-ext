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

import ConfirmDetails from './ConfirmDetails';
import Container from 'components/Container';

///////////////////////////
// Constants
///////////////////////////

const ConfirmDetailsContainer: FC<ISwapTokensContainer> = ({navigation, route}) => {

  const linkTo = useLinkTo();

  const onSwapPressed = () => {
    linkTo('/confirmation')
  }

  const onCancelPressed = () => {
    alert('Swap Canceled');
  }

  return (
    <Container>
      <ConfirmDetails 
        onSwapPressed={onSwapPressed}
        onCancelPressed={onCancelPressed} />
    </Container>
  );
};

export default ConfirmDetailsContainer;
