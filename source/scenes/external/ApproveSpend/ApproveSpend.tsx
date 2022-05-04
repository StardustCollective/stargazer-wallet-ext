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
import { AssetType } from 'state/vault/types';
import { ITransactionInfo } from '../../../scripts/types';

///////////////////////
// Components
///////////////////////

import PurpleSlider from 'components/PurpleSlider';

//////////////////////
// Common Layouts
/////////////////////

import CardLayout from 'scenes/external/Layouts/CardLayout';

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

  const { data: stringData } = queryString.parse(location.search);

  const { to, from, gas, data } = JSON.parse(stringData as string);

  let asset = useSelector((state: RootState) =>
    find(state.assets, { address: to })
  ) as IAssetInfoState;

  if (!asset) {
    asset = useSelector((state: RootState) =>
      find(state.assets, { type: AssetType.Ethereum })
    ) as IAssetInfoState;
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
    data
  });

  const getFiatAmount = useFiat(true, asset);

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

    const confirmEvent = new CustomEvent('spendApproved', {
      detail: { windowId, approved: true }
    });

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
        background.dispatchEvent(confirmEvent);
      }
    };

    controller.wallet.account.updateTempTx(txConfig);
    await controller.wallet.account.confirmContractTempTx(asset);

    window.close();
  };

  const onGasPriceChanged = (
    _event: ChangeEvent<{}>,
    value: number | number[]
  ) => {
    setGasPrice(value as number);
    estimateGasFee(value as number);
  };

  //////////////////////
  // Renders
  /////////////////////

  return (
    <CardLayout
      stepLabel={``}
      originDescriptionLabel={'Grant permissions to:'}
      headerLabel={'Grant Permissions'}
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
                    {FEE_STRING} {getFiatAmount(gasFee, 2, 'ethereum')}
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
    </CardLayout>
  );
};

export default ApproveSpend;
