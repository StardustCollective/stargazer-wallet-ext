import { browser, Windows } from 'webextension-polyfill-ts';
import { StargazerProvider } from 'scripts/Provider/StargazerProvider';
import { EthereumProvider } from 'scripts/Provider/EthereumProvider';
import WalletController from './WalletController';
import { IWalletController } from './IWalletController';
import ControllerUtils, { IControllerUtils } from './ControllerUtils';
import ContactsController, { IContactsController } from './ContactsController';
import MigrationController from './MigrationController';

import { DAppController } from './DAppController';
import { DappRegistry } from '../dappRegistry';

class MasterController {
  #stargazerProvider: StargazerProvider;
  #ethereumProvider: EthereumProvider;
  #wallet: IWalletController;
  #dapp: DAppController;
  #dappRegistry: DappRegistry;
  #contacts: IContactsController;
  #utils: IControllerUtils;

  constructor() {
    this.#stargazerProvider = new StargazerProvider();
    this.#ethereumProvider = new EthereumProvider();
    this.#wallet = WalletController;
    this.#dapp = new DAppController();
    this.#dappRegistry = new DappRegistry()
    this.#contacts = ContactsController();

    this.#utils = ControllerUtils();

    MigrationController();
  }

  get stargazerProvider() {
    return this.#stargazerProvider;
  }

  get ethereumProvider() {
    return this.#ethereumProvider;
  }

  get wallet() {
    return this.#wallet;
  }

  get dapp() {
    return this.#dapp;
  }

  get dappRegistry() {
    return this.#dappRegistry;
  }

  get contacts() {
    return this.#contacts;
  }

  get assets() {
    return this.#wallet.account.assetsController;
  }

  get appRoute() {
    return this.#utils.appRoute;
  }

  stateUpdater() {
    this.#utils.updateFiat();
  }

  async createPopup(
    windowId: string,
    network?: string,
    route?: string,
    data?: Record<any, any>,
    type: Windows.CreateType = 'popup',
    url: string = '/external.html',
    windowSize = { width: 372, height: 600 }
  ) {
    const { width = 372, height = 600 } = windowSize;
    const currentWindow = await browser.windows.getCurrent();

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

    return await browser.windows.create({
      url,
      width,
      height,
      type,
      top: 0,
      left: currentWindow.width - 372,
    });
  }
}

export { MasterController };
