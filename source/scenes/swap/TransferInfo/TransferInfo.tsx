///////////////////////
// Imports
///////////////////////

import React, { FC } from 'react';
import clsx from 'clsx';

///////////////////////
// Components
///////////////////////

import TextV3 from 'components/TextV3';
import ButtonV3, { BUTTON_TYPES_ENUM, BUTTON_SIZES_ENUM } from 'components/ButtonV3';
import MUITextField from '@material-ui/core/TextField';
import PurpleSlider from 'components/PurpleSlider';

///////////////////////
// Types
///////////////////////

import ITransferInfo from './types';

///////////////////////
// Styles
///////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';
import styles from './TransferInfo.scss';

///////////////////////
// constants
///////////////////////

import {
  DEPOSIT_ADDRESS_STRING,
  SWAP_FROM_STRING,
  SWAP_TO_STRING,
  TRANSACTION_FEE_STRING,
  RECOMMENDED_STRING,
  NEXT_BUTTON_STRING,
  GAS_PRICE_IN_GWEI_STRING,
  DAG_CODE,
  GAS_SLIDER_STEP,
  TRANSACTION_FEE_DEFAULT_VALUE,
} from './constants';

const SwapTokens: FC<ITransferInfo> = ({
  onNextPressed,
  to,
  from,
  depositAddress,
  gas,
  onGasPriceChange,
  getFiatAmount,
  onRecommendedPress,
  onTransactionFeeChange,
  fee,
}) => {

  return (
    <div className={styles.container}>
      <div className={styles.dataRow}>
        <TextV3.CaptionStrong
          color={COLORS_ENUMS.DARK_GRAY_200}
        >
          {DEPOSIT_ADDRESS_STRING}
        </TextV3.CaptionStrong>
        <div className={styles.dataValue}>
          <TextV3.CaptionStrong
            extraStyles={styles.dataValueText}
            color={COLORS_ENUMS.DARK_GRAY_200}
          >
            {depositAddress}
          </TextV3.CaptionStrong>
        </div>
      </div>
      <div className={styles.dataRow}>
        <TextV3.CaptionStrong
          color={COLORS_ENUMS.DARK_GRAY_200}
        >
          {SWAP_FROM_STRING}
        </TextV3.CaptionStrong>
        <div className={styles.dataValue}>
          <TextV3.CaptionStrong
            extraStyles={styles.dataValueText}
            color={COLORS_ENUMS.DARK_GRAY_200}
          >
            {from.amount} {from.code}
          </TextV3.CaptionStrong>
        </div>
      </div>
      <div className={styles.dataRow}>
        <TextV3.CaptionStrong
          color={COLORS_ENUMS.DARK_GRAY_200}
        >
          {SWAP_TO_STRING}
        </TextV3.CaptionStrong>
        <div className={styles.dataValue}>
          <TextV3.CaptionStrong
            extraStyles={styles.dataValueText}
            color={COLORS_ENUMS.DARK_GRAY_200}
          >
            {to.amount} {to.code}
          </TextV3.CaptionStrong>
        </div>
      </div>
      {from.code === DAG_CODE ? (
        <div className={styles.dataRow}>
          <TextV3.CaptionStrong
            color={COLORS_ENUMS.DARK_GRAY_200}
          >
            {TRANSACTION_FEE_STRING}
          </TextV3.CaptionStrong>
          <div className={clsx(styles.dataValue, styles.trasnsactionFee)}>
            <div className={styles.transactionFeeInput}>
              <MUITextField
                id="recommended-fee-input"
                name="recommended-fee-input"
                type='number'
                value={fee.toString()}
                placeholder={TRANSACTION_FEE_DEFAULT_VALUE}
                onChange={(e: any) => onTransactionFeeChange(e.target.value)}
                InputProps={{
                  disableUnderline: true,
                  classes: {
                    root: styles.recommendedFeeInput,
                  }
                }}
              />
            </div>
            <div onClick={onRecommendedPress} className={styles.transactionFeeRecommend}>
              <TextV3.Caption color={COLORS_ENUMS.PRIMARY}>{RECOMMENDED_STRING}</TextV3.Caption>
            </div>
          </div>
          <TextV3.Caption color={COLORS_ENUMS.GRAY_100}>
            With current network conditions we recommend a fee of &nbsp;
            <TextV3.Caption color={COLORS_ENUMS.BLACK}>
              0 DAG
            </TextV3.Caption>
          </TextV3.Caption>
        </div>
      ) : (
        <>
          {gas.prices.length > 0 && (
            <>
              <div className={styles.gasPriceContainer}>
                <div className={styles.gasPriceHeader}>
                  <div className={styles.gasPriceHeaderLeft}>
                    <TextV3.LabelSemiStrong color={COLORS_ENUMS.BLACK}>{GAS_PRICE_IN_GWEI_STRING}</TextV3.LabelSemiStrong>
                  </div>
                  <div className={styles.gasPriceHeaderRight}>
                    <div className={styles.gasSpeedBox}>
                      <div className={styles.gasSpeedBoxLeft}>
                        <TextV3.CaptionRegular color={COLORS_ENUMS.BLACK}>{gas.price.toString()}</TextV3.CaptionRegular>
                      </div>
                      <div className={styles.gasSpeedBoxRight}>
                        <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK}>{gas.speedLabel}</TextV3.CaptionStrong>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.gasPriceFooter}>
                  <div className={styles.sliderContainer}>
                    <PurpleSlider
                      onChange={onGasPriceChange}
                      min={gas.prices[0]}
                      max={gas.prices[2]}
                      defaultValue={gas.price}
                      value={gas.price}
                      step={GAS_SLIDER_STEP}
                    />
                  </div>
                </div>
              </div>
              <TextV3.CaptionRegular extraStyles={styles.gasEstimateLabel} color={COLORS_ENUMS.DARK_GRAY_200}>
                {`${gas.price} GWEI, ${gas.fee} ${from.code} (≈ ${getFiatAmount(gas.fee, 2, gas.basePriceId)})`}
              </TextV3.CaptionRegular>
            </>
          )}
        </>
      )}
      <div className={styles.nextButton}>
        <ButtonV3
          label={NEXT_BUTTON_STRING}
          size={BUTTON_SIZES_ENUM.FULL_WIDTH}
          type={BUTTON_TYPES_ENUM.SECONDARY_SOLID}
          onClick={onNextPressed}
          extraStyle={styles.buttonNormal}
        />
      </div>
    </div >
  );
}

export default SwapTokens;
