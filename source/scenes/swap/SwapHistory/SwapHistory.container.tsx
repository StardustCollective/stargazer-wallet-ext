///////////////////////////
// Imports
///////////////////////////

import React, { useEffect, FC, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLinkTo } from '@react-navigation/native';

///////////////////////////
// Components
///////////////////////////

import SwapHistory from './SwapHistory';
import Container from 'components/Container';

///////////////////////////
// Utils
///////////////////////////

import { getWalletController } from 'utils/controllersUtils';

///////////////////////////
// Navigation
///////////////////////////

import defaultHeader from 'navigation/headers/default';
import screens from 'navigation/screens';

///////////////////////
// Selectors
///////////////////////

import swapSelectors from 'selectors/swapSelectors';

///////////////////////////
// Types
///////////////////////////

import { RootState } from 'state/store';
import { IExolixTransaction } from 'state/swap/types';
import { ISwapHistoryContainer } from './types';
import { CONTAINER_COLOR } from 'components/Container/enum';

///////////////////////////
// Utils
///////////////////////////

import NavUtils from 'navigation/util';

///////////////////////////
// Container
///////////////////////////

const SwapHistoryContainer: FC<ISwapHistoryContainer> = ({ navigation }) => {
  const linkTo = useLinkTo();
  const walletController = getWalletController();
  const transactionHistory = useSelector(swapSelectors.getTransactionHistory);
  const { loading }: { loading: boolean } = useSelector((state: RootState) => state.swap);

  useEffect(() => {
    walletController.swap.getTransactionHistory();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions(
      defaultHeader({
        navigation,
        onBackPressed: () => {
          const routes = navigation.getState()?.routes;
          const prevRoute = routes[routes.length - 2];
          // If the user enters the Swap History from the
          // confirmation screen the user, and clicks the back button,
          // the user will be navigated to the home screen.
          if (prevRoute.name === screens.swap.confirmation) {
            NavUtils.popToTop(navigation);
          } else {
            navigation.goBack();
          }
        },
      })
    );
  }, []);

  const onTransactionCellPressed = (transaction: IExolixTransaction) => {
    walletController.swap.setSelectedTrasaction(transaction);
    linkTo(`/transactionDetails`);
  };

  return (
    <Container color={CONTAINER_COLOR.GRAY_LIGHT_300}>
      <SwapHistory
        transactionHistoryData={transactionHistory}
        onTransactionCellPressed={onTransactionCellPressed}
        isLoading={loading}
      />
    </Container>
  );
};

export default SwapHistoryContainer;
