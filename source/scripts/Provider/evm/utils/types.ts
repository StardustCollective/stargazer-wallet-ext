export type EthSendTransaction = {
  from: string;
  to?: string;
  value?: string | number;
  gas?: string;
  gasPrice?: string;
  data?: string;
  chainId?: string | number;
};

export interface ISendTransactionParams extends EthSendTransaction {
  isTransfer: boolean;
  chain: string;
  chainLabel: string;
}
