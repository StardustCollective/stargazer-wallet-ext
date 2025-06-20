export interface GasSliderProps {
  onGasPriceChange: (_: any, val: number | number[]) => void;
  loading?: boolean;
  gas: {
    prices: number[];
    price: number;
    fee: number;
    speedLabel: string;
    symbol: string;
    basePriceId: string;
    steps: number;
  };
}
