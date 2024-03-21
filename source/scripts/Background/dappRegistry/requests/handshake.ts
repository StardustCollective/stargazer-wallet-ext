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
> = async (dappProvider, _, request, encodedRequest, setPortChainProviderData) => {
  if (dappProvider.activated === true && window.controller.wallet.isUnlocked()) {
    // This origin provider is already activated from store, add details for port provider
    setPortChainProviderData({
      chain: request.chain,
      title: request.title,
      providerId: encodedRequest.providerId,
      proxyId: encodedRequest.proxyId,
    });

    return { type: 'handshake', result: true };
  }

  setPortChainProviderData({
    chain: request.chain,
    title: request.title,
    providerId: encodedRequest.providerId,
    proxyId: encodedRequest.proxyId,
  });

  debug('Handshake -> allowed', 'providerId:', encodedRequest.providerId);
  return { type: 'handshake', result: true };
};

export { handleHandshakeRequest };
