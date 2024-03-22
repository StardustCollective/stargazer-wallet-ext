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
> = async (_, __, request, encodedRequest, setPortChainProviderData) => {
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
