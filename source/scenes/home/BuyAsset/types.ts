import { IMenuItem } from 'components/Menu/types';
import { IProviderDataState, IProviderInfoState } from 'state/providers/types';

export interface IBuyAssetContainer {
  navigation: any;
  route: any;
}

export interface IBuyAsset {
  amount: string;
  message: string;
  isErrorMessage: boolean;
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
  handleItemClick: (value: string) => void;
  handleConfirm: () => void;
  buttonDisabled: boolean;
  buttonLoading: boolean;
  provider: IProviderInfoState;
  response: IProviderDataState;
  providersItems: IMenuItem[];
  isProviderSelectorOpen: boolean;
  setIsProviderSelectorOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
