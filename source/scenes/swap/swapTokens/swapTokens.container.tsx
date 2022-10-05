///////////////////////////
// Imports
///////////////////////////

import React, { useEffect, useState, FC } from 'react';
import { useSelector } from 'react-redux';
import { useLinkTo } from '@react-navigation/native';
import find from 'lodash/find';

///////////////////////
// Selectors
///////////////////////

import swapSelectors from 'selectors/swapSelectors';
import walletSelectors from 'selectors/walletsSelectors';

///////////////////////////
// State
///////////////////////////

import store from 'state/store';
import { changeActiveAsset } from 'state/vault';
import { getCurrencyRate, sendTransaction } from 'state/swap/api';

///////////////////////////
// Types
///////////////////////////

import { ISwapTokensContainer } from './types';
import { ISelectedCurrency, ICurrencyRate, IPendingTransaction } from 'state/swap/types';
import { RootState } from 'state/store';

///////////////////////////
// Components
///////////////////////////

import SwapTokens from './SwapTokens';
import Container from 'components/Container';

///////////////////////////
// Constants
///////////////////////////

import { SWAP_ACTIONS } from 'scenes/swap/constants';
const SELECT_CURRENCY_ROUTE = '/tokenList?action=';
const NEXT_SCREEN_ROUTE = '/transferInfo?';
const FROM_AMOUNT_ZERO = 0;
const DEFAULT_TO_AMOUNT = 0;

///////////////////////////
// Container
///////////////////////////

const SwapTokenContainer: FC<ISwapTokensContainer> = () => {

  const linkTo = useLinkTo();
  const [isBalanceError, setIsBalanceError] = useState<boolean>(false);
  const [fromAmount, setFromAmount] = useState<number>(0);
  const [isRateError, setIsRateError] = useState<boolean>(false);
  const [isNextButtonLoading, setIsNextButtonLoading] = useState<boolean>(false);
  const [isNextButtonDisabled, setIsNextButtonDisabled] = useState<boolean>(true);
  const { swapFrom, swapTo }: { swapTo: ISelectedCurrency, swapFrom: ISelectedCurrency } = useSelector((state: RootState) => state.swap);
  const currencyRate: ICurrencyRate = useSelector(swapSelectors.getCurrencyRate);
  const isCurrencyRateLoading: boolean = useSelector(swapSelectors.getCurrencyRateLoading);
  const pendingSwap: IPendingTransaction = useSelector(swapSelectors.getPendingSwap);
  const activeNetworkAssets = useSelector(walletSelectors.selectActiveNetworkAssets);
  const activeAsset = useSelector(walletSelectors.getActiveAsset);

  // Update the active asset when the swapFrom state changes
  useEffect(() => {
    if(swapFrom.currency !== null){
      const newActiveAsset = find(activeNetworkAssets, {id: swapFrom.currency.id })
      store.dispatch(changeActiveAsset(newActiveAsset));
    }
  }, [swapFrom])

  // Manages next button enabled or disabled state.
  useEffect(() => {
    if (swapFrom.currency.code !== null &&
      swapTo.currency.code !== null &&
      !isBalanceError &&
      !isRateError &&
      fromAmount > FROM_AMOUNT_ZERO
    ) {
      setIsNextButtonDisabled(false);
    } else {
      setIsNextButtonDisabled(true);
    }
  }, [swapFrom, swapTo, fromAmount, isBalanceError, isRateError]);

  // Updates the exchange rate when the amount is changed.
  useEffect(() => {
    if (swapFrom.currency.code !== null &&
      swapTo.currency.code !== null &&
      fromAmount > 0) {
      store.dispatch<any>(getCurrencyRate({
        coinFrom: swapFrom.currency.code,
        coinTo: swapTo.currency.code,
        amount: fromAmount
      }));
    }
  }, [swapFrom, swapTo, fromAmount]);

  // Check if currency rate is valid.
  useEffect(() => {
    if (currencyRate?.message?.length > 0) {
      setIsRateError(true);
    } else {
      setIsRateError(false);
    }
  }, [currencyRate]);

  // Will wait until a pending swap state has been populated
  // before mcing to the next screen.
  useEffect(() => {
    if (pendingSwap !== null) {
      linkTo(`${NEXT_SCREEN_ROUTE}`);
      setIsNextButtonLoading(false);
    }
  }, [pendingSwap])

  const onNextPressed = () => {
    
    setIsNextButtonLoading(true);
    store.dispatch<any>(sendTransaction({
      coinFrom: swapFrom.currency.code,
      coinTo: swapTo.currency.code,
      amount: currencyRate?.fromAmount,
      withdrawalAddress: activeAsset.address,
      refundAddress: activeAsset.address
    }));
  }

  const onSwapFromTokenListPressed = () => {
    linkTo(`${SELECT_CURRENCY_ROUTE}${SWAP_ACTIONS.FROM}`);
  }

  const onSwapToTokenListPressed = () => {
    linkTo(`${SELECT_CURRENCY_ROUTE}${SWAP_ACTIONS.TO}`);
  }

  const onFromChangeText = (text: string) => {
    const fromAmount = parseFloat(text);
    setFromAmount(fromAmount);
    if (fromAmount > parseFloat(swapFrom.currency.balance)) {
      setIsBalanceError(true);
    } else {
      setIsBalanceError(false);
    }
  }

  return (
    <Container>
      <SwapTokens
        selectedCurrencySwapFrom={swapFrom.currency}
        selectedCurrencySwapTo={swapTo.currency}
        onSwapFromTokenListPressed={onSwapFromTokenListPressed}
        onSwapToTokenListPressed={onSwapToTokenListPressed}
        onNextPressed={onNextPressed}
        fromBalance={swapFrom.currency.balance}
        onFromChangeText={onFromChangeText}
        isBalanceError={isBalanceError}
        isNextButtonDisabled={isNextButtonDisabled}
        isRateError={isRateError}
        currencyRate={currencyRate}
        toAmount={currencyRate?.toAmount || DEFAULT_TO_AMOUNT}
        isNextButtonLoading={isNextButtonLoading}
        isCurrencyRateLoading={isCurrencyRateLoading}
      />
    </Container>
  );
};

export default SwapTokenContainer;
