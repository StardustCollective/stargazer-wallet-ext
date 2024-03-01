import { KeyringWalletState } from '@stardust-collective/dag4-keyring';

export type IRemoveWalletView = {
  route: any;
  navigation: any;
};

export default interface IRemoveWalletSettings {
  wallet: KeyringWalletState;
  loading: boolean;
  handleCancel: () => void;
  handleRemoveWallet: () => Promise<void>;
}
