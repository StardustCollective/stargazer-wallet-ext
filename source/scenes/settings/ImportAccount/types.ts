import { Ref } from 'react';
import { FieldValues, OnSubmit } from 'react-hook-form';

export type IImportAccountView = {
  route: any;
};

export default interface IImportAccountSettings {
  handleSubmit: (
    callback: OnSubmit<FieldValues>
  ) => (e?: React.BaseSyntheticEvent<object, any, any>) => Promise<any>;
  control: any;
  register: Ref<any>;
  handleImportPrivKey: (privKey: string, label: string) => void;
  handleCancel: () => void;
  handleFinish: () => void;
  importType: string;
  loading: boolean;
  jsonFile: File;
  accountName: string;
  setJsonFile: (file: File) => void;
  setLoading: (val: boolean) => void;
  showErrorAlert?: (message: string) => void;
  setImportType: (type: string) => void;
}
