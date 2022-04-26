import { ChangeEvent, Ref } from 'react';
import { NativeSyntheticEvent, TextInputChangeEventData } from 'react-native';
import { IAssetInfoState } from 'state/assets/types';

export default interface AddAssetSettings {
  handleAddAsset: (asset: IAssetInfoState) => void;
  onChangeAddress: (e: ChangeEvent<HTMLInputElement> | NativeSyntheticEvent<TextInputChangeEventData>) => void;
  register?: Ref<any>;
  control?: any;
  onSubmit?: (data: any) => void;
  handleSubmit?: (callback: (data: any) => void) => void;
  keyword: string;
  filteredAssets: Array<object>;
}
