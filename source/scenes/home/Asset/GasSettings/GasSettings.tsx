import React, { FC } from 'react';

import PurpleSlider from 'components/PurpleSlider';
import ButtonV3, { BUTTON_TYPES_ENUM } from 'components/ButtonV3';
import TextV3 from 'components/TextV3';

import darkGreenCheck from 'assets/images/svg/dark-green-check.svg';

import styles from './GasSettings.scss';

import constants from './constants';
import IGasSettings from './types';
import { COLORS_ENUMS } from 'assets/styles/colors';

const GasSettings: FC<IGasSettings> = ({
  values,
  speedLabel,
  gasFeeLabel,
  gasPrice,
  gasPrices,
  onSliderChange,
  onSpeedUpButtonClick,
  onCancelButtonClick,
  onSettingCancelButtonClick,
  onSpeedUpConfirmButtonClicked,
  onKeepButtonClicked,
  onCancelTransactionButtonClicked,
  viewState,
  getFiatAmount,
}) => {
  return (
    <div className={styles.gasSettings} onClick={null}>
      {viewState === constants.GAS_SETTINGS_STATE_ENUM.OPTIONS && (
        <div className={styles.options}>
          <ButtonV3
            type={BUTTON_TYPES_ENUM.PRIMARY_OUTLINE}
            label={constants.CANCEL_BUTTON_STRING}
            onClick={(ev: any) => {
              ev.stopPropagation();
              onCancelButtonClick();
            }}
            extraStyle={styles.buttonContainer}
          />
          <ButtonV3
            type={BUTTON_TYPES_ENUM.SECONDARY_SOLID}
            label={constants.SPEED_UP_BUTTON_STRING}
            onClick={(ev: any) => {
              ev.stopPropagation();
              onSpeedUpButtonClick();
            }}
            extraStyle={styles.buttonContainer}
          />
        </div>
      )}
      {viewState === constants.GAS_SETTINGS_STATE_ENUM.SETTINGS && (
        <div className={styles.settings}>
          <div className={styles.box}>
            <div className={styles.content}>
              <div className={styles.header}>
                <div className={styles.headerLeft}>
                  <span>Gas Price</span>
                </div>
                <div className={styles.headerRight}>
                  <div>
                    <span>{gasPrice}</span>
                    <span>{constants.GWEI_STRING}</span>
                  </div>
                </div>
              </div>
              <div className={styles.body}>
                <div className={styles.body__slider}>
                  <PurpleSlider
                    onChange={onSliderChange}
                    min={gasPrices[0]}
                    max={200}
                    value={values.current}
                    defaultValue={values.current}
                    step={constants.SLIDER_STEP_PROP}
                  />
                </div>
                <div className={styles.body__sliderLabels}>
                  <div>
                    <span>
                      <>
                        {constants.FEE_STRING} {getFiatAmount(gasFeeLabel, 2, 'ethereum')}
                      </>
                    </span>
                  </div>
                  <div>
                    <span>
                      {constants.SPEED_STRING} {speedLabel}
                    </span>
                  </div>
                </div>
              </div>
              <div className={styles.footer}>
                <ButtonV3
                  type={BUTTON_TYPES_ENUM.PRIMARY_OUTLINE}
                  label={constants.CANCEL_BUTTON_STRING}
                  onClick={(ev: any) => {
                    ev.stopPropagation();
                    onSettingCancelButtonClick();
                  }}
                  extraStyle={styles.buttonContainer}
                />
                <ButtonV3
                  type={BUTTON_TYPES_ENUM.SECONDARY_SOLID}
                  label={constants.SPEED_UP_BUTTON_STRING}
                  onClick={(ev: any) => {
                    ev.stopPropagation();
                    onSpeedUpConfirmButtonClicked();
                  }}
                  extraStyle={styles.buttonContainer}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {viewState === constants.GAS_SETTINGS_STATE_ENUM.UPDATED && (
        <div className={styles.updated}>
          <div className={styles.box}>
            <img src={`/${darkGreenCheck}`} alt="green-check" />
            <span>{constants.TRANSACTION_UPDATED_STRING}</span>
          </div>
        </div>
      )}
      {viewState === constants.GAS_SETTINGS_STATE_ENUM.CANCEL && (
        <div className={styles.cancel}>
          <div className={styles.box}>
            <div className={styles.content}>
              <div className={styles.header}>
                <TextV3.CaptionStrong
                  color={COLORS_ENUMS.BLACK}
                  extraStyles={styles.cancelBodyTitle}
                >
                  {constants.CANCEL_TRANSACTION_STRING}?
                </TextV3.CaptionStrong>
              </div>
              <div className={styles.body}>
                <TextV3.Caption
                  color={COLORS_ENUMS.DARK_GRAY_200}
                  extraStyles={styles.cancelBodyText}
                >
                  {constants.CANCEL_TRANSACTION_PROMPT_STRING}
                </TextV3.Caption>
              </div>
              <div className={styles.footer}>
                <ButtonV3
                  type={BUTTON_TYPES_ENUM.PRIMARY_OUTLINE}
                  label={constants.CANCEL_TRANSACTION_STRING}
                  onClick={(ev: any) => {
                    ev.stopPropagation();
                    onCancelTransactionButtonClicked();
                  }}
                  extraStyle={styles.buttonContainer}
                />
                <ButtonV3
                  type={BUTTON_TYPES_ENUM.SECONDARY_SOLID}
                  label={constants.KEEP_STRING}
                  onClick={(ev: any) => {
                    ev.stopPropagation();
                    onKeepButtonClicked();
                  }}
                  extraStyle={styles.buttonContainer}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GasSettings;
