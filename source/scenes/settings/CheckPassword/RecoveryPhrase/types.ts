export interface IRecoveryPhrase {
  walletPhrase: string;
  isCopied: boolean;
  copyText: (txt: string) => void;
  onPressDone: () => void;
  onPressCancel: () => void;
  isRemoveWallet: boolean;
}
