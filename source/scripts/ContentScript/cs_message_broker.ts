import {
  isCustomEvent,
  StargazerMessageEventName,
  isStargazerRequestMessage,
  isStargazerEventMessage,
  isStargazerResponseMessage,
  ProtocolProvider,
  StargazerRequestMessage,
} from '../common';

export class StargazerCSMessageBroker {
  async init() {
    window.addEventListener(
      StargazerMessageEventName.IS_CS_MESSAGE,
      this.onISCSMessage.bind(this)
    );

    chrome.runtime.onMessage.addListener(this.onWSCSMessage.bind(this));
  }

  onISCSMessage(event: Event) {
    if (!isCustomEvent(event)) {
      // NOOP
      return;
    }

    if (!isStargazerRequestMessage(event.detail)) {
      // NOOP
      return;
    }

    // Rebuild the message from allowed fields only. Forwarding event.detail
    // would let the page smuggle extra keys (e.g. type/event/payload) to the SW.
    const { chnId, data } = event.detail;
    const { chainProtocol, request } = data;

    if (!Object.values(ProtocolProvider).includes(chainProtocol)) return;
    if (request.type !== 'rpc' || typeof request.method !== 'string') return;

    const message: StargazerRequestMessage = {
      chnId,
      tabId: -1,
      data: {
        chainProtocol,
        request: { type: 'rpc', method: request.method, params: request.params },
      },
    };

    chrome.runtime.sendMessage(message);
  }

  onWSCSMessage(message: any, _sender: chrome.runtime.MessageSender) {
    if (isStargazerEventMessage(message)) {
      window.dispatchEvent(
        new CustomEvent(StargazerMessageEventName.CS_IS_MESSAGE, {
          detail: message,
        })
      );
    }

    if (isStargazerResponseMessage(message)) {
      window.dispatchEvent(
        new CustomEvent(message.chnId, {
          detail: message,
        })
      );
    }
  }
}
