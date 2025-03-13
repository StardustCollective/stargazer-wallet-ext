export type AllowSpendData = {
  walletLabel: string;
  walletId: string;
  chainLabel: string;
  destinationInfo: {
    isMetagraph: boolean;
    label: string;
    logo: string;
  };
  spenderInfo: {
    isMetagraph: boolean;
    label: string;
    logo: string;
  };
  source: string; // Wallet address signing the transaction.
  destination: string; // The AMM metagraph address
  amount: number; // In DATUM. The maximum transaction amount for which to generate a ‘lock’ around
  approvers: string[]; // A list of metagraphIds which can atomically approve this operation.
  currencyId?: string; // The currency metagraph identifier. If not provided, the default currency will be DAG.
  fee?: number; // In DATUM.The fee in the currency of the currency metragraph. If not provided, the default fee will be 0.
  validUntilEpoch?: number; // The global snapshot epoch progress for which this is valid until. If not provided, the default value will be {to be confirmed}.
  latestEpoch: number;
};

export type MetagraphProject = {
  id: string;
  metagraphId: string | null;
  network: string;
  name: string;
  icon_url: string | null;
  type: string;
  snapshots90d: number | null;
  fees90d: number;
  snapshotsTotal: any;
  feesTotal: number;
};
