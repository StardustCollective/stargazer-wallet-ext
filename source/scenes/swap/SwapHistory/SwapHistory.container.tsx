import React, { useEffect, useState, FC } from 'react';

///////////////////////////
// Imports
///////////////////////////

///////////////////////////
// Types
///////////////////////////

import {
  ISwapHistoryContainer
} from './types';

///////////////////////////
// Components
///////////////////////////

import SwapHistory from './SwapHistory';
import Container from 'components/Container';

///////////////////////////
// Constants
///////////////////////////

const SwapHistoryContainer: FC<ISwapHistoryContainer> = ({navigation, route}) => {


  const onViewSwapHistoryPressed = () => {
    alert('On View History Pressed');
  }

  const onDonePressed = () => {
    alert('On Done Pressed');
  }

  return (
    <Container>
      <SwapHistory />
    </Container>
  );
};

export default SwapHistoryContainer;
