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
  source: string;
  destination: string;
  amount: number;
  approvers: string[];
  currencyId: string | null;
  fee?: number;
  validUntilEpoch: number;
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
