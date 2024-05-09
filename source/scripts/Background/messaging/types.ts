export enum GlobalMessageID {
  rehydrate = 'rehydrate',
}

export enum DappMessageID {
  disconnect = 'disconnect',
  connect = 'connect',
  notifyAccounts = 'notifyAccounts',
}

export enum ExternalMessageID {
  connectWallet = 'connectWallet',
  dataSigned = 'dataSigned',
  messageSigned = 'messageSigned',
  transactionSent = 'transactionSent',
  watchAssetResult = 'watchAssetResult',
  signTypedMessageResult = 'signTypedMessageResult',
  spendApproved = 'spendApproved',
}

export enum MessageType {
  global = 'global',
  external = 'external',
  dapp = 'dapp',
}

export type MessageDetail = {
  windowId: string;
  [key: string]: any;
};

export type ExternalMessage = {
  type: MessageType;
  id: ExternalMessageID;
  detail: MessageDetail;
};

export type DappMessage = {
  type: MessageType;
  id: DappMessageID;
  payload: any;
};
export type GlobalMessage = {
  type: MessageType;
  id: GlobalMessageID;
};
