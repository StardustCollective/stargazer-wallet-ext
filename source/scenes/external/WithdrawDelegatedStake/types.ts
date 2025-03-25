export type WithdrawDelegatedStakeData = {
  walletLabel: string;
  chainLabel: string;
  source: string;
  stakeRef: string;
};

export type WithdrawDelegatedStakeBody = {
  source: string;
  stakeRef: string;
};
