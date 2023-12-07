export default interface IAddNetwork {
  register: any;
  control: any;
  errors: any;
  saveDisabled: boolean;
  networkTypeOptions: any;
  chainName: string;
  rpcUrl: string;
  chainId: string;
  blockExplorerUrl: string;
  handleChainNameChange: (value: string) => void;
  handleRpcUrlChange: (value: string) => void;
  handleChainIdChange: (value: string) => void;
  handleBlockExplorerUrlChange: (value: string) => void;
  handleSave: () => void;
}
