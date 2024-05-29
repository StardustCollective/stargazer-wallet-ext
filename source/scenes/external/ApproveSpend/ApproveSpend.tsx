//////////////////////
// Modules Imports
/////////////////////

import React, { ChangeEvent, useEffect } from 'react';
import TextV3 from 'components/TextV3';
import find from 'lodash/find';
import { useSelector } from 'react-redux';
import { ethers } from 'ethers';
import { RootState } from 'state/store';
import { IAssetInfoState } from 'state/assets/types';
import { AssetType, IAssetState } from 'state/vault/types';
import { usePlatformAlert } from 'utils/alertUtil';
import walletsSelectors from 'selectors/walletsSelectors';
import dappSelectors from 'selectors/dappSelectors';
import { CHAIN_FULL_ASSET, CHAIN_WALLET_ASSET } from 'utils/assetsUtil';
import { getWalletController } from 'utils/controllersUtils';

///////////////////////
// Components
///////////////////////

import PurpleSlider from 'components/PurpleSlider';

//////////////////////
// Common Layouts
/////////////////////

import CardLayoutV2 from 'scenes/external/Layouts/CardLayoutV2';

///////////////////////
// Hooks
///////////////////////

import useGasEstimate from 'hooks/useGasEstimate';
import { useFiat } from 'hooks/usePrice';

///////////////////////////
// Styles
///////////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';
import {
  StargazerExternalPopups,
  StargazerWSMessageBroker,
} from 'scripts/Background/messaging';
import styles from './index.module.scss';
import {
  EIPErrorCodes,
  EIPRpcError,
  isError,
  StargazerChain,
} from '../../../scripts/common';
import { ITransactionInfo } from '../../../scripts/types';

//////////////////////
// Constants
/////////////////////

const FEE_STRING = 'Fee ~= ';
const SPEED_STRING = 'Speed:';
const GWEI_STRING = 'GWEI';
const SLIDER_STEP_PROP = 1;

//////////////////////
// Component
/////////////////////

