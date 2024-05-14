import { v4 as uuidv4 } from 'uuid';
import { ExternalMessage, ExternalMessageID, MessageType } from './types';

export class StargazerExternalPopups {
  static async createPopup(
    windowId: string,
    network?: string,
    route?: string,
    data?: Record<any, any>,
    type: chrome.windows.createTypeEnum = 'popup',
    url = '/external.html',
    windowSize = { width: 372, height: 600 }
  ) {
    const { width = 372, height = 600 } = windowSize;

    const currentWindow = await chrome.windows.getCurrent();

    if (!currentWindow || !currentWindow.width) return null;

    const params = new URLSearchParams();
    if (route) {
      params.set('route', route);
    }
    if (network) {
      params.set('network', network);
    }
    if (data) {
      params.set('data', JSON.stringify(data));
    }

    // This was being passed only in hash value but it gets dropped somethings in routing
    params.set('windowId', windowId);
    url += `?${params.toString()}#${windowId}`;

    return await chrome.windows.create({
      url,
      width,
      height,
      type,
      top: 0,
      left: currentWindow.width - 600,
    });
  }

  static async createPopupAndWaitForMessage(
    message: ExternalMessageID,
    network?: string,
    route?: string,
    data?: Record<any, any>,
    type: chrome.windows.createTypeEnum = 'popup',
    url = '/external.html',
    windowSize = { width: 372, height: 600 }
  ): Promise<ExternalMessage | null> {
    const windowId = uuidv4();

    const popup = await this.createPopup(
      windowId,
      network,
      route,
      data,
      type,
      url,
      windowSize
    );

    return new Promise<ExternalMessage | null>((resolve, reject) => {
      try {
        const handleExternalMessage = async (msg: ExternalMessage) => {
          // Check message type
          if (msg?.type !== MessageType.external) return;

          // Check message id
          if (msg?.id !== message) return;

          // Check windowId
          if (msg?.detail?.windowId !== windowId) return;

          await resolvePopup(msg);
        };

        const onRemovedWindow = (id: number) => {
          if (popup.id === id) {
            // Popup removed, resolve to null
            resolvePopup(null);
          }
        };

        const resolvePopup = async (value: ExternalMessage | null) => {
          chrome.runtime.onMessage.removeListener(handleExternalMessage);
          chrome.windows.onRemoved.removeListener(onRemovedWindow);
          resolve(value);
        };

        chrome.runtime.onMessage.addListener(handleExternalMessage);
        chrome.windows.onRemoved.addListener(onRemovedWindow);
      } catch (e) {
        reject(e);
      }
    });
  }
}
