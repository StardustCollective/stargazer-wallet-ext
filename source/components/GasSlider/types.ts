import { IAssetInfoState } from 'state/assets/types';

export interface GasSliderProps {
  asset: IAssetInfoState;
  onGasPriceChange: (_: any, val: number | number[]) => void;
  gas: {
    prices: number[];
    price: number;
    fee: number;
    speedLabel: string;
    basePriceId: string;
  };
}
