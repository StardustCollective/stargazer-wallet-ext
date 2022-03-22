import { Ref } from 'react';
import { IWalletState } from 'state/vault/types';

export type IPrivateKeyView = {
  route: any;
};

export default interface IPrivateKeySettings {
  handleSubmit: () => void;
  register: Ref<any>;
  control: any;
  handleCopyPrivKey: () => void;
  onSubmit: (data: any) => void;
  checked: boolean;
  isCopied: boolean;
  wallet: IWalletState;
  privKey: string;
}
