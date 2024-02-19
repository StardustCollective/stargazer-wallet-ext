import { KeyringWalletState } from '@stardust-collective/dag4-keyring';
import { Ref } from 'react';
import { FieldValues, OnSubmit } from 'react-hook-form';

export type IPrivateKeyView = {
  route: any;
};

export default interface IPrivateKeySettings {
  handleSubmit: (
    callback: OnSubmit<FieldValues>
  ) => (e?: React.BaseSyntheticEvent<object, any, any>) => Promise<void>;
  register: Ref<any>;
  control: any;
  handleCopyPrivKey: () => void;
  onSubmit: (data: any) => Promise<void>;
  checked: boolean;
  isCopied: boolean;
  wallet: KeyringWalletState;
  privKey: string;
}
