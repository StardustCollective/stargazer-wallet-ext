import { AvailableEvents } from '../../../common';

import type { DappProviderExternalImplementation } from '../dappProvider';

/**
 * Extended implementation of DappProvider.onEventRequest
 */
const handleEventRequest: DappProviderExternalImplementation<
  'onEventRequest',
  []
> = async (dappProvider, port, request, encodedRequest) => {
  if (!Object.values(AvailableEvents).includes(request.event)) {
    throw new Error(`Unsupported event '${request.event}'`);
  }

  if (request.action === 'register') {
    // Backwards Compatibility with 'close'
    const eventName =
      request.event === AvailableEvents.disconnect ? 'close' : request.event;

    window.addEventListener(
      eventName,
      (event: Event) => {
        if (event instanceof CustomEvent) {
          const { data } = event.detail;

          // Always send close because site will already be disconnected and not listening
          if (request.event === AvailableEvents.disconnect) {
            dappProvider.sendEventToPort(
              port,
              encodedRequest.proxyId,
              encodedRequest.providerId,
              request.listenerId,
              { event: request.event, listenerId: request.listenerId, params: data }
            );
          }

          // Event listeners can be attached before connection but DApp must be connected to receive events
          if (!dappProvider.activated) {
            return;
          }

          // The event origin is checked to prevent sites that have not been
          // granted permissions to the user's account information from
          // receiving updates.
          if (window.controller.dapp.isSiteListening(request.listenerId, request.event)) {
            dappProvider.sendEventToPort(
              port,
              encodedRequest.proxyId,
              encodedRequest.providerId,
              request.listenerId,
              { event: request.event, listenerId: request.listenerId, params: data }
            );
          }
        }
      },
      { passive: true }
    );

    window.controller.dapp.registerListeningSite(request.listenerId, request.event);
  }

  if (request.action === 'deregister') {
    window.controller.dapp.deregisterListeningSite(request.listenerId, request.event);
  }

  return { type: 'event', result: true };
};

export { handleEventRequest };
