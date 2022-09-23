///////////////////////////
// Imports
///////////////////////////

import React, { FC, useEffect, useState, useLayoutEffect} from 'react';
import { useSelector } from 'react-redux';

///////////////////////////
// Redux
///////////////////////////

import store from 'state/store';

///////////////////////////
// State
///////////////////////////

import { getCurrencyData } from 'state/swapping/api';
import {setSwapFrom, setSwapTo} from 'state/swapping';

///////////////////////
// Selectors
///////////////////////

import walletSelectors from 'selectors/walletsSelectors';

///////////////////////////
// Types
///////////////////////////

import { RootState } from 'state/store';
import { ISearchCurrency, ICurrencyNetwork } from 'state/swapping/types';

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

import { SWAP_FROM_ACTION, SWAP_TO_ACTION } from 'scenes/swap/constants';
const SWAP_FROM_TITLE = 'Swap From';
const SWAP_TO_TITLE = 'Swap To';

///////////////////////////
// Container
///////////////////////////

const TokenListContainer: FC<ITokenListContainer> = ({navigation, route}) => {


  const { action } = route.params
  const { currencyData }: {currencyData: ISearchCurrency[]} = useSelector((state: RootState) => state.swapping);
  const { loading }: { loading: boolean } = useSelector((state: RootState) => state.swapping);
  const activeNetworkAssets = useSelector(walletSelectors.selectActiveNetworkAssets);
  const [searchValue, setSearchValue ] = useState<string>('');

  useLayoutEffect(() => {
    navigation.setOptions({
      title: action === SWAP_FROM_ACTION ? SWAP_FROM_TITLE : SWAP_TO_TITLE,
    });
  }, []);

  useEffect(() => {
    store.dispatch<any>(getCurrencyData(searchValue));
  }, [searchValue]);

  const onTokenCellPressed = (currency: ISearchCurrency, network: ICurrencyNetwork ) => {
    if(action === SWAP_FROM_ACTION){
      store.dispatch(setSwapFrom({currency, network}));
    }else if(action === SWAP_TO_ACTION){
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
        activeNetworkAssets={activeNetworkAssets}
      />
    </Container>
  );
};

export default TokenListContainer;
