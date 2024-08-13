import React, { FC, useState } from 'react';

///////////////////////////
// Imports
///////////////////////////

import { useLinkTo } from '@react-navigation/native';
import { useSelector } from 'react-redux';

///////////////////////////
// Hooks
///////////////////////////

import { useFiat } from 'hooks/usePrice';

///////////////////////////
// Types
///////////////////////////

import { RootState } from 'state/store';
import { ISwapTokensContainer } from './types';
import { AssetType } from 'state/vault/types';
import { IPendingTransaction } from 'state/swap/types';
import { CONTAINER_COLOR } from 'components/Container/enum';

///////////////////////
// Selectors
///////////////////////

import walletSelectors from 'selectors/walletsSelectors';
import swapSelectors from 'selectors/swapSelectors';

///////////////////////////
// Utils
///////////////////////////

import {
  getNativeToken,
  getPriceId,
} from 'scripts/Background/controllers/EVMChainController/utils';
import { getAccountController } from 'utils/controllersUtils';
import { getWalletController } from 'utils/controllersUtils';
import NavUtils from 'navigation/util';

///////////////////////////
// Components
///////////////////////////

import ConfirmDetails from './ConfirmDetails';
import Container from 'components/Container';

///////////////////////////
// Constants
///////////////////////////

import { DEFAULT_LANGUAGE } from 'constants/index';

const ConfirmDetailsContainer: FC<ISwapTokensContainer> = ({ navigation }) => {
  const accountController = getAccountController();
  const walletController = getWalletController();
  const tempTx = accountController.getTempTx();
  const assets = useSelector((state: RootState) => state.assets);
  const { activeWallet } = useSelector((state: RootState) => state.vault);
  const activeAsset = useSelector(walletSelectors.getActiveAsset);
  const pendingSwap: IPendingTransaction = useSelector(swapSelectors.getPendingSwap);
  const assetInfo = assets[activeAsset.id];
  const getFiatAmount = useFiat(false, assetInfo);
  const assetNetwork = assets[activeAsset?.id]?.network;
  const linkTo = useLinkTo();
  const feeUnit =
    assetInfo.type === AssetType.Constellation ? 'DAG' : getNativeToken(assetNetwork);
  const [isSwapButtonLoading, setIsSwapButtonLoading] = useState<boolean>(false);

  const getSendAmount = () => {
    const fiatAmount = Number(
      getFiatAmount(Number(tempTx?.amount || 0), 8, assetInfo.priceId)
    );

    return fiatAmount.toLocaleString(DEFAULT_LANGUAGE, {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    });
  };

  const getFeeAmount = () => {
    let priceId = assetInfo.priceId;

    if (activeAsset.type === AssetType.ERC20) {
      priceId = getPriceId(assetNetwork);
    }

    return Number(getFiatAmount(Number(tempTx?.fee || 0), 8, priceId));
  };

  const getTotalAmount = () => {
    let amount = Number(getFiatAmount(Number(tempTx?.amount || 0), 8));
    amount += getFeeAmount();

    return amount.toLocaleString(DEFAULT_LANGUAGE, {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    });
  };

  const onSwapPressed = async () => {
    setIsSwapButtonLoading(true);
    await accountController.confirmTempTx();
    walletController.swap.addTxId(pendingSwap.id);
    linkTo('/confirmation');
  };

  const onCancelPressed = () => {
    NavUtils.popToTop(navigation);
  };

  return (
    <Container color={CONTAINER_COLOR.GRAY_LIGHT_300}>
      <ConfirmDetails
        tempTx={tempTx}
        assetInfo={assetInfo}
        activeWallet={activeWallet}
        feeUnit={feeUnit}
        transactionId={pendingSwap?.id}
        getSendAmount={getSendAmount}
        getFeeAmount={getFeeAmount}
        getTotalAmount={getTotalAmount}
        onSwapPressed={onSwapPressed}
        onCancelPressed={onCancelPressed}
        isSwapButtonLoading={isSwapButtonLoading}
      />
    </Container>
  );
};

export default ConfirmDetailsContainer;
