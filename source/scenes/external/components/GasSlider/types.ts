export interface GasSliderProps {
  onGasPriceChange: (_: any, val: number | number[]) => void;
  loading?: boolean;
  gas: {
    prices: number[];
    // Upper bound of the slider; defaults to the fastest estimate (prices[2]).
    max?: number;
    price: number;
    fee: number;
    speedLabel: string;
    symbol: string;
    basePriceId: string;
    steps: number;
  };
}
