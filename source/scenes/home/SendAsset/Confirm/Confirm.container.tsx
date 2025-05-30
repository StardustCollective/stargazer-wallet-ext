///////////////////////////
// Components
///////////////////////////

import React, { useState } from 'react';
import find from 'lodash/find';
import { useHistory } from 'react-router-dom';
import { useLinkTo } from '@react-navigation/native';
import { useSelector } from 'react-redux';

///////////////////////////
// Navigation
///////////////////////////

// import confirmHeader from 'navigation/headers/confirm';

///////////////////////////
// Components
///////////////////////////

import Container, { CONTAINER_COLOR } from 'components/Container';

///////////////////////////
// Types
///////////////////////////

import IVaultState, {
  AssetType,
  IWalletState,
  IActiveAssetState,
} from 'state/vault/types';
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

import {
  getNativeToken,
  getPriceId,
} from 'scripts/Background/controllers/EVMChainController/utils';
import { getAccountController } from 'utils/controllersUtils';
import { usePlatformAlert } from 'utils/alertUtil';
import { StargazerChain, StargazerRequestMessage, isError } from 'scripts/common';
import { CHAIN_FULL_ASSET } from 'utils/assetsUtil';

///////////////////////////
// Selectors
///////////////////////////

import walletSelectors from 'selectors/walletsSelectors';

///////////////////////////
// Scene
///////////////////////////

///////////////////////////
// Constants
///////////////////////////

import { initialState as initialStateAssets } from 'state/assets';
import { StargazerExternalPopups } from 'scripts/Background/messaging';
import { DEFAULT_LANGUAGE } from 'constants/index';
import Confirm from './Confirm';
import { getHardwareWalletPage, isHardware } from 'utils/hardware';
import { ExternalRoute } from 'web/pages/External/types';

export const DAG_SMALL_FEE = 0.002;

///////////////////////////
// Container
///////////////////////////

