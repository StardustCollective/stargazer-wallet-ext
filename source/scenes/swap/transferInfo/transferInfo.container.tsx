///////////////////////////
// Imports
///////////////////////////

import React, { useEffect, FC } from 'react';
import { useLinkTo } from '@react-navigation/native';
import { useSelector } from 'react-redux';

///////////////////////////
// Controllers
///////////////////////////

import { getPriceId } from 'scripts/Background/controllers/EVMChainController/utils';


///////////////////////
// Selectors
///////////////////////

import walletSelectors from 'selectors/walletsSelectors';

///////////////////////
// Hooks
///////////////////////

import useGasEstimate from 'hooks/useGasEstimate';
import { useFiat } from 'hooks/usePrice';

///////////////////////////
// State
///////////////////////////

import store from 'state/store';
import { clearPendingSwap } from 'state/swap';

///////////////////////
// Selectors
///////////////////////

import swapSelectors from 'selectors/swapSelectors';

///////////////////////////
// Types
///////////////////////////

import { RootState } from 'state/store';
import { ITransactionInfo } from 'scripts/types';
import { AssetType } from 'state/vault/types';
import { ISelectedCurrency, IPendingTransaction } from 'state/swap/types';
import {
  ISwapTokensContainer
} from './types';

///////////////////////////
// Components
///////////////////////////

import TransferInfo from './TransferInfo';
import Container from 'components/Container';

///////////////////////////
// Utils
///////////////////////////

import { getAccountController } from 'utils/controllersUtils';

const SwapTokenContainer: FC<ISwapTokensContainer> = () => {

  const linkTo = useLinkTo();
  const { swapFrom, swapTo }: { swapTo: ISelectedCurrency, swapFrom: ISelectedCurrency } = useSelector((state: RootState) => state.swap);
  const assets = useSelector((state: RootState) => state.assets);
  const activeAsset = useSelector(walletSelectors.getActiveAsset);
  const asset  = assets[activeAsset.id];
  const pendingSwap: IPendingTransaction = useSelector(swapSelectors.getPendingSwap);
  const getFiatAmount = useFiat(true, asset);
  const basePriceId = getPriceId(asset.network);
  const accountController = getAccountController();
  let gas: string;
  
  useEffect(() => {
    return () => {
      store.dispatch(clearPendingSwap());
    }
  }, [])

  const { estimateGasFee, gasSpeedLabel, gasFee, setGasPrice, gasPrices, gasPrice, gasLimit } = useGasEstimate({
    toAddress: pendingSwap.depositAddress,
    fromAddress: asset.address,
    asset,
    gas,
  });

  const onGasPriceChange = (_: any, val: number | number[]) => {
    val = Number(val) || 1;
    setGasPrice(val as number);
    estimateGasFee(val as number);
  };

  const onNextPressed = () => {
    const txConfig: ITransactionInfo = {
      fromAddress: activeAsset.address,
      toAddress: pendingSwap.depositAddress,
      timestamp: Date.now(),
      amount: pendingSwap.amount.toString(),
      fee: gasFee,// || fee,
    };
    if (asset.type === AssetType.Ethereum || asset.type === AssetType.ERC20) {
      txConfig.ethConfig = {
        gasPrice,
        gasLimit
      };
    }

    accountController.updateTempTx(txConfig);

    linkTo('/confirmDetails');
  }

  return (
    <Container>
      <TransferInfo
        depositAddress={pendingSwap.depositAddress}
        from={{
          code: swapFrom.currency.code,
          amount: pendingSwap.amount
        }}
        to={{
          code: swapTo.currency.code,
          amount: pendingSwap.amountTo,
        }}
        gas={{
          prices: gasPrices,
          price: gasPrice,
          fee: gasFee,
          speedLabel: gasSpeedLabel,
          basePriceId: basePriceId
        }}
        getFiatAmount={getFiatAmount}
        onGasPriceChange={onGasPriceChange}
        onNextPressed={onNextPressed}
      />
    </Container>
  );
};

export default SwapTokenContainer;
