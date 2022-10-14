import React, { FC } from 'react';

///////////////////////////
// Imports
///////////////////////////

import { useSelector } from 'react-redux';

///////////////////////////
// Types
///////////////////////////

import { IExolixTransaction } from 'state/swap/types'
import { RootState } from 'state/store';
import { ISwapTokensContainer } from './types';
import { CONTAINER_COLOR } from 'components/Container/enum';

///////////////////////////
// Components
///////////////////////////

import ConfirmDetails from './TransactionDetails';
import Container from 'components/Container';

///////////////////////////
// Constants
///////////////////////////

const TransactionDetailsContainer: FC<ISwapTokensContainer> = () => {

  const { selectedTransaction }: { selectedTransaction: IExolixTransaction } = useSelector((state: RootState) => state.swap);

  return (
    <Container color={CONTAINER_COLOR.GRAY_LIGHT_300}>
      <ConfirmDetails
        transaction={selectedTransaction}
      />
    </Container>
  );
};

export default TransactionDetailsContainer;
