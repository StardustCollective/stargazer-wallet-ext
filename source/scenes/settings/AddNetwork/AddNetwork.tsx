///////////////////////
// Modules
///////////////////////

import React, { FC } from 'react';

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

import styles from './AddNetwork.scss';

///////////////////////
// Constants
///////////////////////

import { COLORS_ENUMS } from 'assets/styles/colors';

const AddNetwork: FC<IAddNetwork> = ({
  register,
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
    <div className={styles.container}>
      <InputClickable options={networkTypeOptions} />
      <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK} extraStyles={styles.label}>
        Chain Name
      </TextV3.CaptionStrong>
      <TextInput
        inputRef={register}
        name="chainName"
        id="chainName"
        value={chainName}
        placeholder="Enter the chain name"
        label="Chain Name"
        control={control}
        onChange={(ev) => {
          handleChainNameChange(ev.target.value);
        }}
        error={!!errors?.chainName}
      />
      <TextV3.Caption color={COLORS_ENUMS.RED} extraStyles={styles.errorMessage}>
        {!!errors?.chainName ? errors?.chainName?.message : ' '}
      </TextV3.Caption>
      <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK} extraStyles={styles.label}>
        RPC URL
      </TextV3.CaptionStrong>
      <TextInput
        inputRef={register}
        name="rpcUrl"
        id="rpcUrl"
        value={rpcUrl}
        placeholder="Enter RPC URL"
        label="RPC URL"
        control={control}
        onChange={(ev) => {
          handleRpcUrlChange(ev.target.value);
        }}
        error={!!errors?.rpcUrl}
      />
      <TextV3.Caption color={COLORS_ENUMS.RED} extraStyles={styles.errorMessage}>
        {!!errors?.rpcUrl ? errors?.rpcUrl?.message : ' '}
      </TextV3.Caption>
      {!!isChainIdVisible && (
        <>
          <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK} extraStyles={styles.label}>
            Chain ID
          </TextV3.CaptionStrong>
          <TextInput
            inputRef={register}
            type="number"
            name="chainId"
            id="chainId"
            value={chainId}
            placeholder="Enter the chain ID"
            label="Chain ID"
            control={control}
            onChange={(ev) => {
              handleChainIdChange(ev.target.value);
            }}
            error={!!errors?.chainId}
          />
          <TextV3.Caption color={COLORS_ENUMS.RED} extraStyles={styles.errorMessage}>
            {!!errors?.chainId ? errors?.chainId?.message : ' '}
          </TextV3.Caption>
        </>
      )}
      <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK} extraStyles={styles.label}>
        Block Explorer URL
      </TextV3.CaptionStrong>
      <TextInput
        inputRef={register}
        name="blockExplorerUrl"
        id="blockExplorerUrl"
        value={blockExplorerUrl}
        placeholder="Enter the block explorer URL"
        label="Block Explorer URL"
        control={control}
        onChange={(ev) => {
          handleBlockExplorerUrlChange(ev.target.value);
        }}
        error={!!errors?.blockExplorerUrl}
      />
      <TextV3.Caption color={COLORS_ENUMS.RED} extraStyles={styles.errorMessage}>
        {!!errors?.blockExplorerUrl ? errors?.blockExplorerUrl?.message : ' '}
      </TextV3.Caption>
      <div className={styles.buttonContainer}>
        <ButtonV3
          label="Save"
          type={BUTTON_TYPES_ENUM.PRIMARY_SOLID}
          size={BUTTON_SIZES_ENUM.LARGE}
          onClick={handleSave}
          disabled={saveDisabled}
          extraStyle={styles.saveButton}
        />
      </div>
    </div>
  );
};

export default AddNetwork;
