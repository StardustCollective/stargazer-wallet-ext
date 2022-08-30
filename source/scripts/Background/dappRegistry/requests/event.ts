import { AvailableEvents } from '../../../common';

import type { DappProviderExternalImplementation } from '../dappProvider';

/**
 * Extended implementation of DappProvider.onEventRequest
 */
const handleEventRequest: DappProviderExternalImplementation<
  'onEventRequest',
  []
> = async (dappProvider, port, request) => {
  if (!Object.values(AvailableEvents).includes(request.event)) {
    throw new Error(`Unsupported event '${request.event}'`);
  }

  if (request.action === 'register') {
    dappProvider.registerEventListener(port, request.listenerId, request.event);
  }

  if (request.action === 'deregister') {
    dappProvider.deregisterEventListener(port, request.listenerId, request.event);
  }

  return { type: 'event', result: true };
};

export { handleEventRequest };
