import type {
  DappProviderExternalImplementation,
  ChainProviderData,
} from '../dappProvider';

/**
 * Extended implementation of DappProvider.onHandshakeRequest
 */
const handleHandshakeRequest: DappProviderExternalImplementation<
  'onHandshakeRequest',
  [(chainProviderData: ChainProviderData) => void]
> = async (dappProvider, port, request, encodedRequest, setPortChainProviderData) => {
  if (dappProvider.activated === true) {
    // This origin provider is already activated
    return { type: 'handshake', result: true };
  }

  const connectWalletEvent = await dappProvider.createPopupAndWaitForEvent(
    port,
    'connectWallet',
    undefined,
    'selectAccounts'
  );

  if (connectWalletEvent === null) {
    return { type: 'handshake', result: false };
  }

  if (connectWalletEvent !== null) {
    setPortChainProviderData({
      chain: request.chain,
      proxyId: encodedRequest.proxyId,
      title: request.title,
    });
    return { type: 'handshake', result: true };
  }

  return { type: 'handshake', result: false };
};

export { handleHandshakeRequest };