const ConfirmContainer = () => {
  const showAlert = usePlatformAlert();

  const [isModalVisible, setIsModalVisible] = useState(false);

  let activeAsset: IAssetInfoState | IActiveAssetState;
  let activeWallet: IWalletState;
  const activeWalletPublicKey: any = useSelector(
    walletSelectors.selectActiveAssetPublicKey
  );
  const activeWalletDeviceId: any = useSelector(
    walletSelectors.selectActiveAssetDeviceId
  );
  let history: any;
  let isExternalRequest: boolean;
  let isTransfer = false;

  if (location) {
    isExternalRequest = location.pathname.includes(ExternalRoute.ConfirmTransaction);
  }

  const accountController = getAccountController();
  // const alert = useAlert();
  const linkTo = useLinkTo();
  const vault: IVaultState = useSelector((state: RootState) => state.vault);
  const assets: IAssetListState = useSelector((state: RootState) => state.assets);
  let assetInfo: IAssetInfoState;
  const vaultActiveAsset = vault.activeAsset;

  if (isExternalRequest) {
    const { data } = StargazerExternalPopups.decodeRequestMessageLocationParams<{
      isTransfer: boolean;
    }>(location.href);
    const { to, chain, metagraphAddress } = StargazerExternalPopups.decodeLocationParams(
      location.href
    );

    isTransfer = data.isTransfer;

    activeAsset = useSelector((state: RootState) =>
      find(state.assets, { address: Array.isArray(to) ? to[0] : to })
    ) as IAssetInfoState;

    if (!activeAsset) {
      if (!chain) {
        // Set ETH as the default activeAsset if 'chain' is not provided
        activeAsset = useSelector((state: RootState) =>
          find(state.assets, { id: AssetType.Ethereum })
        ) as IAssetInfoState;
      }

      if (chain === StargazerChain.CONSTELLATION && !!metagraphAddress) {
        activeAsset = useSelector((state: RootState) =>
          find(state.assets, { address: metagraphAddress as string })
        ) as IAssetInfoState;
      } else {
        activeAsset = CHAIN_FULL_ASSET[chain as keyof typeof CHAIN_FULL_ASSET];
      }
    }

    if (!vaultActiveAsset || activeAsset.id !== vaultActiveAsset.id) {
      // Update activeAsset so NetworkController doesn't fail
      accountController.updateAccountActiveAsset(activeAsset);
    }

    activeWallet = vault.activeWallet;
    assetInfo = assets[activeAsset.id] || initialStateAssets[activeAsset.id];

    history = useHistory();
  } else {
    activeAsset = vault.activeAsset;
    activeWallet = vault.activeWallet;
    assetInfo = assets[activeAsset.id];
  }

  const getFiatAmount = useFiat(false, assetInfo);

  const assetNetwork =
    assets[activeAsset?.id]?.network || initialStateAssets[activeAsset?.id]?.network;
  const feeUnit =
    assetInfo.type === AssetType.Constellation
      ? assetInfo.symbol
      : getNativeToken(assetNetwork);

  const tempTx = accountController.getTempTx();
  const [confirmed, setConfirmed] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const isL0token = !!assetInfo?.l0endpoint;

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
    if (isExternalRequest) {
      history.goBack();
    } else {
      linkTo('/send');
    }
  };

  const handleConfirm = async (
    callbackSuccess: (
      message: StargazerRequestMessage,
      origin: string,
      ...args: any[]
    ) => void | null = null,
    callbackError: (
      message: StargazerRequestMessage,
      origin: string,
      ...args: any[]
    ) => void | null = null
  ) => {
    setDisabled(true);

    try {
      if (isExternalRequest) {
        const { message, origin } =
          StargazerExternalPopups.decodeRequestMessageLocationParams(location.href);

        let trxHash: string;
        if (activeAsset.type === AssetType.Constellation) {
          trxHash = await accountController.confirmTempTx();
          setConfirmed(true);
        } else {
          const txConfig: ITransactionInfo = {
            fromAddress: tempTx.fromAddress,
            toAddress: tempTx.toAddress,
            timestamp: Date.now(),
            amount: tempTx.amount,
            ethConfig: tempTx.ethConfig,
            isTransfer: tempTx.isTransfer,
            onConfirmed: () => {
              // NOOP
            },
          };

          accountController.updateTempTx(txConfig);
          trxHash = await accountController.confirmContractTempTx(activeAsset);
        }

        if (callbackSuccess && !!trxHash) {
          callbackSuccess(message, origin, trxHash);
        } else {
          callbackError(message, origin, 'Unable to confirm transaction');
        }
      } else if (isHardware(activeWallet.type)) {
        const windowUrl = getHardwareWalletPage(activeWallet.type);
        const windowSize = { width: 1000, height: 1000 };
        const windowType = 'normal';

        const data = {
          from: tempTx.fromAddress,
          to: tempTx.toAddress,
          value: tempTx.amount,
          fee: String(tempTx.fee),
          cypherockId: activeWallet?.cypherockId,
          publicKey: activeWalletPublicKey,
          deviceId: activeWalletDeviceId,
          bipIndex: activeWallet?.bipIndex,
          assetId: activeAsset.id,
        };

        StargazerExternalPopups.executePopup({
          params: {
            data,
            origin: 'stargazer-wallet',
            route: ExternalRoute.SignTransaction,
          },
          size: windowSize,
          type: windowType,
          url: windowUrl,
        });
        return;
      } else {
        await accountController.confirmTempTx();
        setConfirmed(true);
      }
    } catch (e) {
      if (isError(e)) {
        if (
          e.message.includes('insufficient funds') &&
          [AssetType.ERC20, AssetType.Ethereum].includes(assetInfo.type)
        ) {
          e.message = 'Insufficient funds to cover gas fee.';
        }

        if (e.message.includes('cannot send a transaction to itself')) {
          e.message = 'An address cannot send a transaction to itself';
        }

        if (
          e.message.includes('TransactionLimited') &&
          assetInfo?.type === AssetType.Constellation
        ) {
          setIsModalVisible(true);
        } else {
          showAlert(e.message, 'danger');
        }
        console.log('ERROR', e);

        if (!location?.href) return;

        if (isExternalRequest) {
          const { message, origin } =
            StargazerExternalPopups.decodeRequestMessageLocationParams(location.href);

          if (callbackError) {
            callbackError(message, origin, e.message);
          }
        }
      }
      console.error(e);
    }
  };

  return (
    <Container color={CONTAINER_COLOR.EXTRA_LIGHT} showHeight={!isExternalRequest}>
      <Confirm
        isExternalRequest={isExternalRequest}
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
        isTransfer={isTransfer}
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        getDagSmallFeeAmount={getDagSmallFeeAmount}
      />
    </Container>
  );
};

export default ConfirmContainer;
