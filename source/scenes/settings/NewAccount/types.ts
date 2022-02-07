import { Ref } from 'react';

export type INewAccountView = {
  // onChange: (id: string) => void;
  navigation: any;
};

export default interface INewAccountSettings {
  onClickResetStack: () => void;
  onShowPhraseClick: () => void;
  onSubmit: () => void;
  handleSubmit: () => void;
  register: Ref<any>;
  control: any;
  accountName: string;
  loading: boolean;
  walletId: string;
}
