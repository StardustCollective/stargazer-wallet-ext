export interface IAccountInfo {
  address: string;
  balance: number;
}

export interface ITransactionInfo {
  fromAddress: string;
  toAddress: string;
  amount: number;
  fee: number;
}
