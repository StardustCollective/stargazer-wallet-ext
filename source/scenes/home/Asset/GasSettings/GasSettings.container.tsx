import React, { FC, useState, useEffect } from 'react';

import { useFiat } from 'hooks/usePrice';

import GasSettings from './GasSettings';

import { GAS_SETTINGS_STATE_ENUM } from './constants';
import { IGasSettingsProps } from './types';

const GasSettingsContainer: FC<IGasSettingsProps> = ({
  values,
  speedLabel,
  gasFeeLabel,
  gasPrice,
  gasPrices,
  cancelError,
  onSliderChange,
  onSpeedUpClick,
  onCancelClick,
}) => {
  const [viewState, setViewState] = useState<GAS_SETTINGS_STATE_ENUM>(
    GAS_SETTINGS_STATE_ENUM.OPTIONS
  );
  const getFiatAmount = useFiat();

  useEffect(() => {
    if (cancelError) {
      // TODO: handle error in the future.
      // What should happen if the transaction is not cancelled?
      // setViewState(GAS_SETTINGS_STATE_ENUM.ERROR);
    }
  }, [cancelError]);

  const onSpeedUpButtonClick = () => {
    setViewState(GAS_SETTINGS_STATE_ENUM.SETTINGS);
  };

  const onCancelButtonClick = () => {
    setViewState(GAS_SETTINGS_STATE_ENUM.CANCEL);
  };

  const onSettingCancelButtonClick = () => {
    setViewState(GAS_SETTINGS_STATE_ENUM.OPTIONS);
  };

  const onSpeedUpConfirmButtonClicked = () => {
    setViewState(GAS_SETTINGS_STATE_ENUM.UPDATED);
    onSpeedUpClick(gasPrice);
  };

  const onKeepButtonClicked = () => {
    setViewState(GAS_SETTINGS_STATE_ENUM.OPTIONS);
  };

  const onCancelTransactionButtonClicked = () => {
    onCancelClick();
    setViewState(GAS_SETTINGS_STATE_ENUM.UPDATED);
  };

  return (
    <GasSettings
      onSpeedUpButtonClick={onSpeedUpButtonClick}
      onCancelButtonClick={onCancelButtonClick}
      onSettingCancelButtonClick={onSettingCancelButtonClick}
      onSpeedUpConfirmButtonClicked={onSpeedUpConfirmButtonClicked}
      onKeepButtonClicked={onKeepButtonClicked}
      onCancelTransactionButtonClicked={onCancelTransactionButtonClicked}
      viewState={viewState}
      setViewState={setViewState}
      values={values}
      speedLabel={speedLabel}
      gasFeeLabel={gasFeeLabel}
      gasPrice={gasPrice}
      gasPrices={gasPrices}
      cancelError={cancelError}
      onSliderChange={onSliderChange}
      onSpeedUpClick={onSpeedUpClick}
      onCancelClick={onCancelClick}
      getFiatAmount={getFiatAmount}
    />
  );
};

export default GasSettingsContainer;
