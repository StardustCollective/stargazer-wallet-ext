import { Ref } from 'react';
import { KeyringWalletState } from '@stardust-collective/dag4-keyring';

export type IRemoveWalletView = {
  route: any;
  navigation: any;
};

export default interface IRemoveWalletSettings {
  goBack: () => void;
  wallet: KeyringWalletState;
  isSeedWallet: boolean;
  handleSubmit: (callback: any) => void;
  register: Ref<any>;
  control: any;
  onSubmit: (data: any) => void;
}
