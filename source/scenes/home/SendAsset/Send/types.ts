import { IInputClickableOptions } from 'components/InputClickable/types';
import { ChangeEvent } from 'react';
import {
  Control,
  FieldError,
  FieldValues,
  NestDataObject,
  OnSubmit,
} from 'react-hook-form';
import { IAssetInfoState } from 'state/assets/types';
import { AssetBalances, IActiveAssetState, IAssetState } from 'state/vault/types';

export interface IWalletSend {
  control?: Control<FieldValues>;
  modalOpened: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleSelectContact: (val: string) => void;
  handleSubmit: (
    callback: OnSubmit<FieldValues>
  ) => (e?: React.BaseSyntheticEvent<object, any, any>) => Promise<void>;
  handleAddressChange: (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleAmountChange: (val: string) => void;
  handleSetMax: () => void;
  handleFeeChange: (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleGetDAGTxFee: () => void;
  handleGasPriceChange: (_: any, val: number | number[]) => void;
  handleClose: () => Promise<void>;
  onSubmit: (data: any) => Promise<void>;
  isExternalRequest: boolean;
  isDisabled: boolean;
  isValidAddress: boolean;
  balances: AssetBalances;
  activeAsset: IAssetInfoState | IActiveAssetState | IAssetState;
  nativeToken: string;
  assetInfo: IAssetInfoState;
  address: string;
  register: () => void;
  amount: string | number;
  getFiatAmount: (amount: number, fraction?: number, basePriceId?: string) => string;
  errors: NestDataObject<FieldValues, FieldError>;
  fee: string;
  recommend: number;
  gasPrices: number[];
  gasPrice: number;
  gasFee: number;
  gasSpeedLabel: string;
  decimalPointOnAmount?: boolean;
  decimalPointOnFee?: boolean;
  networkTypeOptions: IInputClickableOptions;
  basePriceId: string;
}
