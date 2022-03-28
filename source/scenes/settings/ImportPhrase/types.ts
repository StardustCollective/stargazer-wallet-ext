import { Ref } from 'react';

export type IImportPhraseView = {
  navigation: any;
};

export default interface IImportPhraseSettings {
  loading: boolean;
  onCancelClick: () => void;
  handleSubmit: (callback: any) => void;
  onSubmit: (data: any) => void;
  register: Ref<any>;
  control: object;
}
