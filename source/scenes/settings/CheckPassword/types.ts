import { KeyringWalletState } from '@stardust-collective/dag4-keyring';
import { IDropdownOptions } from 'components/Dropdown/types';
import { Ref } from 'react';
import { Control, FieldValues, OnSubmit, ValidationOptions } from 'react-hook-form';

export type TCheckPassword = {
  navigation: any;
  id: string;
  route: any;
};

export interface ICheckPassword {
  control: Control<FieldValues>;
  warningMessage: string;
  wallet: KeyringWalletState;
  password: string;
  privateKey: string;
  walletPhrase: string;
  register: (options: ValidationOptions) => Ref<any>;
  handleSubmit: (
    callback: OnSubmit<FieldValues>
  ) => (e?: React.BaseSyntheticEvent<object, any, any>) => Promise<void>;
  handleOnCancel: () => void;
  handleOnSubmit: (data: any) => void;
  handleOnContinue: () => void;
  isSubmitDisabled: boolean;
  errors: any;
  isCopied: boolean;
  copyText: (txt: string) => void;
  updatePrivateKey: (address: string) => void;
  networkOptions: IDropdownOptions;
  isBiometricEnabled: boolean;
  isRemoveWallet: boolean;
}
