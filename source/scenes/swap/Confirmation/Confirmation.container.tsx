import React, { useEffect, useState, FC } from 'react';

///////////////////////////
// Imports
///////////////////////////

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


  const onViewSwapHistoryPressed = () => {
    alert('On View History Pressed');
  }

  const onDonePressed = () => {
    alert('On Done Pressed');
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
