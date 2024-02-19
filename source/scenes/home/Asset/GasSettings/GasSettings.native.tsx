import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';

import PurpleSlider from 'components/PurpleSlider';
import TextV3 from 'components/TextV3';
import ButtonV3, { BUTTON_TYPES_ENUM, BUTTON_SIZES_ENUM } from 'components/ButtonV3';

import DarkGreenCheck from 'assets/images/svg/dark-green-check.svg';
import ErrorIcon from 'assets/images/svg/error.svg';

import { COLORS_ENUMS } from 'assets/styles/colors';
import styles from './styles';

import constants, { GAS_SETTINGS_STATE_ENUM } from './constants';
import IGasSettings from './types';

const GasSettings: FC<IGasSettings> = ({
  values,
  speedLabel,
  gasFeeLabel,
  gasPrice,
  gasPrices,
  cancelError,
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
  const FEE_STRING_VALUE = getFiatAmount(gasFeeLabel, 2, 'ethereum');

  return (
    <View style={styles.gasSettings}>
      {viewState === GAS_SETTINGS_STATE_ENUM.OPTIONS && (
        <View style={styles.options}>
          <ButtonV3
            type={BUTTON_TYPES_ENUM.PRIMARY_OUTLINE}
            title={constants.CANCEL_BUTTON_STRING}
            onPress={onCancelButtonClick}
            extraStyles={styles.buttonContainer}
            extraTitleStyles={styles.buttonText}
          />
          <ButtonV3
            type={BUTTON_TYPES_ENUM.SECONDARY_SOLID}
            title={constants.SPEED_UP_BUTTON_STRING}
            onPress={onSpeedUpButtonClick}
            extraStyles={styles.buttonContainer}
            extraTitleStyles={styles.buttonText}
          />
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
                    <TextV3.Description extraStyles={styles.headerText}>
                      {gasPrice}
                    </TextV3.Description>
                    <TextV3.Description extraStyles={styles.headerTextLast}>
                      {constants.GWEI_STRING}
                    </TextV3.Description>
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
                <TextV3.Description
                  color={COLORS_ENUMS.BLACK}
                  extraStyles={styles.bodySlideText}
                >
                  {constants.FEE_STRING}
                  {FEE_STRING_VALUE}
                </TextV3.Description>
                <TextV3.Description
                  color={COLORS_ENUMS.BLACK}
                  extraStyles={StyleSheet.flatten([
                    styles.bodySlideText,
                    styles.bodySlideSpeedText,
                  ])}
                >
                  {constants.SPEED_STRING} {speedLabel}
                </TextV3.Description>
              </View>
              <View style={styles.settingsFooter}>
                <ButtonV3
                  type={BUTTON_TYPES_ENUM.PRIMARY_OUTLINE}
                  title={constants.CANCEL_BUTTON_STRING}
                  onPress={onSettingCancelButtonClick}
                  extraStyles={styles.buttonContainer}
                  extraTitleStyles={styles.buttonText}
                />
                <ButtonV3
                  type={BUTTON_TYPES_ENUM.SECONDARY_SOLID}
                  title={constants.SPEED_UP_BUTTON_STRING}
                  onPress={onSpeedUpConfirmButtonClicked}
                  extraStyles={styles.buttonContainer}
                  extraTitleStyles={styles.buttonText}
                />
              </View>
            </View>
          </View>
        </View>
      )}
      {viewState === GAS_SETTINGS_STATE_ENUM.UPDATED && (
        <View style={styles.updatedWrapper}>
          <DarkGreenCheck width={16} height={16} style={styles.updatedIcon} />
          <TextV3.Description extraStyles={styles.updatedBoxText}>
            {constants.TRANSACTION_UPDATED_STRING}
          </TextV3.Description>
        </View>
      )}
      {viewState === GAS_SETTINGS_STATE_ENUM.ERROR && (
        <View style={styles.cancelErrorWrapper}>
          <ErrorIcon width={16} height={16} style={styles.cancelErrorIcon} />
          <TextV3.Description extraStyles={styles.cancelErrorBoxText}>
            {cancelError}
          </TextV3.Description>
        </View>
      )}
      {viewState === GAS_SETTINGS_STATE_ENUM.CANCEL && (
        <View style={styles.cancel}>
          <View style={styles.cancelBox}>
            <View style={styles.cancelBoxContent}>
              <View style={styles.cancelHeader}>
                <TextV3.CaptionStrong
                  margin={false}
                  color={COLORS_ENUMS.BLACK}
                  extraStyles={styles.cancelBodyTitle}
                >
                  {constants.CANCEL_TRANSACTION_STRING}?
                </TextV3.CaptionStrong>
              </View>
              <TextV3.Caption
                margin={false}
                color={COLORS_ENUMS.DARK_GRAY_200}
                extraStyles={styles.cancelBodyText}
              >
                {constants.CANCEL_TRANSACTION_PROMPT_STRING}
              </TextV3.Caption>
              <View style={styles.cancelFooter}>
                <ButtonV3
                  type={BUTTON_TYPES_ENUM.PRIMARY_OUTLINE}
                  title={constants.CANCEL_TRANSACTION_STRING}
                  onPress={onCancelTransactionButtonClicked}
                  extraStyles={styles.buttonContainer}
                  extraTitleStyles={styles.buttonText}
                />
                <ButtonV3
                  type={BUTTON_TYPES_ENUM.SECONDARY_SOLID}
                  title={constants.KEEP_STRING}
                  onPress={onKeepButtonClicked}
                  extraStyles={styles.buttonContainer}
                  extraTitleStyles={styles.buttonText}
                />
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default GasSettings;
