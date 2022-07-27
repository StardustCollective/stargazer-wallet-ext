import { browser, Runtime, Windows } from 'webextension-polyfill-ts';
import { v4 as uuidv4 } from 'uuid';

import {
  StargazerChain,
  StargazerProxyEvent,
  StargazerProxyRequest,
  StargazerProxyResponse,
  StargazerEncodedProxyEvent,
  StargazerEncodedProxyRequest,
  StargazerEncodedProxyResponse,
  isCustomEvent,
  AvailableEvents,
} from '../../common';

import {
  handleHandshakeRequest,
  handleEventRequest,
  handleRpcRequest,
  handleImportRequest,
} from './requests';

type ChainProviderData = {
  proxyId: string;
  providerId: string;
  chain: StargazerChain;
  title: string;
};

type DappProviderExternalImplementation<
  T extends keyof InstanceType<typeof DappProvider>,
  P extends any[]
> = DappProvider[T] extends (...args: any[]) => any
  ? (
      ...args: [DappProvider, ...Parameters<DappProvider[T]>, ...P]
    ) => ReturnType<DappProvider[T]>
  : never;

class DappProvider {
  #origin: string;
  #ports: Map<Runtime.Port, ChainProviderData | null>;
  #listeners: Map<Runtime.Port, Map<AvailableEvents, Set<string>>>;
  #pendingPortWindows: Set<Runtime.Port>;

  constructor(origin: string) {
    this.#origin = origin;
    this.#ports = new Map();
    this.#listeners = new Map();
    this.#pendingPortWindows = new Set();
  }

  get origin() {
    return this.#origin;
  }

  get portsSize() {
    return this.#ports.size;
  }

