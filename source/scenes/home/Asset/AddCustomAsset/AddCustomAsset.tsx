///////////////////////////
// Modules
///////////////////////////

import React, { FC } from 'react';
import clsx from 'clsx';

///////////////////////////
// Components
///////////////////////////

import TextInput from 'components/TextInput';
import TextV3 from 'components/TextV3';
import InputClickable from 'components/InputClickable';
import ButtonV3, { BUTTON_SIZES_ENUM, BUTTON_TYPES_ENUM } from 'components/ButtonV3';
import WarningIcon from 'assets/images/svg/warning.svg';

///////////////////////////
// Types
///////////////////////////

import IAddCustomAsset from './types';

///////////////////////////
// Styles
///////////////////////////

import styles from './AddCustomAsset.scss';
import { COLORS_ENUMS } from 'assets/styles/colors';

const AddCustomAsset: FC<IAddCustomAsset> = ({
  register,
  tokenAddress,
  l0endpoint,
  l1endpoint,
  tokenName,
  tokenSymbol,
  tokenDecimals,
  networkTypeOptions,
  isL0Token,
  handleAddressChange,
  handleL0endpointChange,
  handleL1endpointChange,
  handleNameChange,
  handleSymbolChange,
  handleDecimalsChange,
  handleSubmit,
  onSubmit,
  errors,
  buttonDisabled,
  buttonLoading,
}) => {
  const inputClass = clsx(styles.input, styles.address);

  const tokenAddressLabel = isL0Token ? 'Metagraph address' : 'Token address';
  const tokenAddressPlaceholder = isL0Token ? 'DAG...' : '0x...';
  const tokenNamePlaceholder = isL0Token ? 'Enter token name' : 'Ethereum';
  const tokenSymbolPlaceholder = isL0Token ? 'Enter token symbol' : 'ETH';

  ///////////////////////////
  // Render
  ///////////////////////////

  return (
    <div className={styles.container}>
      <section>
        <ul className={styles.form}>
          <li>
            <InputClickable options={networkTypeOptions} />
          </li>
          <li>
            <label>{tokenAddressLabel}</label>
            <TextInput
              placeholder={tokenAddressPlaceholder}
              fullWidth
              inputRef={register}
              id="tokenAddress"
              name="tokenAddress"
              value={tokenAddress}
              onChange={(ev) => handleAddressChange(ev.target.value)}
              disabled={false}
              error={!!errors?.tokenAddress}
              variant={inputClass}
            />
            <TextV3.Caption color={COLORS_ENUMS.RED} extraStyles={styles.errorMessage}>
              {!!errors?.tokenAddress ? errors?.tokenAddress?.message : ' '}
            </TextV3.Caption>
          </li>
          {isL0Token && (
            <>
              <li>
                <label>L0 endpoint</label>
                <TextInput
                  placeholder="Enter endpoint URL"
                  fullWidth
                  inputRef={register}
                  id="l0endpoint"
                  name="l0endpoint"
                  value={l0endpoint}
                  onChange={(ev) => handleL0endpointChange(ev.target.value)}
                  disabled={false}
                  error={!!errors?.l0endpoint}
                  variant={inputClass}
                />
                <TextV3.Caption
                  color={COLORS_ENUMS.RED}
                  extraStyles={styles.errorMessage}
                >
                  {!!errors?.l0endpoint ? errors?.l0endpoint?.message : ' '}
                </TextV3.Caption>
              </li>
              <li>
                <label>L1 endpoint</label>
                <TextInput
                  placeholder="Enter endpoint URL"
                  fullWidth
                  inputRef={register}
                  id="l1endpoint"
                  name="l1endpoint"
                  value={l1endpoint}
                  onChange={(ev) => handleL1endpointChange(ev.target.value)}
                  disabled={false}
                  error={!!errors?.l1endpoint}
                  variant={inputClass}
                />
                <TextV3.Caption
                  color={COLORS_ENUMS.RED}
                  extraStyles={styles.errorMessage}
                >
                  {!!errors?.l1endpoint ? errors?.l1endpoint?.message : ' '}
                </TextV3.Caption>
              </li>
            </>
          )}
          <li>
            <label>Token name</label>
            <TextInput
              placeholder={tokenNamePlaceholder}
              fullWidth
              inputRef={register}
              id="tokenName"
              name="tokenName"
              value={tokenName}
              onChange={(ev) => handleNameChange(ev.target.value)}
              disabled={false}
              error={!!errors?.tokenName}
              variant={inputClass}
            />
            <TextV3.Caption color={COLORS_ENUMS.RED} extraStyles={styles.errorMessage}>
              {!!errors?.tokenName ? errors?.tokenName?.message : ' '}
            </TextV3.Caption>
          </li>
          <li>
            <label>Token symbol</label>
            <TextInput
              placeholder={tokenSymbolPlaceholder}
              fullWidth
              inputRef={register}
              id="tokenSymbol"
              name="tokenSymbol"
              value={tokenSymbol}
              onChange={(ev) => handleSymbolChange(ev.target.value)}
              disabled={false}
              error={!!errors?.tokenSymbol}
              variant={inputClass}
            />
            <TextV3.Caption color={COLORS_ENUMS.RED} extraStyles={styles.errorMessage}>
              {!!errors?.tokenSymbol ? errors?.tokenSymbol?.message : ' '}
            </TextV3.Caption>
          </li>
          {!isL0Token && (
            <li>
              <label>Decimals</label>
              <TextInput
                type="number"
                placeholder="18"
                fullWidth
                inputRef={register}
                id="tokenDecimals"
                name="tokenDecimals"
                value={tokenDecimals}
                onChange={(ev) => handleDecimalsChange(ev.target.value)}
                disabled={false}
                error={!!errors?.tokenDecimals}
                variant={inputClass}
              />
              <TextV3.Caption color={COLORS_ENUMS.RED} extraStyles={styles.errorMessage}>
                {!!errors?.tokenDecimals ? errors?.tokenDecimals?.message : ' '}
              </TextV3.Caption>
            </li>
          )}
        </ul>
        <div className={styles.warningContainer}>
          <img
            src={`/${WarningIcon}`}
            color="white"
            height={20}
            width={20}
            alt="warning"
          />
          <TextV3.Caption color={COLORS_ENUMS.BLACK} extraStyles={styles.warningText}>
            Anyone can create a custom token, including fake versions of existing tokens.
            To avoid security risks, make sure the token you are importing is verified.
          </TextV3.Caption>
        </div>
        <div className={styles.buttonContainer}>
          <ButtonV3
            type={BUTTON_TYPES_ENUM.PRIMARY_SOLID}
            size={BUTTON_SIZES_ENUM.LARGE}
            label="Add Token"
            disabled={buttonDisabled}
            loading={buttonLoading}
            extraStyle={styles.button}
            onClick={handleSubmit((data: any) => {
              onSubmit(data);
            })}
          />
        </div>
      </section>
    </div>
  );
};

export default AddCustomAsset;
