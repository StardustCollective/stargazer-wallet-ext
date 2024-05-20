/**
 * https://eips.ethereum.org/EIPS/eip-1193#events-1
 */
export enum AvailableWalletEvent {
  connect = 'connect',
  disconnect = 'disconnect',
  chainChanged = 'chainChanged',
  accountsChanged = 'accountsChanged',
  message = 'message',
}
