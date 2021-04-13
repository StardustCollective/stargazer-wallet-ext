import {
  V3Keystore,
  KDFParamsPhrase,
  KDFParamsPrivateKey,
} from '@stardust-collective/dag4-keystore/types/v3-keystore';
import { Transaction as DAGTransaction } from '@stardust-collective/dag4-network';

export type SeedKeystore = V3Keystore<KDFParamsPhrase>;
export type PrivKeystore = V3Keystore<KDFParamsPrivateKey>;

export type Keystore = SeedKeystore | PrivKeystore;

export enum AccountType {
  Seed,
  PrivKey,
}

export enum AssetType {
  Constellation = 'constellation',
  Ethereum = 'ethereum',
  ERC20 = 'erc20',
}

export enum NetworkType {
  Ethereum,
  Constellation,
  MultiChain,
}

export type Transaction = DAGTransaction | any;
export interface IAssetState {
  id: string;
  balance: number;
  address: string;
  transactions: Transaction[];
}

export interface IAccountState {
  id: string;
  label: string;
  assets: {
    [assetId: string]: IAssetState;
  };
  activeAssetId: string;
  type: AccountType;
}

export interface IAccountUpdateState {
  id: string;
  assets: {
    [assetId: string]: IAssetState;
  };
}

interface IKeyStoreState {
  [keystoreId: string]: Keystore;
}

export default interface IWalletState {
  keystores: IKeyStoreState;
  status: number;
  version: string;
  accounts: {
    [accountId: string]: IAccountState;
  };
  activeAccountId: string;
  seedKeystoreId: string;
  activeNetwork: {
    [assetId: string]: string;
  };
}
