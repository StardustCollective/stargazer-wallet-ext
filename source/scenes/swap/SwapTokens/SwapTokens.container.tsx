///////////////////////////
// Imports
///////////////////////////

import React, { useEffect, useState, FC, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLinkTo } from '@react-navigation/native';
import find from 'lodash/find';
import some from 'lodash/some';

///////////////////////
// Selectors
///////////////////////

import swapSelectors from 'selectors/swapSelectors';
import walletSelectors from 'selectors/walletsSelectors';
import historyHeader from 'navigation/headers/history';

///////////////////////////
// Utils
///////////////////////////

import { getWalletController } from 'utils/controllersUtils';

///////////////////////////
// Types
///////////////////////////

import { ISwapTokensContainer } from './types';
import { ISelectedCurrency, ICurrencyRate, IPendingTransaction } from 'state/swap/types';
import { RootState } from 'state/store';
import IVaultState, { AssetType, IAssetState } from 'state/vault/types';
import { CONTAINER_COLOR } from 'components/Container/enum';

///////////////////////////
// Components
///////////////////////////

import SwapTokens from './SwapTokens';
import Container from 'components/Container';

///////////////////////////
// Constants
///////////////////////////

import { LTX_DEFAULT_CURRENCY, DAG_DEFAULT_CURRENCY } from './constants';
import { SWAP_ACTIONS } from 'scenes/swap/constants';
const SELECT_CURRENCY_ROUTE = '/tokenList?action=';
const NEXT_SCREEN_ROUTE = '/transferInfo?';
const FROM_AMOUNT_ZERO = 0;
const TO_AMOUNT_ZERO = 0;
const DEFAULT_TO_AMOUNT = 0;

///////////////////////////
// Container
///////////////////////////

