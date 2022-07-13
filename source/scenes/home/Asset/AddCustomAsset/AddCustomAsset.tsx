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
  tokenName,
  tokenSymbol,
  tokenDecimals,
  handleAddressChange,
  handleNameChange,
  handleSymbolChange,
  handleDecimalsChange,
  handleSubmit,
  onSubmit,
  errors,
  buttonDisabled,
}) => {
  
  const inputClass = clsx(styles.input, styles.address);

  ///////////////////////////
  // Render
  ///////////////////////////

  return (
    <div className={styles.container}>
      <section>
        <ul className={styles.form}>
          <li>
            <label>Token Address</label>
            <TextInput
              placeholder="0x..."
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
              <TextV3.Caption 
                color={COLORS_ENUMS.RED} 
                extraStyles={styles.errorMessage}>
                  {!!errors?.tokenAddress ? errors?.tokenAddress?.message: ' '}
              </TextV3.Caption>
          </li>
          <li>
            <label>Token Name</label>
            <TextInput
              placeholder="Ethereum"
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
              <TextV3.Caption 
                color={COLORS_ENUMS.RED} 
                extraStyles={styles.errorMessage}>
                  {!!errors?.tokenName ? errors?.tokenName?.message: ' '}
              </TextV3.Caption>
          </li>
          <li>
            <label>Token Symbol</label>
            <TextInput
              placeholder="ETH"
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
              <TextV3.Caption 
                color={COLORS_ENUMS.RED} 
                extraStyles={styles.errorMessage}>
                  {!!errors?.tokenSymbol ? errors?.tokenSymbol?.message: ' '}
              </TextV3.Caption>
          </li>
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
              <TextV3.Caption 
                color={COLORS_ENUMS.RED} 
                extraStyles={styles.errorMessage}>
                  {!!errors?.tokenDecimals ? errors?.tokenDecimals?.message: ' '}
              </TextV3.Caption>
          </li>
        </ul>
        <div className={styles.warningContainer}>
          <img src={`/${WarningIcon}`} color="white" height={20} width={20} alt="warning" />
          <TextV3.Caption color={COLORS_ENUMS.BLACK} extraStyles={styles.warningText}>
            Anyone can create a custom token, including fake versions of existing tokens. To avoid security risks, make sure the token you are importing is verified.
          </TextV3.Caption>
        </div>
        <div className={styles.buttonContainer}>
          <ButtonV3
            type={BUTTON_TYPES_ENUM.PRIMARY_SOLID}
            size={BUTTON_SIZES_ENUM.LARGE}
            label="Add Token"
            disabled={buttonDisabled}
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
