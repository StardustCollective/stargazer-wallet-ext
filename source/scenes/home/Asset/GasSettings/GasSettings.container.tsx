import React, { FC, useState } from 'react';

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
  onSliderChange,
  onSpeedUpClick,
}) => {
  const [viewState, setViewState] = useState<GAS_SETTINGS_STATE_ENUM>(GAS_SETTINGS_STATE_ENUM.OPTIONS);
  const getFiatAmount = useFiat();

  const onSpeedUpButtonClick = () => {
    setViewState(GAS_SETTINGS_STATE_ENUM.SETTINGS);
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
    setViewState(GAS_SETTINGS_STATE_ENUM.NONE);
  };

  return (
    <GasSettings
      onSpeedUpButtonClick={onSpeedUpButtonClick}
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
      onSliderChange={onSliderChange}
      onSpeedUpClick={onSpeedUpClick}
      getFiatAmount={getFiatAmount}
    />
  );
};

export default GasSettingsContainer;
