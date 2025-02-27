export type TokenLockData = {
  walletLabel: string;
  walletId: string;
  chainLabel: string;
  metagraphAddress: string;
  token: string;
  amount: number;
  fee: number;
  spenderAddress: string;
  unlockEpoch: number;
};
