import { ChangeEvent, Ref } from 'react';
import { NativeSyntheticEvent, TextInputChangeEventData } from 'react-native';
import { IAssetInfoState } from 'state/assets/types';

export interface IConfirmationContainer {
  navigation: any;
  route: any;
}

export default interface IConfirmationInfo {
  onViewSwapHistoryPressed: () => void;
  onDonePressed: () => void;
}
