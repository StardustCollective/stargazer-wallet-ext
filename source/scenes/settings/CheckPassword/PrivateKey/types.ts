import { IDropdownOptions } from 'components/Dropdown/types';

export interface IPrivateKey {
  privateKey: string;
  isRemoveWallet: boolean;
  isCopied: boolean;
  networkOptions: IDropdownOptions;
  copyText: (txt: string) => void;
  onPressDone: () => void;
  onPressCancel: () => void;
}
