import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';

import PurpleSlider from 'components/PurpleSlider';
import TextV3 from 'components/TextV3';
import ButtonV3, { BUTTON_TYPES_ENUM, BUTTON_SIZES_ENUM } from 'components/ButtonV3';

import DarkGreenCheck from 'assets/images/svg/dark-green-check.svg';

import { COLORS_ENUMS } from 'assets/styles/colors';
import styles from './styles';

import constants, { BUTTON_TYPE_ENUM, GAS_SETTINGS_STATE_ENUM } from './constants';
import IGasSettings, { IOutlineButtonProps } from './types';

const OutlineButton: FC<IOutlineButtonProps> = ({ label, type, onClick }) => {
  let buttonStyle = styles.solidButton;
  let buttonText = styles.solidButtonText;
  let buttonType = BUTTON_TYPES_ENUM.PRIMARY_SOLID;

  if (type === BUTTON_TYPE_ENUM.OUTLINE) {
    buttonStyle = styles.outlineButton;
    buttonText = styles.outlineButtonText;
    buttonType = BUTTON_TYPES_ENUM.PRIMARY_OUTLINE;
  }

  return (
    <ButtonV3
      onPress={onClick}
      title={label}
      button
      type={buttonType}
      extraTitleStyles={buttonText}
      extraStyles={buttonStyle}
      size={BUTTON_SIZES_ENUM.SMALL}
    />
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
  const FEE_STRING_VALUE = getFiatAmount(gasFeeLabel, 2, 'ethereum';
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
                <TextV3.Label extraStyles={styles.headerLeftText}>Gas Price</TextV3.Label>
                <View style={styles.headerRight}>
                  <View style={styles.headerRightWrapper}>
                    <TextV3.Description extraStyles={styles.headerText}>{gasPrice}</TextV3.Description>
                    <TextV3.Description extraStyles={styles.headerTextLast}>{constants.GWEI_STRING}</TextV3.Description>
                  </View>
                </View>
              </View>
              <PurpleSlider
                onChange={onSliderChange}
                min={gasPrices[0]}
                max={200}
                value={values.current}
                defaultValue={values.current}
                step={constants.SLIDER_STEP_PROP}
              />
              <View style={styles.bodySlideLabel}>
                <TextV3.Description color={COLORS_ENUMS.BLACK} extraStyles={styles.bodySlideText}>
                  {constants.FEE_STRING}
                  {FEE_STRING_VALUE}
                </TextV3.Description>
                <TextV3.Description
                  color={COLORS_ENUMS.BLACK}
                  extraStyles={StyleSheet.flatten([styles.bodySlideText, styles.bodySlideSpeedText])}
                >
                  {constants.SPEED_STRING} {speedLabel}
                </TextV3.Description>
              </View>
              <View style={styles.settingsFooter}>
                <View style={styles.cancelButton}>
                  <OutlineButton
                    label={constants.CANCEL_BUTTON_STRING}
                    type={BUTTON_TYPE_ENUM.OUTLINE}
                    onClick={onSettingCancelButtonClick}
                  />
                </View>
                <View style={styles.footerButton}>
                  <OutlineButton label={constants.SPEED_UP_BUTTON_STRING} onClick={onSpeedUpConfirmButtonClicked} />
                </View>
              </View>
            </View>
          </View>
        </View>
      )}
      {viewState === GAS_SETTINGS_STATE_ENUM.UPDATED && (
        <View style={styles.updatedWrapper}>
          <DarkGreenCheck with={16} height={16} iconStyles={styles.updatedIcon} />
          <TextV3.Description extraStyles={styles.updatedBoxText}>
            {constants.TRANSACTION_UPDATED_STRING}
          </TextV3.Description>
        </View>
      )}
      {viewState === GAS_SETTINGS_STATE_ENUM.CANCEL && (
        <View style={styles.cancel}>
          <View style={styles.cancelBox}>
            <View style={styles.cancelBoxContent}>
              <View style={styles.cancelHeader}>
                <TextV3.Description margin={false} color={COLORS_ENUMS.BLACK} extraStyles={styles.cancelBodyText}>
                  {constants.CANCEL_TRANSACTION_STRING}?
                </TextV3.Description>
              </View>
              <TextV3.Description margin={false} color={COLORS_ENUMS.BLACK} extraStyles={styles.cancelBodyText}>
                {constants.CANCEL_TRANSACTION_PROMPT_STRING}
              </TextV3.Description>
              <View style={styles.cancelFooter}>
                <View style={styles.cancelFooterLeft}>
                  <OutlineButton
                    label={constants.KEEP_STRING}
                    type={BUTTON_TYPE_ENUM.OUTLINE}
                    onClick={onKeepButtonClicked}
                  />
                </View>
                <OutlineButton label={constants.CANCEL_TRANSACTION_STRING} onClick={onCancelTransactionButtonClicked} />
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default GasSettings;
