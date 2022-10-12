import React, { useEffect, useState, FC } from 'react';

///////////////////////////
// Imports
///////////////////////////

import { useSelector } from 'react-redux';

///////////////////////////
// Hooks
///////////////////////////

import { useFiat } from 'hooks/usePrice';

///////////////////////////
// Types
///////////////////////////

import { IExolixTransaction } from 'state/swap/types'
import { RootState } from 'state/store';
import { ISwapTokensContainer } from './types';


///////////////////////////
// Components
///////////////////////////

import ConfirmDetails from './TransactionDetails';
import Container from 'components/Container';

///////////////////////////
// Constants
///////////////////////////

const ConfirmDetailsContainer: FC<ISwapTokensContainer> = () => {

  const { selectedTransaction }: { selectedTransaction: IExolixTransaction } = useSelector((state: RootState) => state.swap);

  return (
    <Container>
      <ConfirmDetails
        transaction={selectedTransaction}
      />
    </Container>
  );
};

export default ConfirmDetailsContainer;
