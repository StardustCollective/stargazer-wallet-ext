import { IProviderDataState, IProviderInfoState } from 'state/providers/types';

export interface IBuyAssetContainer {
  navigation: any;
  route: any;
}

export interface IBuyAsset {
  amount: string;
  message: string;
  handleItemClick: (value: string) => void;
  handleConfirm: () => void;
  buttonDisabled: boolean;
  buttonLoading: boolean;
  provider: IProviderInfoState;
  response: IProviderDataState;
}
