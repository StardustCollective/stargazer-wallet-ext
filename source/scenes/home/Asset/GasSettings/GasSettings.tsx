import React, { FC } from 'react';

import PurpleSlider from 'components/PurpleSlider';

import darkGreenCheck from 'assets/images/svg/dark-green-check.svg';

import styles from './GasSettings.scss';

import constants from './constants';
import IGasSettings, { IOutlineButtonProps } from './types';

const OutlineButton: FC<IOutlineButtonProps> = ({ label, type, onClick }) => {
  let cssStyle = styles.solidButton;

  if (type === constants.BUTTON_TYPE_ENUM.OUTLINE) {
    cssStyle = styles.outlineButton;
  }

  return (
    <div onClick={onClick} className={cssStyle}>
      <span>{label}</span>
    </div>
  );
};

const GasSettings: FC<IGasSettings> = ({
  values,
  speedLabel,
  gasFeeLabel,
  gasPrice,
  gasPrices,
  onSliderChange,
  onSpeedUpButtonClick,
  onSettingCancelButtonClick,
  onSpeedUpConfirmButtonClicked,
  onKeepButtonClicked,
  onCancelTransactionButtonClicked,
  viewState,
  getFiatAmount,
}) => {
  return (
    <div className={styles.gasSettings}>
      {viewState === constants.GAS_SETTINGS_STATE_ENUM.OPTIONS && (
        <div className={styles.options}>
          <OutlineButton label={constants.SPEED_UP_BUTTON_STRING} onClick={onSpeedUpButtonClick} />
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
                <div className={styles.footer__cancelButton}>
                  <OutlineButton
                    label={constants.CANCEL_BUTTON_STRING}
                    type={constants.BUTTON_TYPE_ENUM.OUTLINE}
                    onClick={onSettingCancelButtonClick}
                  />
                </div>
                <div className={styles.footer__speedUpButton}>
                  <OutlineButton label={constants.SPEED_UP_BUTTON_STRING} onClick={onSpeedUpConfirmButtonClicked} />
                </div>
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
                <span>{constants.CANCEL_TRANSACTION_STRING}?</span>
              </div>
              <div className={styles.body}>
                <span>{constants.CANCEL_TRANSACTION_PROMPT_STRING}</span>
              </div>
              <div className={styles.footer}>
                <div>
                  <OutlineButton
                    label={constants.KEEP_STRING}
                    type={constants.BUTTON_TYPE_ENUM.OUTLINE}
                    onClick={onKeepButtonClicked}
                  />
                </div>
                <div>
                  <OutlineButton
                    label={constants.CANCEL_TRANSACTION_STRING}
                    onClick={onCancelTransactionButtonClicked}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GasSettings;
