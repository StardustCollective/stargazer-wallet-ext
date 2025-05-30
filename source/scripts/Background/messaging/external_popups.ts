import { StargazerRequestMessage, isStargazerRequestMessage } from 'scripts/common';
import { decodeFromBase64, encodeToBase64 } from 'utils/encoding';
import { HARDWARE_WALLETS_PAGES } from 'utils/hardware';

type PopupParams = {
  data: Record<string, any> | null;
  message?: StargazerRequestMessage;
  origin: string;
  route: string;
  resolved?: boolean;
};

type ExecutePopupProps = {
  params: PopupParams;
  url?: string;
  size?: { width: number; height: number };
  type?: chrome.windows.createTypeEnum;
};

export class StargazerExternalPopups {
  static async createPopup(
    params: PopupParams,
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

  static async createTab(params: PopupParams, url = '/cypherock.html') {
    const urlParams = this.encodeLocationParams(params);
    url += `?${urlParams.toString()}`;

    return await chrome.tabs.create({
      url,
    });
  }

  static async executePopup({
    params,
    url = '/external.html',
    size = { width: 372, height: 600 },
    type = 'popup',
  }: ExecutePopupProps) {
    const isHardwareWallet = HARDWARE_WALLETS_PAGES.includes(url);

    if (isHardwareWallet) {
      await this.createTab(params, url);
      return;
    }

    await this.createPopup(params, url, size, type);
  }

  static addResolvedParam(href: string): void {
    const params = StargazerExternalPopups.decodeRequestMessageLocationParams(href);

    let url = new URL(href);
    let updatedURL = url.origin + url.pathname;

    const urlParams = StargazerExternalPopups.encodeLocationParams({
      ...params,
      resolved: true,
    });

    updatedURL += `?${urlParams.toString()}`;

    window.history.replaceState({}, '', updatedURL);
  }

  static encodeLocationParams(params: Record<string, any>) {
    const urlParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      const valueString =
        typeof value === 'object' ? JSON.stringify(value) : String(value);
      const valueEncoded = encodeToBase64(valueString);
      urlParams.set(key, valueEncoded);
    }
    return urlParams;
  }

  static decodeLocationParams(url: string) {
    const urlObject = new URL(url);
    const params: Record<string, any> = {};

    for (const [param, value] of urlObject.searchParams.entries()) {
      const valueDecoded = decodeFromBase64(value);
      try {
        params[param] = JSON.parse(valueDecoded);
      } catch (e) {
        params[param] = valueDecoded;
      }
    }

    return params;
  }

  static decodeRequestMessageLocationParams<Data>(url: string) {
    const params = this.decodeLocationParams(url);

    if (params.message && !isStargazerRequestMessage(params.message)) {
      throw new Error('Invalid message param');
    }

    if (params.data && typeof params.data !== 'object') {
      throw new Error('Invalid data param');
    }

    if (typeof params.origin !== 'string') {
      throw new Error('Invalid origin param');
    }

    if (typeof params.route !== 'string') {
      throw new Error('Invalid route param');
    }

    return {
      data: params.data as Data,
      message: params.message as StargazerRequestMessage | undefined,
      origin: params.origin as string,
      route: params.route as string,
      resolved: !!params?.resolved as boolean,
    };
  }
}
