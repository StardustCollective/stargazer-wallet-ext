///////////////////////
// Modules
///////////////////////

import React, { FC } from 'react';
import { View } from 'react-native';

///////////////////////
// Components
///////////////////////

import ButtonV3, { BUTTON_SIZES_ENUM, BUTTON_TYPES_ENUM } from 'components/ButtonV3';
import TextInput from 'components/TextInput';
import TextV3 from 'components/TextV3';
import InputClickable from 'components/InputClickable';

///////////////////////
// Types
///////////////////////

import IAddNetwork from './types';

///////////////////////
// Styles
///////////////////////

import styles from './styles';

///////////////////////
// Constants
///////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';

const AddNetwork: FC<IAddNetwork> = ({
  control,
  errors,
  saveDisabled,
  networkTypeOptions,
  chainName,
  rpcUrl,
  chainId,
  blockExplorerUrl,
  handleChainNameChange,
  handleRpcUrlChange,
  handleChainIdChange,
  handleBlockExplorerUrlChange,
  handleSave,
}) => {
  const isChainIdVisible = networkTypeOptions.value === 'ethereum';

  ///////////////////////
  // Render
  ///////////////////////

  return (
    <View style={styles.container}>
      <InputClickable options={networkTypeOptions} />
      <TextInput
        name="chainName"
        defaultValue={chainName}
        placeholder="Enter the chain name"
        label="Chain Name"
        control={control}
        onChange={(text) => {
          handleChainNameChange(text);
        }}
        error={!!errors?.chainName}
        returnKeyType="done"
      />
      <TextV3.Caption color={COLORS_ENUMS.RED} extraStyles={styles.errorMessage}>
        {!!errors?.chainName ? errors?.chainName?.message : ' '}
      </TextV3.Caption>
      <TextInput
        name="rpcUrl"
        defaultValue={rpcUrl}
        placeholder="Enter RPC URL"
        label="RPC URL"
        control={control}
        onChange={(text) => {
          handleRpcUrlChange(text);
        }}
        error={!!errors?.rpcUrl}
        returnKeyType="done"
      />
      <TextV3.Caption color={COLORS_ENUMS.RED} extraStyles={styles.errorMessage}>
        {!!errors?.rpcUrl ? errors?.rpcUrl?.message : ' '}
      </TextV3.Caption>
      {!!isChainIdVisible && (
        <>
          <TextInput
            type="number"
            name="chainId"
            defaultValue={chainId}
            placeholder="Enter the chain ID"
            label="Chain ID"
            control={control}
            onChange={(text) => {
              handleChainIdChange(text);
            }}
            error={!!errors?.chainId}
            returnKeyType="done"
          />
          <TextV3.Caption color={COLORS_ENUMS.RED} extraStyles={styles.errorMessage}>
            {!!errors?.chainId ? errors?.chainId?.message : ' '}
          </TextV3.Caption>
        </>
      )}
      <TextInput
        name="blockExplorerUrl"
        defaultValue={blockExplorerUrl}
        placeholder="Enter the block explorer URL"
        label="Block Explorer URL"
        control={control}
        onChange={(text) => {
          handleBlockExplorerUrlChange(text);
        }}
        error={!!errors?.blockExplorerUrl}
        returnKeyType="done"
      />
      <TextV3.Caption color={COLORS_ENUMS.RED} extraStyles={styles.errorMessage}>
        {!!errors?.blockExplorerUrl ? errors?.blockExplorerUrl?.message : ' '}
      </TextV3.Caption>
      <View style={styles.buttonContainer}>
        <ButtonV3
          title="Save"
          type={BUTTON_TYPES_ENUM.PRIMARY_SOLID}
          size={BUTTON_SIZES_ENUM.LARGE}
          onPress={handleSave}
          disabled={saveDisabled}
        />
      </View>
    </View>
  );
};

export default AddNetwork;
