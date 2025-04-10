export type TokenLockData = {
  walletLabel: string;
  walletId: string;
  chainLabel: string;
  source: string;
  amount: number;
  unlockEpoch: number | null;
  latestEpoch: number;
  fee?: number;
  currencyId: string | null;
};
