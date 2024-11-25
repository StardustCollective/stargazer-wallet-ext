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
import WarningIcon from 'assets/images/svg/warning.svg';

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
  l0endpoint,
  cl1endpoint,
  dl1endpoint,
  tokenName,
  tokenSymbol,
  tokenDecimals,
  networkTypeOptions,
  isL0Token,
  handleAddressScan,
  handleAddressChange,
  handleL0endpointChange,
  handlecL1endpointChange,
  handledL1endpointChange,
  handleNameChange,
  handleSymbolChange,
  handleDecimalsChange,
  handleSubmit,
  onSubmit,
  errors,
  buttonDisabled,
  buttonLoading,
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

  const tokenAddressLabel = isL0Token ? 'Metagraph Address' : 'Token Address';
  const tokenAddressPlaceholder = isL0Token ? 'DAG...' : '0x...';
  const tokenNamePlaceholder = isL0Token ? 'Enter token name' : 'Ethereum';
  const tokenSymbolPlaceholder = isL0Token ? 'Enter token symbol' : 'ETH';

  ///////////////////////////
  // Render
  ///////////////////////////

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      extraScrollHeight={EXTRA_SCROLL_HEIGHT}
    >
      <InputClickable options={networkTypeOptions} />
      <TextInput
        name="tokenAddress"
        defaultValue={tokenAddress}
        placeholder={tokenAddressPlaceholder}
        label={tokenAddressLabel}
        control={control}
        onChange={(text) => {
          handleAddressChange(text);
        }}
        error={!!errors?.tokenAddress}
        returnKeyType="done"
        rightIcon={!isL0Token && <QRCodeButtonIcon />}
      />
      <TextV3.Caption color={COLORS_ENUMS.RED} extraStyles={styles.errorMessage}>
        {!!errors?.tokenAddress ? errors?.tokenAddress?.message : ' '}
      </TextV3.Caption>
      {isL0Token && (
        <>
          <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK} extraStyles={styles.endpoints}>
            Endpoints
          </TextV3.CaptionStrong>
          <View style={styles.endpointsContainer}>
            <TextInput
              name="l0endpoint"
              defaultValue={l0endpoint}
              placeholder="Enter endpoint URL"
              label="L0 Endpoint"
              control={control}
              labelStyle={styles.label}
              returnKeyType="done"
              error={!!errors?.l0endpoint}
              onChange={(text) => {
                handleL0endpointChange(text);
              }}
            />
            <TextV3.Caption color={COLORS_ENUMS.RED} extraStyles={styles.errorMessage}>
              {!!errors?.l0endpoint ? errors?.l0endpoint?.message : ' '}
            </TextV3.Caption>
            <TextInput
              name="cl1endpoint"
              defaultValue={cl1endpoint}
              placeholder="Enter endpoint URL"
              label="L1 Currency Endpoint"
              control={control}
              labelStyle={styles.label}
              returnKeyType="done"
              error={!!errors?.cl1endpoint}
              onChange={(text) => {
                handlecL1endpointChange(text);
              }}
            />
            <TextV3.Caption color={COLORS_ENUMS.RED} extraStyles={styles.errorMessage}>
              {!!errors?.cl1endpoint ? errors?.cl1endpoint?.message : ' '}
            </TextV3.Caption>
            <TextInput
              name="dl1endpoint"
              defaultValue={dl1endpoint}
              placeholder="Enter endpoint URL"
              label="L1 Data Endpoint"
              control={control}
              labelStyle={styles.label}
              returnKeyType="done"
              error={!!errors?.dl1endpoint}
              onChange={(text) => {
                handledL1endpointChange(text);
              }}
            />
            <TextV3.Caption color={COLORS_ENUMS.RED} extraStyles={styles.errorMessage}>
              {!!errors?.dl1endpoint ? errors?.dl1endpoint?.message : ' '}
            </TextV3.Caption>
          </View>
        </>
      )}
      <TextInput
        name="tokenName"
        defaultValue={tokenName}
        placeholder={tokenNamePlaceholder}
        label="Token Name"
        control={control}
        labelStyle={styles.label}
        returnKeyType="done"
        error={!!errors?.tokenName}
        onChange={(text) => {
          handleNameChange(text);
        }}
      />
      <TextV3.Caption color={COLORS_ENUMS.RED} extraStyles={styles.errorMessage}>
        {!!errors?.tokenName ? errors?.tokenName?.message : ' '}
      </TextV3.Caption>
      <TextInput
        name="tokenSymbol"
        defaultValue={tokenSymbol}
        placeholder={tokenSymbolPlaceholder}
        label="Token Symbol"
        control={control}
        labelStyle={styles.label}
        returnKeyType="done"
        error={!!errors?.tokenSymbol}
        onChange={(text) => {
          handleSymbolChange(text);
        }}
      />
      <TextV3.Caption color={COLORS_ENUMS.RED} extraStyles={styles.errorMessage}>
        {!!errors?.tokenSymbol ? errors?.tokenSymbol?.message : ' '}
      </TextV3.Caption>
      {!isL0Token && (
        <>
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
          <TextV3.Caption color={COLORS_ENUMS.RED} extraStyles={styles.errorMessage}>
            {!!errors?.tokenDecimals ? errors?.tokenDecimals?.message : ' '}
          </TextV3.Caption>
        </>
      )}
      <View style={styles.warningContainer}>
        <WarningIcon width={20} height={20} style={styles.warningIcon} />
        <TextV3.Caption color={COLORS_ENUMS.BLACK} extraStyles={styles.warningText}>
          Anyone can create a custom token, including fake versions of existing tokens. To
          avoid security risks, make sure the token you are importing is verified.
        </TextV3.Caption>
      </View>
      <View style={styles.buttonContainer}>
        <ButtonV3
          type={BUTTON_TYPES_ENUM.PRIMARY_SOLID}
          size={BUTTON_SIZES_ENUM.LARGE}
          title="Add Token"
          disabled={buttonDisabled}
          loading={buttonLoading}
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
