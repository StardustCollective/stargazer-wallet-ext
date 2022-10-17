import { ChangeEvent, Ref } from 'react';
import { NativeSyntheticEvent, TextInputChangeEventData } from 'react-native';
import { IAssetInfoState } from 'state/assets/types';

export interface ISwapTokensContainer {
  navigation: any;
  route: any;
}

export default interface ITransferInfo {
  onNextPressed: () => void;
  from: {
    code: string,
    amount: number
  };
  to: {
    code: string,
    amount: number,
  };
  depositAddress: string,
  gas: {
    prices: number[],
    price: number,
    fee: number,
    speedLabel: string,
    basePriceId: string,
  },
  onGasPriceChange: (_: any, val: number | number[]) => void;
  getFiatAmount: (amount: number, fraction?: number, basePriceId?: string) => string;
  onRecommendedPress: () => void;
  onTransactionFeeChange: (fee: any) => void;
  fee?: number;
}
