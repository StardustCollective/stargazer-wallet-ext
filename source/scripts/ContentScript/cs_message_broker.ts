import {
  isCustomEvent,
  StargazerMessageEventName,
  isStargazerRequestMessage,
  isStargazerEventMessage,
  isStargazerResponseMessage,
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

    const message = event.detail;

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
