///////////////////////////
// Imports
///////////////////////////

import React, { FC, useEffect, useState, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import some from 'lodash/some';

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

import { ITokenListContainer } from './types';
import { CONTAINER_COLOR } from 'components/Container/enum';
import IVaultState from 'state/vault/types';
import { AssetType } from 'state/vault/types';

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
  const { action } = route.params;
  const { balances, activeWallet }: IVaultState = useSelector(
    (state: RootState) => state.vault
  );
  const excludeDag = !some(activeWallet.assets, { type: AssetType.Constellation });
  const currencyData: ISearchCurrency[] =
    action === SWAP_ACTIONS.FROM
      ? useSelector((state: RootState) => state.swap.supportedAssets)
      : excludeDag
      ? useSelector(swapSelectors.selectSupportedCurrencyData(excludeDag))
      : useSelector(swapSelectors.selectSupportedCurrencyData());
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
  }, []);

  useEffect(() => {
    let delayDebounceFn: any = null;
    if (action === SWAP_ACTIONS.TO && searchValue !== '') {
      delayDebounceFn = setTimeout(() => {
        walletController.swap.getCurrencyData(searchValue);
      }, 500);
    }
    return () => clearTimeout(delayDebounceFn);
  }, [searchValue]);

  const onTokenCellPressed = (currency: ISearchCurrency, network: ICurrencyNetwork) => {
    if (action === SWAP_ACTIONS.FROM) {
      walletController.swap.setSwapFrom(currency, network);
    } else if (action === SWAP_ACTIONS.TO) {
      walletController.swap.setSwapTo(currency, network);
    }
    navigation.pop();
  };

  return (
    <Container color={CONTAINER_COLOR.GRAY_LIGHT_300}>
      <TokenList
        currencyData={currencyData}
        searchValue={searchValue}
        isLoading={loading}
        onTokenCellPressed={onTokenCellPressed}
        onSearchChange={setSearchValue}
        action={action}
        balances={balances}
      />
    </Container>
  );
};

export default TokenListContainer;
