import { ChangeEvent, Ref } from 'react';
import { NativeSyntheticEvent, TextInputChangeEventData } from 'react-native';

export default interface AddAssetSettings {
  handleAddAsset: () => void;
  onChangeAddress: (event: ChangeEvent | NativeSyntheticEvent<TextInputChangeEventData>) => void;
  register: Ref<any>;
  control: any;
  onSubmit: (data: any) => void;
  handleSubmit: (callback: (data: any) => void) => void;
  keyword: string;
  filteredAssets: Array<object>;
}
