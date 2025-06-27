import { useLinkTo } from '@react-navigation/native';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import Container, { CONTAINER_COLOR } from 'components/Container';

import { DEFAULT_LANGUAGE } from 'constants/index';

import { useFiat } from 'hooks/usePrice';

import { getNativeToken, getPriceId } from 'scripts/Background/controllers/EVMChainController/utils';
import { isError } from 'scripts/common';

import vaultSelectors from 'selectors/vaultSelectors';

import { initialState as initialStateAssets } from 'state/assets';
import IAssetListState, { IAssetInfoState } from 'state/assets/types';
import { RootState } from 'state/store';
import { AssetType, IActiveAssetState, IWalletState } from 'state/vault/types';

import { usePlatformAlert } from 'utils/alertUtil';
import { getAccountController } from 'utils/controllersUtils';

import Confirm from './Confirm';

export const DAG_SMALL_FEE = 0.002;

const ConfirmContainer = () => {
  const showAlert = usePlatformAlert();

  const [isModalVisible, setIsModalVisible] = useState(false);

  const accountController = getAccountController();

  const linkTo = useLinkTo();
  const activeAsset: IActiveAssetState = useSelector(vaultSelectors.getActiveAsset);
  const activeWallet: IWalletState = useSelector(vaultSelectors.getActiveWallet);
  const assets: IAssetListState = useSelector((state: RootState) => state.assets);

  const assetInfo: IAssetInfoState = assets[activeAsset.id];

  const getFiatAmount = useFiat(false, assetInfo);

  const assetNetwork = assets[activeAsset?.id]?.network || initialStateAssets[activeAsset?.id]?.network;
  const feeUnit = assetInfo.type === AssetType.Constellation ? assetInfo.symbol : getNativeToken(assetNetwork);

  const tempTx = accountController.getTempTx();
  const [confirmed, setConfirmed] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const isL0token = !!assetInfo?.l0endpoint;

  const getSendAmount = () => {
    const fiatAmount = Number(getFiatAmount(Number(tempTx?.amount || 0), 8, assetInfo.priceId));

    return fiatAmount.toLocaleString(DEFAULT_LANGUAGE, {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    });
  };

  const getFeeAmount = () => {
    const amount = getFeeAmountNumber();

    return amount.toLocaleString(DEFAULT_LANGUAGE, {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    });
  };

  const getFeeAmountNumber = () => {
    let { priceId } = assetInfo;

    if (activeAsset.type === AssetType.ERC20) {
      priceId = getPriceId(assetNetwork);
    }

    return Number(getFiatAmount(Number(tempTx?.fee || 0), 8, priceId));
  };

  const getTotalAmount = () => {
    if (isL0token) {
      const amount = Number(tempTx?.amount || 0) + Number(tempTx?.fee || 0);
      return amount.toFixed(2);
    }

    let amount = Number(getFiatAmount(Number(tempTx?.amount || 0), 8));
    amount += getFeeAmountNumber();

    return amount.toLocaleString(DEFAULT_LANGUAGE, {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    });
  };

  const getDagSmallFeeAmount = () => {
    return Number(getFiatAmount(DAG_SMALL_FEE, 8, 'constellation-labs')).toFixed(4);
  };

  const handleCancel = () => {
    linkTo('/send');
  };

  const handleConfirm = async () => {
    setDisabled(true);

    try {
      await accountController.confirmTempTx();
      setConfirmed(true);
    } catch (e) {
      if (isError(e)) {
        if (e.message.includes('insufficient funds') && [AssetType.ERC20, AssetType.Ethereum].includes(assetInfo.type)) {
          e.message = 'Insufficient funds to cover gas fee.';
        }

        if (e.message.includes('cannot send a transaction to itself')) {
          e.message = 'An address cannot send a transaction to itself';
        }

        if (e.message.includes('TransactionLimited') && assetInfo?.type === AssetType.Constellation) {
          setIsModalVisible(true);
        } else {
          showAlert(e.message, 'danger');
        }
        console.log('ERROR', e);
      }
      console.error(e);
    }
  };

  return (
    <Container color={CONTAINER_COLOR.EXTRA_LIGHT} showHeight>
      <Confirm
        confirmed={confirmed}
        activeAsset={activeAsset}
        tempTx={tempTx}
        assetInfo={assetInfo}
        getSendAmount={getSendAmount}
        activeWallet={activeWallet}
        feeUnit={feeUnit}
        getFeeAmount={getFeeAmount}
        getTotalAmount={getTotalAmount}
        handleCancel={handleCancel}
        handleConfirm={handleConfirm}
        disabled={disabled}
        isL0token={isL0token}
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        getDagSmallFeeAmount={getDagSmallFeeAmount}
      />
    </Container>
  );
};

export default ConfirmContainer;
