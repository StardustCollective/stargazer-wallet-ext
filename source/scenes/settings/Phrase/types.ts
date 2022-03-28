import { Ref } from 'react';

export type IPhraseView = {
  id: string;
  route: any;
};

export default interface IPhraseSettings {
  handleSubmit: (data: any) => void;
  register: Ref<any>;
  control: any;
  onSubmit: (data: any) => void;
  checked: boolean;
  phrase: string;
  isCopied: boolean;
  handleCopySeed: () => void;
}
