import React, { useEffect, useState, FC } from 'react';

///////////////////////////
// Imports
///////////////////////////

import { useLinkTo } from '@react-navigation/native';

///////////////////////////
// Utils
///////////////////////////

import NavUtils from 'navigation/util';

///////////////////////////
// Types
///////////////////////////

import {
  IConfirmationContainer
} from './types';

///////////////////////////
// Components
///////////////////////////

import Confirmation from './Confirmation';
import Container from 'components/Container';

///////////////////////////
// Constants
///////////////////////////

const ConfirmationContainer: FC<IConfirmationContainer> = ({navigation, route}) => {

  const linkTo = useLinkTo();

  const onViewSwapHistoryPressed = () => {
    linkTo('/swapHistory');
  }

  const onDonePressed = () => {
    NavUtils.popToTop(navigation);
  }

  return (
    <Container>
      <Confirmation  
        onViewSwapHistoryPressed={onViewSwapHistoryPressed} 
        onDonePressed={onDonePressed} 
      />
    </Container>
  );
};

export default ConfirmationContainer;
