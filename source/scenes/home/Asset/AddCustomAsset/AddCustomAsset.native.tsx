///////////////////////////
// Modules
///////////////////////////

import React, { FC, useState } from 'react';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { scale } from 'react-native-size-matters';

///////////////////////////
// Components
///////////////////////////

import TextInput from 'components/TextInput';
import TextV3 from 'components/TextV3';
import InputClickable from 'components/InputClickable';
import ButtonV3, { BUTTON_SIZES_ENUM, BUTTON_TYPES_ENUM } from 'components/ButtonV3';
import QRCodeScanner from 'components/QRCodeScanner';
import QRCodeButton from 'components/QRCodeButton';
import WarningIcon from 'assets/images/svg/warning.svg'

///////////////////////////
// Types
///////////////////////////

import IAddCustomAsset from './types';

///////////////////////////
// Styles
///////////////////////////

import styles from './styles';

///////////////////////////
// Constants
///////////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';
const EXTRA_SCROLL_HEIGHT = scale(25);

const AddCustomAsset: FC<IAddCustomAsset> = ({
  control,
  tokenAddress,
  tokenName,
  tokenSymbol,
  tokenDecimals,
  networkTypeOptions,
  handleAddressScan,
  handleAddressChange,
  handleNameChange,
  handleSymbolChange,
  handleDecimalsChange,
  handleSubmit,
  onSubmit,
  errors,
  buttonDisabled,
}) => {
  const [cameraOpen, setCameraOpen] = useState(false);

  const QRCodeButtonIcon = () => {
    return (
      <View style={styles.qrCodeContainer}>
        <QRCodeButton
          size={20}
          onPress={() => {
            setCameraOpen(true);
          }}
        />
      </View>
    );
  };

  ///////////////////////////
  // Render
  ///////////////////////////
  
  return (
    <KeyboardAwareScrollView 
      contentContainerStyle={styles.container} 
      extraScrollHeight={EXTRA_SCROLL_HEIGHT}>
        <InputClickable options={networkTypeOptions} />
        <TextInput
          name="tokenAddress"
          defaultValue={tokenAddress}
          placeholder="0x..."
          label="Token Address"
          control={control}
          onChange={(text) => {
            handleAddressChange(text);
          }}
          error={!!errors?.tokenAddress}
          returnKeyType="done"
          rightIcon={<QRCodeButtonIcon />}
        />
        <TextV3.Caption 
          color={COLORS_ENUMS.RED} 
          extraStyles={styles.errorMessage}>
            {!!errors?.tokenAddress ? errors?.tokenAddress?.message: ' '}
        </TextV3.Caption>
        <TextInput
          name="tokenName"
          defaultValue={tokenName}
          placeholder="Ethereum"
          label="Token Name"
          control={control}
          labelStyle={styles.label}
          returnKeyType="done"
          error={!!errors?.tokenName}
          onChange={(text) => {
            handleNameChange(text);
          }}
        />
        <TextV3.Caption 
          color={COLORS_ENUMS.RED} 
          extraStyles={styles.errorMessage}>
            {!!errors?.tokenName ? errors?.tokenName?.message: ' '}
        </TextV3.Caption>
        <TextInput
          name="tokenSymbol"
          defaultValue={tokenSymbol}
          placeholder="ETH"
          label="Token Symbol"
          control={control}
          labelStyle={styles.label}
          returnKeyType="done"
          error={!!errors?.tokenSymbol}
          onChange={(text) => {
            handleSymbolChange(text);
          }}
        />
        <TextV3.Caption 
          color={COLORS_ENUMS.RED} 
          extraStyles={styles.errorMessage}>
            {!!errors?.tokenSymbol ? errors?.tokenSymbol?.message: ' '}
        </TextV3.Caption>
        <TextInput
          name="tokenDecimals"
          defaultValue={tokenDecimals}
          placeholder="18"
          label="Decimals"
          control={control}
          labelStyle={styles.label}
          keyboardType="number-pad"
          returnKeyType="done"
          error={!!errors?.tokenDecimals}
          onChange={(text) => {
            handleDecimalsChange(text);
          }}
        />
        <TextV3.Caption 
          color={COLORS_ENUMS.RED} 
          extraStyles={styles.errorMessage}>
            {!!errors?.tokenDecimals ? errors?.tokenDecimals?.message: ' '}
        </TextV3.Caption>
        <View style={styles.warningContainer}>
          <WarningIcon width={20} height={20} style={styles.warningIcon} />
          <TextV3.Caption color={COLORS_ENUMS.BLACK} extraStyles={styles.warningText}>
            Anyone can create a custom token, including fake versions of existing tokens. To avoid security risks, make sure the token you are importing is verified.
          </TextV3.Caption>
        </View>
        <View style={styles.buttonContainer}>
          <ButtonV3
            type={BUTTON_TYPES_ENUM.PRIMARY_SOLID}
            size={BUTTON_SIZES_ENUM.LARGE}
            title="Add Token"
            disabled={buttonDisabled}
            onPress={handleSubmit((data) => {
              onSubmit(data);
            })}
          />
        </View>
        <QRCodeScanner
          visble={cameraOpen}
          onRead={(event) => {
            handleAddressScan(event.data);
            setCameraOpen(false);
          }}
          onClosePress={() => {
            setCameraOpen(false);
          }}
        />
    </KeyboardAwareScrollView>
  );
};

export default AddCustomAsset;
