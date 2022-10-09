///////////////////////////
// Imports
///////////////////////////

import React, { FC, useEffect, useState, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';

///////////////////////
// Selectors
///////////////////////

import swapSelectors from 'selectors/swapSelectors';

///////////////////////////
// Types
///////////////////////////

import { RootState } from 'state/store';
import { ISearchCurrency, ICurrencyNetwork, } from 'state/swap/types';

///////////////////////////
// Types
///////////////////////////

import {
  ITokenListContainer
} from './types';

///////////////////////////
// Utils
///////////////////////////

import { getWalletController } from 'utils/controllersUtils';

///////////////////////////
// Components
///////////////////////////

import TokenList from './TokenList';
import Container from 'components/Container';

///////////////////////////
// Constants
///////////////////////////

import { SWAP_ACTIONS } from 'scenes/swap/constants';
const SWAP_FROM_TITLE = 'Swap From';
const SWAP_TO_TITLE = 'Swap To';

///////////////////////////
// Container
///////////////////////////

const TokenListContainer: FC<ITokenListContainer> = ({ navigation, route }) => {

  const walletController = getWalletController();
  const { action } = route.params
  const currencyData: ISearchCurrency[] = action === SWAP_ACTIONS.FROM ? useSelector((state: RootState) => state.swap.supportedAssets) : useSelector(swapSelectors.selectSupportedCurrencyData);
  const { loading }: { loading: boolean } = useSelector((state: RootState) => state.swap);
  const [searchValue, setSearchValue] = useState<string>('');
  useLayoutEffect(() => {
    navigation.setOptions({
      title: action === SWAP_ACTIONS.FROM ? SWAP_FROM_TITLE : SWAP_TO_TITLE,
    });
  }, []);

  useEffect(() => {
    if (action === SWAP_ACTIONS.FROM) {
      walletController.swap.getSupportedAssets();
    }
  }, []);

  useEffect(() => {
    if (action === SWAP_ACTIONS.TO) {
      walletController.swap.getCurrencyData(searchValue);
    }
  }, [searchValue]);

  const onTokenCellPressed = (currency: ISearchCurrency, network: ICurrencyNetwork) => {
    if (action === SWAP_ACTIONS.FROM) {
      walletController.swap.setSwapFrom(currency, network);
    } else if (action === SWAP_ACTIONS.TO) {
      walletController.swap.setSwapTo(currency, network);
    }
    navigation.pop();
  }

  return (
    <Container>
      <TokenList
        currencyData={currencyData}
        searchValue={searchValue}
        isLoading={loading}
        onTokenCellPressed={onTokenCellPressed}
        onSearchChange={setSearchValue}
        action={action}
      />
    </Container>
  );
};

export default TokenListContainer;
