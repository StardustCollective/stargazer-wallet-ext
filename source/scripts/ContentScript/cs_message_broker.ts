import {
  isCustomEvent,
  StargazerMessageEventName,
  isStargazerRequestMessage,
  isStargazerEventMessage,
  isStargazerResponseMessage,
} from '../common';

export class StargazerCSMessageBroker {
  private _tabId: number | null = null;

  get tabId() {
    if (!this._tabId) {
      throw new Error('Tab id is not available');
    }
    return this._tabId;
  }

  async init() {
    this._tabId = (await chrome.tabs.getCurrent()).id;

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

    message.tabId = this.tabId;

    chrome.runtime.sendMessage(message);
    console.log('Message Sent:', message);
  }

  onWSCSMessage(message: any, sender: chrome.runtime.MessageSender) {
    console.log({ sender });

    if (isStargazerEventMessage(message)) {
      window.dispatchEvent(
        new CustomEvent(StargazerMessageEventName.CS_IS_MESSAGE, {
          detail: message,
        })
      );
      return true;
    }

    if (isStargazerResponseMessage(message)) {
      window.dispatchEvent(
        new CustomEvent(message.chnId, {
          detail: message,
        })
      );
      return true;
    }

    return false;
  }
}
