///////////////////////////
// Modules
///////////////////////////

import React, { FC } from 'react';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { scale } from 'react-native-size-matters';

///////////////////////////
// Components
///////////////////////////

import TextInput from 'components/TextInput';
import TextV3 from 'components/TextV3';
import ButtonV3, { BUTTON_SIZES_ENUM, BUTTON_TYPES_ENUM } from 'components/ButtonV3';
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
  handleAddressChange,
  handleNameChange,
  handleSymbolChange,
  handleDecimalsChange,
  handleSubmit,
  onSubmit,
}) => {

  ///////////////////////////
  // Render
  ///////////////////////////
  
  return (
    <KeyboardAwareScrollView 
      contentContainerStyle={styles.container} 
      extraScrollHeight={EXTRA_SCROLL_HEIGHT}>
        <TextInput
          name="tokenAddress"
          defaultValue={tokenAddress}
          placeholder="0x..."
          label="Token Address"
          control={control}
          onChange={(text) => {
            handleAddressChange({ target: { value: text } });
          }}
          // rightIconContainerStyle={styles.inputRightIcon}
          returnKeyType="done"
          // rightIcon={<RenderRecipientRightButton />}
        />
        <TextInput
          name="tokenName"
          defaultValue={tokenName}
          placeholder="Ethereum"
          label="Token Name"
          control={control}
          labelStyle={styles.label}
          returnKeyType="done"
          onChange={(text) => {
            handleNameChange({ target: { value: text } });
          }}
        />
        <TextInput
          name="tokenSymbol"
          defaultValue={tokenSymbol}
          placeholder="ETH"
          label="Token Symbol"
          control={control}
          labelStyle={styles.label}
          returnKeyType="done"
          onChange={(text) => {
            handleSymbolChange({ target: { value: text } });
          }}
        />
        <TextInput
          name="tokenDecimals"
          defaultValue={tokenDecimals}
          placeholder="18"
          label="Decimals"
          control={control}
          labelStyle={styles.label}
          keyboardType="number-pad"
          returnKeyType="done"
          onChange={(text) => {
            handleDecimalsChange({ target: { value: text } });
          }}
        />
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
            disabled={false}
            onPress={handleSubmit((data) => {
              onSubmit(data);
            })}
          />
        </View>
    </KeyboardAwareScrollView>
  );
};

export default AddCustomAsset;
