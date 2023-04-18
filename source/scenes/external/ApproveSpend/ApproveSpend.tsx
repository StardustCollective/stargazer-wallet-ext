//////////////////////
// Modules Imports
/////////////////////

import React, { ChangeEvent, useEffect } from 'react';
import queryString from 'query-string';
import TextV3 from 'components/TextV3';
import { browser } from 'webextension-polyfill-ts';
import { useController } from 'hooks/index';
import find from 'lodash/find';
import { useSelector } from 'react-redux';
import { ethers } from 'ethers';
import { RootState } from 'state/store';
import { IAssetInfoState } from 'state/assets/types';
import { IAssetState } from 'state/vault/types';
import { ITransactionInfo } from '../../../scripts/types';
import { ASSET_ID, isError } from '../../../scripts/common';
import { usePlatformAlert } from 'utils/alertUtil';
import walletsSelectors from 'selectors/walletsSelectors';

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
import styles from './index.module.scss';

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

  const controller = useController();
  const current = controller.dapp.getCurrent();
  const origin = current && current.origin;
  const showAlert = usePlatformAlert();
  const vaultActiveAsset = useSelector(walletsSelectors.getActiveAsset)

  const { data: stringData } = queryString.parse(location.search);

  const { to, from, gas, data, chain, chainLabel } = JSON.parse(stringData as string);

  let asset = useSelector((state: RootState) =>
    find(state.assets, { address: to })
  ) as IAssetInfoState;

  if (!asset) {
    // Filter asset by chain id
    asset = useSelector((state: RootState) =>
      find(state.assets, { id: ASSET_ID[chain]})
    ) as IAssetInfoState;

    // Get active asset
    const activeAsset = useSelector((state: RootState) =>
      find(state.vault.activeWallet.assets, { id: ASSET_ID[chain]})
    ) as IAssetState;

    if (activeAsset.id !== vaultActiveAsset.id) {
      // Update active asset in order to get expected gas prices
      controller.wallet.account.updateAccountActiveAsset(activeAsset);
    }
  }

  let {
    estimateGasFee,
    gasSpeedLabel,
    gasFee,
    gasLimit,
    setGasPrice,
    gasPrice,
    gasPrices
  } = useGasEstimate({
    toAddress: to as string,
    asset,
    data,
    gas,
  });

  const getFiatAmount = useFiat();

  useEffect(() => {
    if (gas) {
      // Gas sent in wei, convert to gwei
      let initialGas = parseInt((parseFloat(ethers.utils.formatEther(gas)) *
        10e8) as any);

      setGasPrice(initialGas);
      estimateGasFee(initialGas);
    }
  }, []);

  //////////////////////
  // Callbacks
  /////////////////////

  const onNegativeButtonClick = async () => {
    const background = await browser.runtime.getBackgroundPage();
    const { windowId } = queryString.parse(window.location.search);
    const cancelEvent = new CustomEvent('spendApproved', {
      detail: { windowId, approved: true, result: false }
    });

    background.dispatchEvent(cancelEvent);
    window.close();
  };

  const onPositiveButtonClick = async () => {
    const background = await browser.runtime.getBackgroundPage();
    const { windowId } = queryString.parse(window.location.search);

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
          memo: data
        },
        onConfirmed: () => {
          // NOOP
        }
      };

      controller.wallet.account.updateTempTx(txConfig);
      const trxHash = await controller.wallet.account.confirmContractTempTx(asset);

      background.dispatchEvent(new CustomEvent('spendApproved', {
        detail: { windowId, approved: true, result: trxHash }
      }));
    } catch (e) {
      if (isError(e)) {
        background.dispatchEvent(new CustomEvent('spendApproved', {
          detail: { windowId, approved: false, error: e.message },
        }));

        showAlert(e.message, 'danger');
      }
    }

    window.close();
  };

  const onGasPriceChanged = (
    _event: ChangeEvent<{}>,
    value: number | number[]
  ) => {
    setGasPrice(value as number);
    estimateGasFee(value as number);
  };

  const renderHeaderInfo = () => {

    if (!origin || !chainLabel) return null;

    return (
      <div className={styles.headerContainer}>
        {!!origin && (
          <div className={styles.row}>
            <TextV3.CaptionStrong color={COLORS_ENUMS.WHITE} extraStyles={styles.headerInfoTitle}>URL</TextV3.CaptionStrong>
            <TextV3.CaptionRegular color={COLORS_ENUMS.WHITE} extraStyles={styles.headerInfoValue}>{origin}</TextV3.CaptionRegular>
          </div>
        )}
        {!!chainLabel && (
          <div className={styles.row}>
            <TextV3.CaptionStrong color={COLORS_ENUMS.WHITE} extraStyles={styles.headerInfoTitle}>Chain</TextV3.CaptionStrong>
            <TextV3.CaptionRegular color={COLORS_ENUMS.WHITE}>{chainLabel}</TextV3.CaptionRegular>
          </div>
        )}
      </div>
    )
  }

  //////////////////////
  // Renders
  /////////////////////

  return (
    <CardLayoutV2
      stepLabel={``}
      headerLabel={'Grant Permissions'}
      headerInfo={renderHeaderInfo()}
      captionLabel={''}
      negativeButtonLabel={'Reject'}
      onNegativeButtonClick={onNegativeButtonClick}
      positiveButtonLabel={'Confirm'}
      onPositiveButtonClick={onPositiveButtonClick}
    >
      <div className={styles.content}>
        <TextV3.Caption color={COLORS_ENUMS.BLACK}>
          Do you trust this site? By granting permissions you're allowing this
          site to withdraw your tokens and automate transactions for you.
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
