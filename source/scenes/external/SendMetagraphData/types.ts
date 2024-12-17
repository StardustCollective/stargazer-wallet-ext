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

export type SendDataFeeResponse = {
  hash: string;
  feeHash?: string;
};

export type SignDataFeeResponse = {
  hash: string;
  signature: string;
  feeHash?: string;
  feeSignature?: string;
};

export type Proof = {
  id: string;
  signature: string;
};

export type DataTransactionBody = {
  data: {
    value: any;
    proofs: Proof[];
  };
  fee?: {
    value: DataFeeTransaction;
    proofs: Proof[];
  };
};
