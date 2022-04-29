import { Ref } from 'react';
import { Control, FieldValues, OnSubmit } from 'react-hook-form';

export type IImportPhraseView = {
  navigation: any;
};

export default interface IImportPhraseSettings {
  loading: boolean;
  onCancelClick: () => void;
  handleSubmit: (callback: OnSubmit<FieldValues>) => (e?: React.BaseSyntheticEvent<object, any, any>) => Promise<void>;
  onSubmit: (data: any) => void;
  register: Ref<any>;
  control: Control<FieldValues>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
