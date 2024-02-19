import { Asset, BaseAmount } from '@xchainjs/xchain-util';

export type Address = string;
export type Network = any;
export type TxType = 'transfer' | 'unknown';
export type TxHash = string;

export type TxTo = {
  to: Address;
  amount: BaseAmount;
};

export type TxFrom = {
  from: Address | TxHash;
  amount: BaseAmount;
};

export type Tx = {
  asset: Asset;
  from: TxFrom[];
  to: TxTo[];
  date: Date;
  type: TxType;
  hash: string;
};

export type Txs = Tx[];

export type TxsPage = {
  total: number;
  txs: Txs;
};

export type TxHistoryParams = {
  address: Address;
  offset?: number;
  limit?: number;
  startTime?: Date;
  asset?: string;
};

export type TxParams = {
  asset?: Asset;
  amount: BaseAmount;
  recipient: Address;
  memo?: string;
};

export type FeesParams = { readonly empty?: '' };
export type FeeOptionKey = 'average' | 'fast' | 'fastest';
export type FeeOption = Record<FeeOptionKey, BaseAmount>;

export type FeeType =
  | 'byte' // fee will be measured as `BaseAmount` per `byte`
  | 'base'; // fee will be "flat" measured in `BaseAmount`

export type Fees = FeeOption & {
  type: FeeType;
};

export interface ChainsController {
  getNetwork(): Network;
  getExplorerUrl(): string;
  getAddress(): Address;
  getTransactions(params?: TxHistoryParams): Promise<TxsPage>;
  setChain(network: Network): void;
  validateAddress(address: string): boolean;
  transfer(params: TxParams): Promise<any>;
  purgeClient(): void;
}
