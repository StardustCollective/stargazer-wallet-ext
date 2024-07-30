export enum GlobalMessageEvent {
  rehydrate = 'rehydrate',
}

export enum DappMessageEvent {
  disconnect = 'disconnect',
  connect = 'connect',
  notifyAccounts = 'notifyAccounts',
  chainChanged = 'chainChanged',
  accountsChanged = 'accountsChanged',
}

export enum MessageType {
  global = 'global',
  dapp = 'dapp',
}

export type DappMessage = {
  type: MessageType;
  event: DappMessageEvent;
  payload: any;
};

export type GlobalMessage = {
  type: MessageType;
  event: GlobalMessageEvent;
};
