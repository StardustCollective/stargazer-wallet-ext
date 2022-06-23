/**
 * https://eips.ethereum.org/EIPS/eip-1193#events-1
 */
enum AvailableEvents {
  connect = 'connect',
  disconnect = 'disconnect',
  chainChanged = 'chainChanged',
  accountsChanged = 'accountsChanged',
  message = 'message',
}

export {AvailableEvents}