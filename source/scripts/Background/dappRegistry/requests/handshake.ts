import debugFn from 'debug';
import type {
  DappProviderExternalImplementation,
  ChainProviderData,
} from '../dappProvider';

const debug = debugFn('DappProvider:handleHandshakeRequest');

/**
 * Extended implementation of DappProvider.onHandshakeRequest
 */
const handleHandshakeRequest: DappProviderExternalImplementation<
  'onHandshakeRequest',
  [(chainProviderData: ChainProviderData) => void]
> = async (dappProvider, port, request, encodedRequest, setPortChainProviderData) => {
  const isUnlocked = true;
  // TODO: test Manifest V3 (window object not available)
  // window.controller.wallet.isUnlocked()
  if (dappProvider.activated === true && isUnlocked) {
    // This origin provider is already activated from store, add details for port provider
    setPortChainProviderData({
      chain: request.chain,
      title: request.title,
      providerId: encodedRequest.providerId,
      proxyId: encodedRequest.proxyId,
    });

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
      title: request.title,
      providerId: encodedRequest.providerId,
      proxyId: encodedRequest.proxyId,
    });

    debug('Handshake -> allowed', 'providerId:', encodedRequest.providerId);
    return { type: 'handshake', result: true };
  }

  debug('Handshake -> denied', 'providerId:', encodedRequest.providerId);
  return { type: 'handshake', result: false };
};

export { handleHandshakeRequest };
