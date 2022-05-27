import { browser, Windows } from 'webextension-polyfill-ts';
import { StargazerProvider } from 'scripts/Provider/StargazerProvider';
import { EthereumProvider } from 'scripts/Provider/EthereumProvider';
import WalletController from './WalletController';
import { IWalletController } from './IWalletController';
import ControllerUtils from './ControllerUtils';
import ContactsController, { IContactsController } from './ContactsController';
import { IAssetsController } from './AssetsController';
import MigrationController from './MigrationController';

import DAppController, { IDAppController } from './DAppController';

export interface IMasterController {
  stargazerProvider: Readonly<StargazerProvider>;
  ethereumProvider: Readonly<EthereumProvider>;
  wallet: Readonly<IWalletController>;
  dapp: Readonly<IDAppController>;
  contacts: Readonly<IContactsController>;
  assets: Readonly<IAssetsController>;
  stateUpdater: () => void;
  appRoute: (newRoute?: string) => string;
  createPopup: (windowId: any, network?: string, route?: string, data?: {}, type?: any, url?: any, windowSize?: { width: number, height: number} ) => Promise<Windows.Window | null>;
}

const MasterController = (): IMasterController => {
  const stargazerProvider = Object.freeze(new StargazerProvider());
  const ethereumProvider = Object.freeze(new EthereumProvider());
  const wallet = WalletController;
  const utils = Object.freeze(ControllerUtils());
  const dapp = Object.freeze(DAppController());
  const contacts = Object.freeze(ContactsController());
  const assets = WalletController.account.assetsController;

  // Migration process
  Object.freeze(MigrationController());

  const stateUpdater = () => {
    utils.updateFiat();
  };

  const createPopup = async (windowId: any, network: string, route: string, data: {}, type: any = 'popup', url: any = '/external.html', { width = 372, height = 600}) => {
    const _window = await browser.windows.getCurrent();
    if (!_window || !_window.width) return null;
    url += '?';
    if (route) {
      url += `&route=${route}`;
    }
    if (network) {
      url += `&network=${network}`;
    }
    if (data) {
      url += `&data=${JSON.stringify(data)}`;
    }
    // This was being passed only in hash value but it gets dropped somethings in routing
    url += `&windowId=${windowId}`;
    url += `#${windowId}`;

    return await browser.windows.create({
      url,
      width,
      height,
      type,
      top: 0,
      left: _window.width - 372,
    });
  };

  return {
    wallet,
    contacts,
    assets,
    dapp,
    appRoute: utils.appRoute,
    stateUpdater,
    createPopup,
    stargazerProvider,
    ethereumProvider,
  };
};

export default MasterController;
