import { ChangeEvent, Ref } from 'react';
import { NativeSyntheticEvent, TextInputChangeEventData } from 'react-native';
import { IAssetInfoState } from 'state/assets/types';

export interface ISwapTokensContainer {
  navigation: any;
  route: any;
}

export default interface ISwapTokens {
  onNextPressed: () => void;
}
