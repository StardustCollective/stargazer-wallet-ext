///////////////////////////
// Components
///////////////////////////

import React, { useState, useLayoutEffect } from 'react';
import queryString from 'query-string';
import find from 'lodash/find';
import { useHistory } from "react-router-dom";
import { useLinkTo } from '@react-navigation/native';
import { useSelector } from 'react-redux';
// import { useAlert } from 'react-alert';

///////////////////////////
// Navigation
///////////////////////////

// import confirmHeader from 'navigation/headers/confirm';

///////////////////////////
// Components
///////////////////////////

import Container from 'components/Container';

///////////////////////////
// Types
///////////////////////////

import IVaultState, { AssetType, IWalletState, IActiveAssetState } from 'state/vault/types';
import IAssetListState, { IAssetInfoState } from 'state/assets/types';
import { ITransactionInfo } from 'scripts/types';

///////////////////////////
// Hooks
///////////////////////////

import { RootState } from 'state/store';
import { useFiat } from 'hooks/usePrice';

///////////////////////////
// Utils
///////////////////////////

import { getAccountController } from 'utils/controllersUtils';
import { confirmEvent } from 'utils/backgroundUtils';
import { showAlert } from 'utils/alertUtil';
///////////////////////////
// Scene
///////////////////////////

import Confirm from './Confirm';

///////////////////////////
// Container
///////////////////////////


const ConfirmContainer = ({ navigation }) => {

  let activeAsset: IAssetInfoState | IActiveAssetState;
  let activeWallet: IWalletState;
  let history: any;
  let isExternalRequest: boolean;

  if(!!location){
    isExternalRequest = location.pathname.includes('confirmTransaction');
  }

  const accountController = getAccountController();
  // const alert = useAlert();
  const linkTo = useLinkTo();
  const vault: IVaultState = useSelector(
    (state: RootState) => state.vault
  );
  const assets: IAssetListState = useSelector(
    (state: RootState) => state.assets
  );
  let assetInfo: IAssetInfoState;


  if (isExternalRequest) {
    const {
      to
    } = queryString.parse(location.search);

    activeAsset = useSelector(
      (state: RootState) => find(state.assets, { address: to })
    ) as IAssetInfoState;

    if (!activeAsset) {
      activeAsset = useSelector(
        (state: RootState) => find(state.assets, { type: AssetType.Ethereum })
      ) as IAssetInfoState;
    }

    activeWallet = vault.activeWallet;
    assetInfo = assets[activeAsset.id];

    history = useHistory();

  } else {

    activeAsset = vault.activeAsset;
    activeWallet = vault.activeWallet;

    assetInfo = assets[activeAsset.id];
    // Sets the header for the confirm screen.
    // useLayoutEffect(() => {
    //   navigation.setOptions(confirmHeader({ navigation, asset: assetInfo }));
    // }, []);

  }

  const getFiatAmount = useFiat(false, assetInfo);

  const feeUnit = assetInfo.type === AssetType.Constellation ? 'DAG' : 'ETH'

  const tempTx = accountController.getTempTx();
  const [confirmed, setConfirmed] = useState(false);
  const [disabled, setDisabled] = useState(false);


  const getSendAmount = () => {

    const fiatAmount = Number(getFiatAmount(Number(tempTx?.amount || 0), 8, assetInfo.priceId));

    return (fiatAmount).toLocaleString(navigator.language, {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    });
  }

  const getFeeAmount = () => {

    let priceId = assetInfo.priceId;

    if (activeAsset.type === AssetType.ERC20) {
      priceId = AssetType.Ethereum
    }

    return Number(getFiatAmount(Number(tempTx?.fee || 0), 8, priceId));

  }

  const getTotalAmount = () => {

    let amount = Number(getFiatAmount(Number(tempTx?.amount || 0), 8));
    amount += getFeeAmount();

    return (amount).toLocaleString(navigator.language, {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    });
  };

  const handleCancel = () => {
    if (isExternalRequest) {
      history.goBack();
    } else {
      linkTo('/send');
    }
  }

  const handleConfirm = async () => {
    setDisabled(true);

    try {
      if (isExternalRequest) {

        const { windowId } = queryString.parse(window.location.search);
        const confirm = await confirmEvent(windowId);

        const txConfig: ITransactionInfo = {
          fromAddress: tempTx.fromAddress,
          toAddress: tempTx.toAddress,
          timestamp: Date.now(),
          amount: tempTx.amount,
          ethConfig: tempTx.ethConfig,
          onConfirmed: () => {
            confirm();
          }
        };

        accountController.updateTempTx(txConfig);
        await accountController.confirmContractTempTx(activeAsset);

        if (window) {
          window.close();
        }
      } else {

        await accountController.confirmTempTx()
        setConfirmed(true);
      }
    } catch (error: any) {
      let message = error.message;
      if (error.message.includes('insufficient funds') && [AssetType.ERC20, AssetType.Ethereum].includes(assetInfo.type)) {
        message = 'Insufficient ETH to cover gas fee.';
      }
      showAlert(message, 'danger');
    }
  };

  return (
    <Container>
      <Confirm
        isExternalRequest={isExternalRequest}
        confirmed={confirmed}
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
      />
    </Container>
  );

}

export default ConfirmContainer;