const ApproveSpend = () => {
  //////////////////////
  // Hooks
  /////////////////////

  const current = useSelector(dappSelectors.getCurrent);
  const origin = current && current.origin;

  const walletController = getWalletController();
  const showAlert = usePlatformAlert();
  const vaultActiveAsset = useSelector(walletsSelectors.getActiveAsset);

  const { data: requestData, message } =
    StargazerExternalPopups.decodeRequestMessageLocationParams<any>(location.href);

  const { to, from, gas, data, chain, chainLabel } = requestData;

  let asset = useSelector((state: RootState) =>
    find(state.assets, { address: to })
  ) as IAssetInfoState;

  if (!asset) {
    if (chain) {
      asset = CHAIN_FULL_ASSET[chain as StargazerChain];
      let activeAsset: IAssetState;

      if (chain === StargazerChain.CONSTELLATION) {
        activeAsset = useSelector((state: RootState) =>
          find(state.vault.activeWallet.assets, { id: AssetType.Constellation })
        );
      } else {
        activeAsset = useSelector((state: RootState) =>
          find(state.vault.activeWallet.assets, { id: AssetType.Ethereum })
        );
        activeAsset = {
          ...activeAsset,
          ...CHAIN_WALLET_ASSET[chain as keyof typeof CHAIN_WALLET_ASSET],
        };
      }

      if (activeAsset?.id !== vaultActiveAsset?.id) {
        // Update active asset in order to get expected gas prices
        walletController.account.updateAccountActiveAsset(activeAsset);
      }
    }
  }

  const {
    estimateGasFee,
    gasSpeedLabel,
    gasFee,
    gasLimit,
    setGasPrice,
    gasPrice,
    gasPrices,
  } = useGasEstimate({
    toAddress: to as string,
    asset,
    data,
    gas,
  });

  const getFiatAmount = useFiat(true, asset);

  useEffect(() => {
    if (gas) {
      // Gas sent in wei, convert to gwei
      const initialGas = parseInt(
        (parseFloat(ethers.utils.formatEther(gas)) * 10e8) as any
      );

      setGasPrice(initialGas);
      estimateGasFee(initialGas);
    }
  }, []);

  //////////////////////
  // Callbacks
  /////////////////////

  const onNegativeButtonClick = async () => {
    StargazerExternalPopups.addResolvedParam(location.href);
    StargazerWSMessageBroker.sendResponseError(
      new EIPRpcError('User Rejected Request', EIPErrorCodes.Rejected),
      message
    );

    window.close();
  };

  const onPositiveButtonClick = async () => {
    try {
      const txConfig: ITransactionInfo = {
        fromAddress: from,
        toAddress: to,
        timestamp: Date.now(),
        amount: '0',
        fee: gasFee,
        ethConfig: {
          gasPrice,
          gasLimit,
          memo: data,
        },
        onConfirmed: () => {
          // NOOP
        },
      };

      walletController.account.updateTempTx(txConfig);
      const trxHash = await walletController.account.confirmContractTempTx(asset);

      StargazerExternalPopups.addResolvedParam(location.href);
      StargazerWSMessageBroker.sendResponseResult(trxHash, message);
    } catch (e) {
      if (isError(e)) {
        StargazerExternalPopups.addResolvedParam(location.href);
        StargazerWSMessageBroker.sendResponseError(
          new EIPRpcError(e.message, EIPErrorCodes.Rejected),
          message
        );
        showAlert(e.message, 'danger');
      }
    }

    window.close();
  };

  const onGasPriceChanged = (_event: ChangeEvent<{}>, value: number | number[]) => {
    setGasPrice(value as number);
    estimateGasFee(value as number);
  };

  const renderHeaderInfo = () => {
    if (!origin || !chainLabel) return null;

    return (
      <div className={styles.headerContainer}>
        {!!origin && (
          <div className={styles.row}>
            <TextV3.CaptionStrong
              color={COLORS_ENUMS.WHITE}
              extraStyles={styles.headerInfoTitle}
            >
              URL
            </TextV3.CaptionStrong>
            <TextV3.CaptionRegular
              color={COLORS_ENUMS.WHITE}
              extraStyles={styles.headerInfoValue}
            >
              {origin}
            </TextV3.CaptionRegular>
          </div>
        )}
        {!!chainLabel && (
          <div className={styles.row}>
            <TextV3.CaptionStrong
              color={COLORS_ENUMS.WHITE}
              extraStyles={styles.headerInfoTitle}
            >
              Chain
            </TextV3.CaptionStrong>
            <TextV3.CaptionRegular color={COLORS_ENUMS.WHITE}>
              {chainLabel}
            </TextV3.CaptionRegular>
          </div>
        )}
      </div>
    );
  };

  //////////////////////
  // Renders
  /////////////////////

  return (
    <CardLayoutV2
      stepLabel=""
      headerLabel="Grant Permissions"
      headerInfo={renderHeaderInfo()}
      captionLabel=""
      negativeButtonLabel="Reject"
      onNegativeButtonClick={onNegativeButtonClick}
      positiveButtonLabel="Confirm"
      onPositiveButtonClick={onPositiveButtonClick}
    >
      <div className={styles.content}>
        <TextV3.Caption color={COLORS_ENUMS.BLACK}>
          Do you trust this site? By granting permissions you're allowing this site to
          withdraw your tokens and automate transactions for you.
        </TextV3.Caption>
        <div className={styles.gasFees}>
          <div className={styles.box}>
            <div className={styles.content}>
              <div className={styles.header}>
                <div className={styles.headerLeft}>
                  <span>Gas Price</span>
                </div>
                <div className={styles.headerRight}>
                  <div>
                    <span>{gasPrice}</span>
                    <span>{GWEI_STRING}</span>
                  </div>
                </div>
              </div>
              <div className={styles.slider}>
                <PurpleSlider
                  onChange={onGasPriceChanged}
                  min={gasPrices[0]}
                  max={gasPrices[gasPrices.length - 1]}
                  defaultValue={gasPrice}
                  value={gasPrice}
                  step={SLIDER_STEP_PROP}
                />
              </div>
              <div className={styles.sliderLabel}>
                <div>
                  <span>
                    {FEE_STRING} {getFiatAmount(gasFee, 4)}
                  </span>
                </div>
                <div>
                  <span>
                    {SPEED_STRING} {gasSpeedLabel}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CardLayoutV2>
  );
};

export default ApproveSpend;
