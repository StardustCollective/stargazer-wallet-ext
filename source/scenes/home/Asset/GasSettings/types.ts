import { ChangeEvent } from 'react';
import { BUTTON_TYPE_ENUM, GAS_SETTINGS_STATE_ENUM } from './constants';

export type IOutlineButtonProps = {
  label: string;
  onClick: () => void;
  type?: BUTTON_TYPE_ENUM;
};

export type IGasSettingsProps = {
  values: {
    min: number;
    max: number;
    current: number;
  };
  speedLabel: string;
  gasFeeLabel: number;
  gasPrice: number;
  gasPrices: number[];
  onSliderChange: (_event: ChangeEvent<{}>, value: number | number[]) => void;
  onSpeedUpClick: (gas: number) => void;
};

export default interface IGasSettings extends IGasSettingsProps {
  onSpeedUpButtonClick: () => void;
  onSettingCancelButtonClick: () => void;
  onSpeedUpConfirmButtonClicked: () => void;
  onKeepButtonClicked: () => void;
  onCancelTransactionButtonClicked: () => void;
  viewState: GAS_SETTINGS_STATE_ENUM;
  setViewState: (viewState: GAS_SETTINGS_STATE_ENUM) => void;
  getFiatAmount: (amount: number, fraction: number, basePriceId: string) => void;
}