const SwapTokenContainer: FC<ISwapTokensContainer> = ({ navigation }) => {
  const linkTo = useLinkTo();
  const walletController = getWalletController();
  const [depositAsset, setDepositAsset] = useState<IAssetState>(null);
  const [refundAsset, setRefundAsset] = useState<IAssetState>(null);
  const [isBalanceError, setIsBalanceError] = useState<boolean>(false);
  const [fromAmount, setFromAmount] = useState<number>(0);
  const [isRateError, setIsRateError] = useState<boolean>(false);
  const [isNextButtonLoading, setIsNextButtonLoading] = useState<boolean>(false);
  const [isNextButtonDisabled, setIsNextButtonDisabled] = useState<boolean>(true);
  const { swapFrom, swapTo }: { swapTo: ISelectedCurrency; swapFrom: ISelectedCurrency } =
    useSelector((state: RootState) => state.swap);
  const { balances, activeWallet }: IVaultState = useSelector(
    (state: RootState) => state.vault
  );
  const fromBalance = balances[swapFrom.currency.id];
  const excludeDag = !some(activeWallet.assets, { type: AssetType.Constellation });
  const currencyRate: ICurrencyRate = useSelector(swapSelectors.getCurrencyRate);
  const isCurrencyRateLoading: boolean = useSelector(
    swapSelectors.getCurrencyRateLoading
  );
  const pendingSwap: IPendingTransaction = useSelector(swapSelectors.getPendingSwap);
  const activeNetworkAssets = useSelector(walletSelectors.selectActiveNetworkAssets);

  // Add the transaction history button to the header.
  useLayoutEffect(() => {
    const onRightIconClick = () => {
      linkTo('/swapHistory');
    };
    navigation.setOptions(historyHeader({ navigation, onRightIconClick }));
  }, []);

  // Get supported assets and set Default ToSwap Token.
  useEffect(() => {
    if (excludeDag) {
      walletController.swap.setSwapTo(
        LTX_DEFAULT_CURRENCY,
        LTX_DEFAULT_CURRENCY.networks[0]
      );
    } else {
      walletController.swap.setSwapTo(
        DAG_DEFAULT_CURRENCY,
        DAG_DEFAULT_CURRENCY.networks[0]
      );
    }
  }, []);

  // Update the active asset when the swapFrom state changes
  useEffect(() => {
    if (swapFrom.currency !== null) {
      const newActiveAsset = find(activeNetworkAssets, { id: swapFrom.currency.id });
      walletController.account.updateAccountActiveAsset(newActiveAsset);
    }
  }, [swapFrom]);

  // Set the deposit asset to be used for the withdrawal and refund addresses.
  useEffect(() => {
    if (swapFrom.currency !== null) {
      const assetName =
        swapFrom?.currency?.name.toLocaleLowerCase() === AssetType.Constellation
          ? AssetType.Constellation
          : AssetType.Ethereum;
      const depositAsset = find(activeNetworkAssets, { id: assetName });
      setRefundAsset(depositAsset);
    }
    if (swapTo.currency !== null) {
      const assetName =
        swapTo?.currency?.name.toLocaleLowerCase() === AssetType.Constellation
          ? AssetType.Constellation
          : AssetType.Ethereum;
      const depositAsset = find(activeNetworkAssets, { id: assetName });
      setDepositAsset(depositAsset);
    }
  }, [swapTo]);

  // Manages next button enabled or disabled state.
  useEffect(() => {
    if (
      swapFrom.currency.code !== null &&
      swapTo.currency.code !== null &&
      !isBalanceError &&
      !isRateError &&
      fromAmount > FROM_AMOUNT_ZERO &&
      currencyRate?.toAmount > TO_AMOUNT_ZERO
    ) {
      setIsNextButtonDisabled(false);
    } else {
      setIsNextButtonDisabled(true);
    }
  }, [swapFrom, swapTo, fromAmount, isBalanceError, isRateError, currencyRate]);

  // Updates the exchange rate when the from amount is changes.
  useEffect(() => {
    let delayDebounceFn: any = null;
    if (
      swapFrom.currency.code !== null &&
      swapTo.currency.code !== null &&
      fromAmount > 0
    ) {
      delayDebounceFn = setTimeout(() => {
        walletController.swap.getCurrencyRate({
          coinFromCode: swapFrom.currency.code,
          coinFromNetwork: swapFrom.network.network,
          coinToCode: swapTo.currency.code,
          coinToNetwork: swapTo.network.network,
          amount: fromAmount,
        });
      }, 500);
    }
    return () => clearTimeout(delayDebounceFn);
  }, [fromAmount]);

  // Updates the exchange rate when the swapFrom and swapTo changes.
  useEffect(() => {
    // Clear the existing exhange rate estimates
    walletController.swap.clearCurrencyRate();
    if (
      swapFrom.currency.code !== null &&
      swapTo.currency.code !== null &&
      fromAmount > 0
    ) {
      walletController.swap.getCurrencyRate({
        coinFromCode: swapFrom.currency.code,
        coinFromNetwork: swapFrom.network.network,
        coinToCode: swapTo.currency.code,
        coinToNetwork: swapTo.network.network,
        amount: fromAmount,
      });
    }
  }, [swapFrom?.currency?.code, swapTo?.currency?.code]);

  // Check if currency rate is valid.
  useEffect(() => {
    if (currencyRate?.message?.length > 0) {
      setIsRateError(true);
    } else {
      setIsRateError(false);
    }
  }, [currencyRate]);

  // Will wait until a pending swap state has been populated
  // before transitioning to the next screen.
  useEffect(() => {
    if (pendingSwap !== null) {
      linkTo(`${NEXT_SCREEN_ROUTE}`);
      setIsNextButtonLoading(false);
    }
  }, [pendingSwap?.id]);

  // Check if the balance is valid.
  useEffect(() => {
    if (fromAmount > parseFloat(fromBalance)) {
      setIsBalanceError(true);
    } else {
      setIsBalanceError(false);
    }
  }, [fromAmount, swapFrom, swapTo]);

  const onNextPressed = () => {
    setIsNextButtonLoading(true);
    walletController.swap.stageTransaction({
      coinFrom: swapFrom.currency.code,
      networkFrom: swapFrom.network.network,
      coinTo: swapTo.currency.code,
      networkTo: swapTo.network.network,
      amount: currencyRate?.fromAmount,
      withdrawalAddress: depositAsset.address,
      refundAddress: refundAsset.address,
    });
  };

  const onSwapFromTokenListPressed = () => {
    linkTo(`${SELECT_CURRENCY_ROUTE}${SWAP_ACTIONS.FROM}`);
  };

  const onSwapToTokenListPressed = () => {
    linkTo(`${SELECT_CURRENCY_ROUTE}${SWAP_ACTIONS.TO}`);
  };

  const onFromChangeText = (text: string) => {
    const fromAmount = parseFloat(text.replaceAll(',', '.'));
    setFromAmount(fromAmount);
  };

  return (
    <Container color={CONTAINER_COLOR.GRAY_LIGHT_300}>
      <SwapTokens
        selectedCurrencySwapFrom={swapFrom.currency}
        selectedCurrencySwapTo={swapTo.currency}
        onSwapFromTokenListPressed={onSwapFromTokenListPressed}
        onSwapToTokenListPressed={onSwapToTokenListPressed}
        onNextPressed={onNextPressed}
        fromBalance={fromBalance}
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
