import {
  KeyringWalletAccountState,
  KeyringWalletState,
} from '@stardust-collective/dag4-keyring';
import { IWalletState } from 'state/vault/types';

export interface IWalletsModal {
  activeWallet: IWalletState;
  multiChainWallets: KeyringWalletState[];
  privateKeyWallets: KeyringWalletState[];
  hardwareWallets?: KeyringWalletState[];
  handleSwitchWallet: (
    walletId: string,
    walletAccounts: KeyringWalletAccountState[]
  ) => void;
}
