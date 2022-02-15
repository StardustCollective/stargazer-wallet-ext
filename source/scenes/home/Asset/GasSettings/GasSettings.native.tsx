import React, { FC } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import PurpleSlider from 'components/PurpleSlider';
import TextV3 from 'components/TextV3';

import DarkGreenCheck from 'assets/images/svg/dark-green-check.svg';

import { COLORS_ENUMS } from 'assets/styles/colors';
import styles from './styles';

import constants, { BUTTON_TYPE_ENUM, GAS_SETTINGS_STATE_ENUM } from './constants';
import IGasSettings, { IOutlineButtonProps } from './types';

const OutlineButton: FC<IOutlineButtonProps> = ({ label, type, onClick }) => {
  let buttonStyle = styles.solidButton;
  let buttonText = styles.solidButtonText;

  if (type === BUTTON_TYPE_ENUM.OUTLINE) {
    buttonStyle = styles.outlineButton;
    buttonText = styles.outlineButtonText;
  }

  return (
    <TouchableOpacity onPress={onClick}>
      <View style={buttonStyle}>
        <TextV3.Description color={COLORS_ENUMS.BLACK} extraStyle={buttonText}>
          {label}
        </TextV3.Description>
      </View>
    </TouchableOpacity>
  );
};

const GasSettings: FC<IGasSettings> = ({
  values,
  speedLabel,
  gasFeeLabel,
  gasPrice,
  gasPrices,
  onSliderChange,
  onSpeedUpClick,
  onSpeedUpButtonClick,
  onSettingCancelButtonClick,
  onSpeedUpConfirmButtonClicked,
  onKeepButtonClicked,
  onCancelTransactionButtonClicked,
  viewState,
  getFiatAmount,
}) => {
  return (
    <View style={styles.gasSettings}>
      {viewState === GAS_SETTINGS_STATE_ENUM.OPTIONS && (
        <View style={styles.options}>
          <OutlineButton label={constants.SPEED_UP_BUTTON_STRING} onClick={onSpeedUpButtonClick} />
        </View>
      )}
      {viewState === GAS_SETTINGS_STATE_ENUM.SETTINGS && (
        <View style={styles.settings}>
          <View style={styles.box}>
            <View style={styles.content}>
              <View style={styles.header}>
                <View style={styles.headerWrapper}>
                  <TextV3.Label extraStyle={styles.headerLeftText}>Gas Price</TextV3.Label>
                </View>
                <View style={styles.headerRight}>
                  <View>
                    <TextV3.Description extraStyle={styles.headerText}>{gasPrice}</TextV3.Description>
                    <TextV3.Description extraStyle={styles.headerTextLast}>{constants.GWEI_STRING}</TextV3.Description>
                  </View>
                </View>
              </View>
              <View style={styles.bodySlideLabel}>
                <View style={styles.bodySlide}>
                  <PurpleSlider
                    onChange={onSliderChange}
                    min={gasPrices[0]}
                    max={200}
                    value={values.current}
                    defaultValue={values.current}
                    step={constants.SLIDER_STEP_PROP}
                  />
                </View>
                <View style={styles.bodySlideLabel}>
                  <View>
                    <TextV3.Description>
                      {constants.FEE_STRING} {getFiatAmount(gasFeeLabel, 2, 'ethereum')}
                    </TextV3.Description>
                  </View>
                  <View>
                    <TextV3.Description>
                      {constants.SPEED_STRING} {speedLabel}
                    </TextV3.Description>
                  </View>
                </View>
              </View>
              <View style={styles.footer}>
                <View style={styles.cancelButton}>
                  <OutlineButton
                    label={constants.CANCEL_BUTTON_STRING}
                    type={BUTTON_TYPE_ENUM.OUTLINE}
                    onClick={onSettingCancelButtonClick}
                  />
                </View>
                <View style={styles.footer}>
                  <OutlineButton label={constants.SPEED_UP_BUTTON_STRING} onClick={onSpeedUpConfirmButtonClicked} />
                </View>
              </View>
            </View>
          </View>
        </View>
      )}
      {viewState === GAS_SETTINGS_STATE_ENUM.UPDATED && (
        <View style={styles.updated}>
          <View style={styles.updatedBox}>
            <DarkGreenCheck iconStyle={styles.updatedBoxImg} />
            <TextV3.Description extraStyle={styles.updatedBoxText}>
              {constants.TRANSACTION_UPDATED_STRING}
            </TextV3.Description>
          </View>
        </View>
      )}
      {viewState === GAS_SETTINGS_STATE_ENUM.CANCEL && (
        <View style={styles.cancel}>
          <View style={styles.cancelBox}>
            <View style={styles.cancelBoxContent}>
              <View style={styles.cancelHeader}>
                <TextV3.Description extraStyle={styles.cancelBodyText}>
                  {constants.CANCEL_TRANSACTION_STRING}?
                </TextV3.Description>
              </View>
              <View style={styles.cancelBox}>
                <TextV3.Description extraStyle={styles.cancelBodyText}>
                  {constants.CANCEL_TRANSACTION_PROMPT_STRING}
                </TextV3.Description>
              </View>
              <View style={styles.cancelFooter}>
                <View>
                  <OutlineButton
                    label={constants.KEEP_STRING}
                    type={BUTTON_TYPE_ENUM.OUTLINE}
                    onClick={onKeepButtonClicked}
                  />
                </View>
                <View>
                  <OutlineButton
                    label={constants.CANCEL_TRANSACTION_STRING}
                    onClick={onCancelTransactionButtonClicked}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default GasSettings;
