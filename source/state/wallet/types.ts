import {
  V3Keystore,
  KDFParamsPhrase,
  KDFParamsPrivateKey,
} from '@stardust-collective/dag4-keystore/types/v3-keystore';
import { Transaction } from '@stardust-collective/dag4-network';

export type SeedKeystore = V3Keystore<KDFParamsPhrase>;
export type PrivKeystore = V3Keystore<KDFParamsPrivateKey>;

export type Keystore = SeedKeystore | PrivKeystore;

export enum AccountType {
  Seed,
  PrivKey,
}

export interface IAccountState {
  id: string;
  label: string;
  address: {
    [assetId: string]: string;
  };
  balance: number;
  type: AccountType;
  transactions: Transaction[];
}

export interface IAccountUpdateState {
  id: string;
  balance: number;
  transactions: Transaction[];
}

export interface IKeyStoreState {
  [keystoreId: string]: Keystore;
}

export default interface IWalletState {
  keystores: IKeyStoreState;
  status: number;
  accounts: {
    [accountId: string]: IAccountState;
  };
  activeAccountId: string;
  seedKeystoreId: string;
  activeNetwork: string;
}
