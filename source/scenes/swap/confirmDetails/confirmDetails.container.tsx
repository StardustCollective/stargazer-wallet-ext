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

import ConfirmDetails from './confirmDetails';
import Container from 'components/Container';

///////////////////////////
// Constants
///////////////////////////

const ConfirmDetailsContainer: FC<ISwapTokensContainer> = ({navigation, route}) => {

  return (
    <Container>
      <ConfirmDetails />
    </Container>
  );
};

export default ConfirmDetailsContainer;
