export interface ISwapTokensContainer {
  navigation: any;
  route: any;
}

export default interface ITransferInfo {
  onNextPressed: () => void;
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
    symbol: string;
    steps: number;
  };
  onGasPriceChange: (_: any, val: number | number[]) => void;
  onRecommendedPress: () => void;
  onTransactionFeeChange: (fee: any) => void;
  fee?: number;
}
