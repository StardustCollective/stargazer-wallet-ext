import {
  V3Keystore,
  KDFParamsPhrase,
} from '@stardust-collective/dag4-keystore/types/v3-keystore';
import { Transaction } from '@stardust-collective/dag4-network';

export type Keystore = V3Keystore<KDFParamsPhrase>;
export interface IAccountState {
  index: number;
  label: string;
  address: string;
  balance: number;
  transactions: Transaction[];
}

export interface IAccountUpdateState {
  index: number;
  balance: number;
  transactions: Transaction[];
}

export default interface IWalletState {
  keystore: Keystore | null;
  status: number;
  accounts: {
    [index: number]: IAccountState;
  };
  activeIndex: number;
  activeNetwork: string;
}
