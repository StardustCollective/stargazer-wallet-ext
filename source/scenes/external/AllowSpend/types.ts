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
