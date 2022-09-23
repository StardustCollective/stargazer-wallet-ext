///////////////////////////
// Imports
///////////////////////////

import React, { useEffect, useState, FC } from 'react';
import { useSelector } from 'react-redux';
import { useLinkTo } from '@react-navigation/native';

///////////////////////////
// Types
///////////////////////////

import { ISwapTokensContainer } from './types';
import { ISelectedCurrency } from 'state/swap/types';
import { RootState } from 'state/store';

///////////////////////////
// Components
///////////////////////////

import SwapTokens from './swapTokens';
import Container from 'components/Container';

///////////////////////////
// Constants
///////////////////////////

import { SWAP_FROM_ACTION, SWAP_TO_ACTION } from 'scenes/swap/constants';
const SELECT_CURRENCY_ROUTE = '/tokenList?action=';
const NEXT_SCREEN_ROUTE = '/transferInfo';

///////////////////////////
// Container
///////////////////////////

const SwapTokenContainer: FC<ISwapTokensContainer> = ({navigation, route}) => {
  
  const linkTo = useLinkTo();
  const { swapTo, swapFrom }: {swapTo: ISelectedCurrency, swapFrom: ISelectedCurrency} = useSelector((state: RootState) => state.swap);

  const onNextPressed = () => {
    linkTo(NEXT_SCREEN_ROUTE);
  }

  const onSwapFromTokenListPressed = () => {
    linkTo(`${SELECT_CURRENCY_ROUTE}${SWAP_FROM_ACTION}`);
  }

  const onSwapToTokenListPressed = () => {
    linkTo(`${SELECT_CURRENCY_ROUTE}${SWAP_TO_ACTION}`);
  }

  return (
    <Container>
      <SwapTokens
        selectedCurrencySwapFrom={swapFrom.currency}
        selectedCurrencySwapTo={swapTo.currency}
        onSwapFromTokenListPressed={onSwapFromTokenListPressed}
        onSwapToTokenListPressed={onSwapToTokenListPressed}
        onNextPressed={onNextPressed} 
      />
    </Container>
  );
};

export default SwapTokenContainer;
