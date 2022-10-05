///////////////////////////
// Imports
///////////////////////////

import React, { FC, useEffect, useState, useLayoutEffect} from 'react';
import { useSelector } from 'react-redux';

///////////////////////////
// State
///////////////////////////

import store from 'state/store';
import { getCurrencyData, getSupportedAssets} from 'state/swap/api';
import {setSwapFrom, setSwapTo} from 'state/swap';

///////////////////////
// Selectors
///////////////////////

import swapSelectors from 'selectors/swapSelectors';

///////////////////////////
// Types
///////////////////////////

import { RootState } from 'state/store';
import { ISearchCurrency, ICurrencyNetwork } from 'state/swap/types';

///////////////////////////
// Types
///////////////////////////

import {
  ITokenListContainer
} from './types';

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

const TokenListContainer: FC<ITokenListContainer> = ({navigation, route}) => {


  const { action } = route.params
  const currencyData: ISearchCurrency[] =  action === SWAP_ACTIONS.FROM ? useSelector(swapSelectors.getSupportedAssets) : useSelector(swapSelectors.selectSupportedCurrencyData);
  const { loading }: { loading: boolean } = useSelector((state: RootState) => state.swap);
  const [searchValue, setSearchValue ] = useState<string>('');

  useLayoutEffect(() => {
    navigation.setOptions({
      title: action === SWAP_ACTIONS.FROM ? SWAP_FROM_TITLE : SWAP_TO_TITLE,
    });
    if(action === SWAP_ACTIONS.FROM){
      store.dispatch<any>(getSupportedAssets());
    }
  }, []);

  useEffect(() => {
    if(action === SWAP_ACTIONS.TO){
      store.dispatch<any>(getCurrencyData(searchValue));
    }
  }, [searchValue]);

  const onTokenCellPressed = (currency: ISearchCurrency, network: ICurrencyNetwork ) => {
    if(action === SWAP_ACTIONS.FROM){
      store.dispatch(setSwapFrom({currency, network}));
    }else if(action === SWAP_ACTIONS.TO){
      store.dispatch(setSwapTo({currency, network}));
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
