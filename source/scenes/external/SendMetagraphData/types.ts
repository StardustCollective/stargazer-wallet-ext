export type EstimateFeeResponse = {
  fee: number;
  address: string;
  updateHash: string;
};

export type DataFeeTransaction = {
  source: string;
  destination: string;
  amount: number;
  dataUpdateRef: string;
};

export type DataFeeResponse = {
  hash: string;
  feeHash: string;
};
