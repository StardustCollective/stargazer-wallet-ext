import { Ref } from 'react';

export type IImportAccountView = {
  route: any;
  navigation: any;
};

export type HardwareWallet = {
  address: string;
  balance: number;
};

export default interface IImportAccountSettings {
  handleSubmit: (callback: any) => void;
  control: any;
  register: Ref<any>;
  handleImportPrivKey: (privKey: string, label: string) => void;
  onFinishButtonPressed: () => void;
  network: string;
  hardwareWalletList: Array<any>;
  importType: string;
  loading: boolean;
  jsonFile: File;
  accountName: string;
  hardwareStep: number;
  loadingWalletList: boolean;
  setJsonFile: (file: File) => void;
  setLoading: (val: boolean) => void;
  showErrorAlert: (message: string) => void;
  setImportType: (type: string) => void;
}
