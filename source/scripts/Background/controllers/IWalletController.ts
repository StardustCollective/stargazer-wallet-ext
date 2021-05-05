import { IAccountController } from './IAccountController';
import { KeyringManager, KeyringNetwork } from '@stardust-collective/dag4-keyring';
import { IWalletState, NetworkType } from '../../../state/vault/types';
import { OnboardWalletHelper } from '../helpers/onboardWalletHelper';

export interface IWalletController {
  account: Readonly<IAccountController>;
  onboardHelper: Readonly<OnboardWalletHelper>;
  keyringManager: Readonly<KeyringManager>;
  importSingleAccount: (label: string, network: KeyringNetwork, privateKey: string) => Promise<string>;
  createWallet: (label: string, phrase?: string, resetAll?: boolean) => Promise<string>;
  deleteWallet: (walletId: string, password: string) => Promise<boolean>;
  switchWallet: (wallet: IWalletState) => Promise<void>;
  switchNetwork: (networkType: NetworkType, networkId: string) => void;
  // generateSeedPhrase: (update?: boolean) => string;
  // getGeneratedSeedPhrase: () => string;
  setWalletPassword: (password: string) => void;
  // importPhrase: (phrase: string) => boolean;
  isUnlocked: () => boolean;
  unLock: (password: string) => Promise<boolean>;
  checkPassword: (password: string) => boolean;
  getPhrase: (walletId: string, password: string) => string;
  getPrivateKey: (walletId: string, password: string) => string;
  logOut: () => void;
}
