export interface INetworksModal {
  currentNetwork: string;
  handleSwitchActiveNetwork: (chainId: string) => void;
}
