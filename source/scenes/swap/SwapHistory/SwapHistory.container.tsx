
///////////////////////////
// Imports
///////////////////////////

import React, { useEffect, FC } from 'react';
import { useSelector } from 'react-redux';
import { useLinkTo } from '@react-navigation/native';

///////////////////////////
// Utils
///////////////////////////

import { getWalletController } from 'utils/controllersUtils';

///////////////////////
// Selectors
///////////////////////

import swapSelectors from 'selectors/swapSelectors';

///////////////////////////
// Types
///////////////////////////

import { RootState } from 'state/store';
import { IExolixTransaction } from 'state/swap/types'
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

const SwapHistoryContainer: FC<ISwapHistoryContainer> = () => {

  const linkTo = useLinkTo();
  const walletController = getWalletController();
  const transactionHistory = useSelector(swapSelectors.getTransactionHistory);
  const { loading }: { loading: boolean } = useSelector((state: RootState) => state.swap);
  
  useEffect(() => {
    walletController.swap.getTransactionHistory();
  }, [])

  const onTransactionCellPressed = (transaction: IExolixTransaction) => {
    walletController.swap.setSelectedTrasaction(transaction);
    linkTo(`/transactionDetails`);
  }

  return (
    <Container>
      <SwapHistory 
        transactionHistoryData={transactionHistory} 
        onTransactionCellPressed={onTransactionCellPressed}  
        isLoading={loading}
      />
    </Container>
  );
};

export default SwapHistoryContainer;
