import { IAssetState } from 'state/wallet/types';

export interface IAccountInfo {
  assets: {
    [assetId: string]: IAssetState;
  };
}

export interface IETHTxConfig {
  nonce?: number;
  txData?: string;
  gas: number;
  gasLimit: number;
}

export interface ITransactionInfo {
  fromAddress: string;
  toAddress: string;
  amount: number;
  fee?: number;
  ethConfig?: IETHTxConfig;
}

export type ETHNetwork = 'testnet' | 'mainnet';