  get activated() {
    return window.controller.dapp.isDAppConnected(this.#origin);
  }

  registerProviderPort(port: Runtime.Port) {
    this.#ports.set(port, null);
    this.#listeners.set(port, new Map());
    port.onMessage.addListener(this.onProviderPortMessage.bind(this, port));
  }

  deregisterProviderPort(port: Runtime.Port) {
    this.#ports.delete(port);
    this.#listeners.delete(port);
  }

  async onProviderPortMessage(
    port: Runtime.Port,
    encodedRequest: StargazerEncodedProxyRequest
  ) {
    window.controller.dapp.fromPageConnectDApp(
      this.origin,
      port.sender?.tab?.title ?? ''
    );

    if (encodedRequest.request.type === 'handshake') {
      this.sendResponseToPort(
        port,
        encodedRequest,
        await this.onHandshakeRequest(port, encodedRequest.request, encodedRequest)
      );
      return;
    }

    if (encodedRequest.request.type === 'event') {
      this.sendResponseToPort(
        port,
        encodedRequest,
        await this.onEventRequest(port, encodedRequest.request, encodedRequest)
      );
      return;
    }

    if (encodedRequest.request.type === 'rpc') {
      this.sendResponseToPort(
        port,
        encodedRequest,
        await this.onRpcRequest(port, encodedRequest.request, encodedRequest)
      );
      return;
    }

    throw new Error('Unable to classify port request');
  }

  async onHandshakeRequest(
    port: Runtime.Port,
    request: StargazerProxyRequest & { type: 'handshake' },
    encodedRequest: StargazerEncodedProxyRequest
  ): Promise<StargazerProxyResponse> {
    try {
      return await handleHandshakeRequest(
        this,
        port,
        request,
        encodedRequest,
        (chainProviderData: ChainProviderData) => {
          this.#ports.set(port, chainProviderData);
        }
      );
    } catch (e) {
      console.error('HandshakeRequestError', String(e), e);
      return { type: 'handshake', error: String(e) };
    }
  }

  async onEventRequest(
    port: Runtime.Port,
    request: StargazerProxyRequest & { type: 'event' },
    encodedRequest: StargazerEncodedProxyRequest
  ): Promise<StargazerProxyResponse> {
    try {
      this.assertProviderIsActivated();
      return await handleEventRequest(this, port, request, encodedRequest);
    } catch (e) {
      console.error('EventRequestError', String(e), e);
      return { type: 'event', error: String(e) };
    }
  }

  async onRpcRequest(
    port: Runtime.Port,
    request: StargazerProxyRequest & { type: 'rpc' },
    encodedRequest: StargazerEncodedProxyRequest
  ): Promise<StargazerProxyResponse> {
    try {
      this.assertProviderIsActivated();
      return await handleRpcRequest(this, port, request, encodedRequest);
    } catch (e) {
      console.error('RpcRequestError', String(e), e);
      if (e instanceof Error) {
        return {
          type: 'rpc',
          error: { message: e.message, code: (e as any).code, data: (e as any).data },
        };
      }
      return { type: 'rpc', error: { message: String(e) } };
    }
  }

  async onImportRequest(
    port: Runtime.Port,
    request: StargazerProxyRequest & { type: 'import' },
    encodedRequest: StargazerEncodedProxyRequest
  ): Promise<StargazerProxyResponse> {
    try {
      return await handleImportRequest(this, port, request, encodedRequest);
    } catch (e) {
      console.error('ImportRequestError', String(e), e);
      return { type: 'event', error: String(e) };
    }
  }

  getChainProviderDataByPort(port: Runtime.Port): ChainProviderData {
    const chainData = this.#ports.get(port);
    if (!chainData) {
      throw new Error('Unable to retrive ChainProviderData for port');
    }
    return chainData;
  }

  assertProviderIsActivated() {
    if (this.activated !== true) {
      throw new Error('Provider is was not activated');
    }
  }

  sendResponseToPort(
    port: Runtime.Port,
    encodedRequest: StargazerEncodedProxyRequest,
    response: StargazerProxyResponse
  ) {
    if (!this.#ports.has(port)) {
      console.warn('Port was unregistered, skipping message');
      return;
    }

    const encodedResponse: StargazerEncodedProxyResponse = {
      proxyId: encodedRequest.proxyId,
      reqId: encodedRequest.reqId,
      providerId: encodedRequest.providerId,
      response,
    };

    port.postMessage(encodedResponse);
  }

  sendEventToPort(
    port: Runtime.Port,
    proxyId: string,
    providerId: string,
    listenerId: string,
    event: StargazerProxyEvent
  ) {
    if (!this.#ports.has(port)) {
      console.warn('Port was unregistered, skipping event');
      return;
    }

    const encodedEvent: StargazerEncodedProxyEvent = {
      listenerId,
      proxyId,
      providerId,
      event,
    };

    port.postMessage(encodedEvent);
  }

  async createPopupAndWaitForEvent(
    port: Runtime.Port,
    event: string,
    network?: string,
    route?: string,
    data?: Record<any, any>,
    type: Windows.CreateType = 'popup',
    url: string = '/external.html',
    windowSize = { width: 372, height: 600 }
  ): Promise<CustomEvent | null> {
    if (!this.#ports.has(port)) {
      throw new Error('Provider port is not associated with this DappProvider');
    }

    if (this.#pendingPortWindows.has(port)) {
      throw new Error('There is an already pending window for the provided port');
    }

    const windowId = uuidv4();
    const popup = await window.controller.createPopup(
      windowId,
      network,
      route,
      data,
      type,
      url,
      windowSize
    );

    this.#pendingPortWindows.add(port);

    return new Promise<CustomEvent | null>((resolve, reject) => {
      try {
        const onEvent = (event: Event) => {
          if (isCustomEvent(event) && event.detail.windowId === windowId) {
            // Matching event, resolve to event
            resolvePopup(event);
          }
        };

        const onRemovedWindow = (id: number) => {
          if (popup.id === id) {
            // Popup removed, resolve to null
            resolvePopup(null);
          }
        };

        const resolvePopup = (value: CustomEvent | null) => {
          window.removeEventListener(event, onEvent);
          browser.windows.onRemoved.removeListener(onRemovedWindow);
          resolve(value);
          this.#pendingPortWindows.delete(port);
        };

        window.addEventListener(event, onEvent, { passive: true });
        browser.windows.onRemoved.addListener(onRemovedWindow);
      } catch (e) {
        reject(e);
      }
    });
  }

  registerEventListener(port: Runtime.Port, listenerId: string, event: AvailableEvents) {
    const listeners = this.#listeners.get(port);
    if (!listeners) {
      console.warn('Port was unregistered, skipping event register');
      return;
    }

    const eventListeners = listeners.get(event) ?? new Set();
    eventListeners.add(listenerId);
    listeners.set(event, eventListeners);
  }

  deregisterEventListener(
    port: Runtime.Port,
    listenerId: string,
    event: AvailableEvents
  ) {
    const listeners = this.#listeners.get(port);
    if (!listeners) {
      console.warn('Port was unregistered, skipping event deregister');
      return;
    }

    const eventListeners = listeners.get(event);
    if (!eventListeners) {
      console.warn('No listeners for event, skipping event deregister');
      return;
    }

    eventListeners.delete(listenerId);
  }

  sendEventByFilter(
    event: AvailableEvents,
    data: any[] = [],
    ...filters: ((
      chain: StargazerChain,
      listenerId: string,
      chainData: ChainProviderData
    ) => boolean)[]
  ) {
    if (!this.activated) {
      return;
    }

    for (const [port, eventListeners] of this.#listeners) {
      const chainData = this.#ports.get(port);
      const listenerIds = eventListeners.get(event);

      if (!chainData || !listenerIds) {
        continue;
      }

      for (const listenerId of listenerIds) {
        if (!filters.every((filter) => filter(chainData.chain, listenerId, chainData))) {
          continue;
        }

        this.sendEventToPort(port, chainData.proxyId, chainData.providerId, listenerId, {
          event,
          listenerId,
          params: data,
        });
      }
    }
  }
}

export type { ChainProviderData, DappProviderExternalImplementation };
export { DappProvider };
