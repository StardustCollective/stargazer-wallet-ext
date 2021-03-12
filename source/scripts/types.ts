import { Transaction } from '@stardust-collective/dag4-network';
import { AssetType } from 'state/wallet/types';
export interface IAccountInfo {
  address: {
    [assetId: string]: string;
  };
  balance: {
    [assetId: string]: number;
  };
  transactions: {
    [AssetType.Constellation]: Transaction[];
    [AssetType.Ethereum]: any[];
    [AssetType.ERC20]: any[];
  };
}

export interface ITransactionInfo {
  fromAddress: string;
  toAddress: string;
  amount: number;
  fee: number | undefined;
}

export type ETHNetwork = 'testnet' | 'mainnet';
