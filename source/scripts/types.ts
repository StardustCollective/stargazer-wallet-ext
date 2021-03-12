import { IAssetState } from 'state/wallet/types';
export interface IAccountInfo {
  assets: {
    [assetId: string]: IAssetState;
  };
}

export interface ITransactionInfo {
  fromAddress: string;
  toAddress: string;
  amount: number;
  fee: number | undefined;
}

export type ETHNetwork = 'testnet' | 'mainnet';
