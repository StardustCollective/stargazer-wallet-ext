import { IWalletState } from 'state/vault/types';
import { KeyringWalletState } from '@stardust-collective/dag4-keyring';

export type IWalletsView = {
  onChange: (id: string) => void;
  navigation: any;
};

export default interface IWalletSettings {
  multiChainAccounts: KeyringWalletState[];
  activeWallet: IWalletState;
  privKeyAccounts: Array<any>;
  hardwareWalletAccounts: Array<any>;
  handleManageWallet: (walletId: string) => void;
}
