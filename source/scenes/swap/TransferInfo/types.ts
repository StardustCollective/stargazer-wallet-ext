import { IAssetInfoState } from 'state/assets/types';

export interface ISwapTokensContainer {
  navigation: any;
  route: any;
}

export default interface ITransferInfo {
  onNextPressed: () => void;
  asset: IAssetInfoState;
  from: {
    code: string;
    amount: number;
  };
  to: {
    code: string;
    amount: number;
  };
  depositAddress: string;
  gas: {
    prices: number[];
    price: number;
    fee: number;
    speedLabel: string;
    basePriceId: string;
  };
  onGasPriceChange: (_: any, val: number | number[]) => void;
  onRecommendedPress: () => void;
  onTransactionFeeChange: (fee: any) => void;
  fee?: number;
}
