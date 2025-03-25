export type DelegatedStakeData = {
  walletLabel: string;
  chainLabel: string;
  source: string;
  nodeId: string;
  amount: number;
  fee?: number;
  tokenLockRef: string;
};

export type DelegatedStakeBody = {
  source: string;
  nodeId: string;
  amount: number;
  fee?: number;
  tokenLockRef: string;
};
