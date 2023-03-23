import { ChangeEvent } from 'react';
import { GAS_SETTINGS_STATE_ENUM } from './constants';

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
  cancelError: string;
  onSliderChange: (_event: ChangeEvent<{}>, value: number | number[]) => void;
  onSpeedUpClick: (gas: number) => void;
  onCancelClick: () => void;
};

export default interface IGasSettings extends IGasSettingsProps {
  onSpeedUpButtonClick: () => void;
  onCancelButtonClick: () => void;
  onSettingCancelButtonClick: () => void;
  onSpeedUpConfirmButtonClicked: () => void;
  onKeepButtonClicked: () => void;
  onCancelTransactionButtonClicked: () => void;
  viewState: GAS_SETTINGS_STATE_ENUM;
  setViewState: (viewState: GAS_SETTINGS_STATE_ENUM) => void;
  getFiatAmount: (amount: number, fraction: number, basePriceId: string) => void;
}
