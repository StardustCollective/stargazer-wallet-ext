import { IAccountController } from './IAccountController';
import { ISwapController } from './SwapController';
import {
  KeyringManager,
  KeyringNetwork,
  KeyringWalletState
} from '@stardust-collective/dag4-keyring';
import { OnboardWalletHelper } from '../helpers/onboardWalletHelper';
import { AccountItem } from 'scripts/types';

export interface IWalletController {
  account: Readonly<IAccountController>;
  onboardHelper: Readonly<OnboardWalletHelper>;
  keyringManager: Readonly<KeyringManager>;
  swap: Readonly<ISwapController>;
  importSingleAccount: (
    label: string,
    network: KeyringNetwork,
    privateKey: string,
    silent?: boolean
  ) => Promise<string>;
  createWallet: (
    label: string,
    phrase?: string,
    resetAll?: boolean
  ) => Promise<string>;
  deleteWallet: (walletId: KeyringWalletState, password: string) => Promise<boolean>;
  importHardwareWalletAccounts: (
    addresses: AccountItem[],
    deviceId?: string
  ) => void;
  switchWallet: (walletId: string) => Promise<void>;
  switchNetwork: (networkType: string, networkId: string) => void;
  switchActiveNetwork: (chainId: string) => void;
  addNetwork: (network: string, data: any) => void;
  // generateSeedPhrase: (update?: boolean) => string;
  // getGeneratedSeedPhrase: () => string;
  setWalletPassword: (password: string) => void;
  // importPhrase: (phrase: string) => boolean;
  isUnlocked: () => boolean;
  unLock: (password: string) => Promise<boolean>;
  checkPassword: (password: string) => boolean;
  getPhrase: (walletId: string, password: string) => string;
  getPrivateKey: (walletId: string, password: string) => string;
  notifyWalletChange: (walletAccounts: string[]) => Promise<void>;
  logOut: () => void;
}
