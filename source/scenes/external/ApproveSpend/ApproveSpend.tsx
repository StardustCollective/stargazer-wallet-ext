//////////////////////
// Modules Imports
///////////////////// 

import React, { ChangeEvent, useEffect } from 'react';
import queryString from 'query-string';
import TextV3 from 'components/TextV3';
import { useAlert } from 'react-alert';
import { browser } from 'webextension-polyfill-ts';
import { useController } from 'hooks/index';
import find from 'lodash/find';
import { useSelector } from 'react-redux';
import { RootState } from 'state/store';
import { IAssetInfoState } from 'state/assets/types';
import { ITransactionInfo } from '../../../scripts/types';

///////////////////////
// Components
///////////////////////

import PurpleSlider from 'components/PurpleSlider'

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
const MIN_GAS_PRICE = 0;
const MAX_GAS_PRICE = 200;
const SLIDER_STEP_PROP = 1;

//////////////////////
// Component
///////////////////// 

const ApproveSpend = () => {

  //////////////////////
  // Hooks
  ///////////////////// 

  const controller = useController();
  const alert = useAlert();

  const {
    data: stringData,
  } = queryString.parse(location.search);
  
  const asset: IAssetInfoState = useSelector(
    (state: RootState) => find(state.assets, {symbol: 'LTX'})
  );

  const {
    to,
    from,
    gas,
    value,
    data,
  } = JSON.parse(stringData as string);

  let {
    estimateGasFee,
    gasSpeedLabel,
    gasFee,
    gasLimit,
    setGasPrice,
    gasPrice 
  } = useGasEstimate({
      toAddress: to as string,
      amount: '0',
      asset: asset,
    });

  const getFiatAmount = useFiat();

  useEffect(() => {
    if(gas){
      let initialGas = parseInt(gas, 16);
      setGasPrice(initialGas);
      estimateGasFee(initialGas);
    }
  }, []);

  //////////////////////
  // Callbacks
  ///////////////////// 

  const onNegativeButtonClick = () => {
    window.close();
  }

  const onPositiveButtonClick = async () => {

    const background = await browser.runtime.getBackgroundPage();

    const txConfig: ITransactionInfo = {
      fromAddress: from,
      toAddress: to,
      timestamp: Date.now(),
      amount: String(parseInt(value, 16)),
      fee: gasFee,
      ethConfig: {
        gasPrice,
        gasLimit,
        txData:data,
      }
    };
    
    controller.wallet.account.updateTempTx(txConfig);
    controller.wallet.account.confirmTempTx()

    background.dispatchEvent(
      new CustomEvent('spendApproved', { detail: { hash: window.location.hash, approved: true } })
    );

    window.close();
  }

  const onGasPriceChanged = (_event: ChangeEvent<{}>, value: number | number[]) => {
    setGasPrice(value as number);
    estimateGasFee(value as number);
  }

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
          Do you trust this site? By granting permissions you're allowing this site to withdraw your LTX and automate transactions for you.
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
                    <span>
                      {gasPrice}
                    </span>
                    <span>
                      {GWEI_STRING}
                    </span>
                  </div>
                </div>
              </div>
              <div className={styles.slider}>
                <PurpleSlider
                  onChange={onGasPriceChanged}
                  min={MIN_GAS_PRICE}
                  max={MAX_GAS_PRICE}
                  defaultValue={parseInt(gas as string, 16)}
                  step={SLIDER_STEP_PROP}
                />
              </div>
              <div className={styles.sliderLabel}>
                <div>
                  <span>{FEE_STRING} {getFiatAmount(
                    gasFee,
                    2,
                    'ethereum'
                  )}</span>
                </div>
                <div>
                  <span>{SPEED_STRING} {gasSpeedLabel}</span>
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