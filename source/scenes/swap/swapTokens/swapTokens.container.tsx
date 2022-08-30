import React, { useEffect, useState, FC } from 'react';

///////////////////////////
// Imports
///////////////////////////

///////////////////////////
// Types
///////////////////////////

import {
  ISwapTokensContainer
} from './types';

///////////////////////////
// Components
///////////////////////////

import SwapTokens from './swapTokens';
import Container from 'components/Container';

///////////////////////////
// Constants
///////////////////////////

const SwapTokenContainer: FC<ISwapTokensContainer> = ({navigation, route}) => {

  return (
    <Container>
      <SwapTokens />
    </Container>
  );
};

export default SwapTokenContainer;
