///////////////////////////
// Imports
///////////////////////////

import React, { useEffect, FC, useState } from 'react';
import { useLinkTo } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { BigNumber, ethers } from 'ethers';

///////////////////////////
// Util
///////////////////////////

import { usePlatformAlert } from 'utils/alertUtil';
import { getNativeToken } from 'scripts/Background/controllers/EVMChainController/utils';

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

///////////////////////
// Selectors
///////////////////////

import swapSelectors from 'selectors/swapSelectors';

///////////////////////////
// Types
///////////////////////////

import { RootState } from 'state/store';
import { ITransactionInfo } from 'scripts/types';
import { AssetType, AssetBalances } from 'state/vault/types';
import { IAssetInfoState } from 'state/assets/types';
import { ISelectedCurrency, IPendingTransaction } from 'state/swap/types';
import { ISwapTokensContainer } from './types';
import { CONTAINER_COLOR } from 'components/Container/enum';

///////////////////////////
// Components
///////////////////////////

import TransferInfo from './TransferInfo';
import Container from 'components/Container';

///////////////////////////
// Utils
///////////////////////////

import { getWalletController } from 'utils/controllersUtils';
import { getAccountController } from 'utils/controllersUtils';

///////////////////////////
// Container
///////////////////////////

const SwapTokenContainer: FC<ISwapTokensContainer> = () => {
  const linkTo = useLinkTo();
  const alert = usePlatformAlert();
  const walletController = getWalletController();
  const { swapFrom, swapTo }: { swapTo: ISelectedCurrency; swapFrom: ISelectedCurrency } =
    useSelector((state: RootState) => state.swap);
  const assets = useSelector((state: RootState) => state.assets);
  const activeAsset = useSelector(walletSelectors.getActiveAsset);
  const vault = useSelector((state: RootState) => state.vault);
  const pendingSwap: IPendingTransaction = useSelector(swapSelectors.getPendingSwap);
  const asset: IAssetInfoState = assets[activeAsset.id];
  const balances: AssetBalances = vault.balances;
  const basePriceId = getPriceId(asset.network);
  const accountController = getAccountController();
  const feeUnit =
    asset.type === AssetType.Constellation ? 'DAG' : getNativeToken(asset.network);
  const [fee, setFee] = useState<number>(0);
  let gas: string;

  const {
    setSendAmount,
    estimateGasFee,
    gasSpeedLabel,
    gasFee,
    setGasPrice,
    gasPrices,
    gasPrice,
    gasLimit,
  } = useGasEstimate({
    toAddress: pendingSwap?.depositAddress,
    fromAddress: asset?.address,
    asset,
    gas,
  });

  useEffect(() => {
    setSendAmount(pendingSwap?.amount.toString());
    return () => {
      walletController.swap.clearPendingSwap();
    };
  }, []);

  const onGasPriceChange = (_: any, val: number | number[]) => {
    val = Number(val) || 1;
    setGasPrice(val as number);
    estimateGasFee(val as number);
  };

  const getBalanceAndFees = () => {
    let balance;
    let balanceBN;
    let txFee;
    try {
      if (balances) {
        balance = balances[activeAsset.id] || '0';
        balanceBN = ethers.utils.parseUnits(balance.toString(), asset.decimals);
      }

      txFee =
        activeAsset.id === AssetType.Constellation ||
        activeAsset.id === AssetType.LedgerConstellation
          ? ethers.utils.parseUnits(fee.toString(), asset.decimals)
          : ethers.utils.parseEther(gasFee.toString());
    } catch (err) {}

    return { balance: balanceBN, txFee };
  };

  const overBalanceError = (): boolean => {
    let computedAmount: BigNumber;
    const amountBN = ethers.utils.parseUnits(
      String(pendingSwap?.amount || 0),
      asset.decimals
    );

    const { balance, txFee } = getBalanceAndFees();

    if (asset.type === AssetType.ERC20) {
      computedAmount = amountBN;
    } else if (txFee) {
      computedAmount = amountBN.add(txFee);
    }

    return computedAmount.gt(balance);
  };

  const onNextPressed = () => {
    if (overBalanceError()) {
      alert(
        `Error: Balance is too low to cover gas. Add ${feeUnit} to your wallet to complete the transaction.`,
        'danger'
      );
      return;
    }
    const txConfig: ITransactionInfo = {
      fromAddress: activeAsset.address,
      toAddress: pendingSwap.depositAddress,
      timestamp: Date.now(),
      amount: pendingSwap.amount.toString(),
      fee: fee || gasFee,
    };
    if (asset.type === AssetType.Ethereum || asset.type === AssetType.ERC20) {
      txConfig.ethConfig = {
        gasPrice,
        gasLimit,
      };
    }
    accountController.updateTempTx(txConfig);
    linkTo('/confirmDetails');
  };

  const onRecommendedPress = () => {};

  const onTransactionFeeChange = (fee: string) => {
    setFee(parseFloat(fee === '' ? '0' : fee));
  };

  return (
    <Container color={CONTAINER_COLOR.GRAY_LIGHT_300}>
      <TransferInfo
        asset={asset}
        depositAddress={pendingSwap?.depositAddress}
        from={{
          code: swapFrom?.currency.code,
          amount: pendingSwap?.amount,
        }}
        to={{
          code: swapTo?.currency.code,
          amount: pendingSwap?.amountTo,
        }}
        gas={{
          prices: gasPrices,
          price: gasPrice,
          fee: gasFee,
          speedLabel: gasSpeedLabel,
          basePriceId: basePriceId,
        }}
        onGasPriceChange={onGasPriceChange}
        onNextPressed={onNextPressed}
        onRecommendedPress={onRecommendedPress}
        onTransactionFeeChange={onTransactionFeeChange}
        fee={fee}
      />
    </Container>
  );
};

export default SwapTokenContainer;
