import { StargazerRequestMessage, isStargazerRequestMessage } from 'scripts/common';

export class StargazerExternalPopups {
  static async createPopup(
    params: Record<string, any>,
    url = '/external.html',
    size = { width: 372, height: 600 },
    type: chrome.windows.createTypeEnum = 'popup'
  ) {
    const { width = 372, height = 600 } = size;

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
      type,
      top: 0,
      left: currentWindow.width - 600,
    });
  }

  static async executePopupWithRequestMessage(
    data: Record<string, any> | null,
    message: StargazerRequestMessage,
    origin: string,
    route: string,
    url = '/external.html',
    size = { width: 372, height: 600 },
    type: chrome.windows.createTypeEnum
  ) {
    await this.createPopup({ data, message, origin, route }, url, size, type);
  }

  static addResolvedParam(href: string): void {
    const { message, origin, data } =
      StargazerExternalPopups.decodeRequestMessageLocationParams(href);

    let url = new URL(href);
    let updatedURL = url.origin + url.pathname;

    const urlParams = StargazerExternalPopups.encodeLocationParams({
      message,
      origin,
      data,
      resolved: true,
    });

    updatedURL += `?${urlParams.toString()}`;

    window.history.replaceState({}, '', updatedURL);
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

    return {
      message: params.message,
      origin: params.origin,
      data: params.data as Data,
      resolved: !!params?.resolved,
    };
  }
}
