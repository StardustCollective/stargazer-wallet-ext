import { StargazerRequestMessage, isStargazerRequestMessage } from 'scripts/common';

export class StargazerExternalPopups {
  static async createPopup(
    params: Record<string, any>,
    url = '/external.html',
    windowSize = { width: 372, height: 600 }
  ) {
    const { width = 372, height = 600 } = windowSize;

    const currentWindow = await chrome.windows.getCurrent();

    if (!currentWindow || !currentWindow.width) {
      return null;
    }

    const urlParams = this.encodeLocationParams(params);
    url += `?${urlParams.toString()}`;

    return await chrome.windows.create({
      url,
      width,
      height,
      type: 'popup',
      top: 0,
      left: currentWindow.width - 600,
    });
  }

  static async executePopupWithRequestMessage(
    data: Record<string, any> | null,
    message: StargazerRequestMessage,
    origin: string,
    route: string,
    url = '/external.html'
  ) {
    return await this.createPopup({ data, message, origin, route }, url);
  }

  static encodeLocationParams(params: Record<string, any>) {
    const urlParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      urlParams.set(
        key,
        typeof value === 'object' ? JSON.stringify(value) : String(value)
      );
    }
    return urlParams;
  }

  static decodeLocationParams(url: string) {
    const urlObject = new URL(url);
    const params: Record<string, any> = {};

    for (const [param, value] of urlObject.searchParams.entries()) {
      try {
        params[param] = JSON.parse(value);
      } catch (e) {
        params[param] = value;
      }
    }

    return params;
  }

  static decodeRequestMessageLocationParams<Data>(url: string) {
    const params = this.decodeLocationParams(url);

    if (!isStargazerRequestMessage(params.message)) {
      throw new Error('Invalid message param');
    }

    if (typeof params.origin !== 'string') {
      throw new Error('Invalid origin param');
    }

    if (typeof params.data !== 'object') {
      throw new Error('Invalid data param');
    }

    return { message: params.message, origin: params.origin, data: params.data as Data };
  }
}