export enum GlobalMessageEvent {
  rehydrate = 'rehydrate',
}

export enum DappMessageEvent {
  disconnect = 'disconnect',
  connect = 'connect',
  notifyAccounts = 'notifyAccounts',
}

export enum ExternalMessageEvent {
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
  event: ExternalMessageEvent;
  detail: MessageDetail;
};

export type GlobalMessage = {
  type: MessageType;
  event: GlobalMessageEvent;
};
