import { Ref } from 'react';
import { IWalletState } from 'state/vault/types';
export type IManageWalletView = {
  route: any;
  navigation: any;
};

export default interface IManageWalletSettings {
  walletId: string;
  handleSubmit: (data: any) => void;
  register: Ref<any>;
  control: object;
  wallets: IWalletState[];
  wallet: IWalletState;
  onSubmit: (data: any) => void;
  onCancelClicked: () => void;
  onShowRecoveryPhraseClicked: () => void;
  onDeleteWalletClicked: () => void;
  onShowPrivateKeyClicked: () => void;
}
