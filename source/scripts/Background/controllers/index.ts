import { WalletController } from './WalletController';
import { IWalletController } from './IWalletController';
import ControllerUtils from './ControllerUtils';
import ContactsController, { IContactsController } from './ContactsController';
import AssetsController, { IAssetsController } from './AssetsController';
import MigrationController from './MigrationController';

import { browser, Windows } from 'webextension-polyfill-ts';
import { StargazerProvider } from 'scripts/Provider/StargazerProvider';
import DAppController, { IDAppController } from './DAppController';

export interface IMasterController {
  stargazerProvider: Readonly<StargazerProvider>;
  wallet: Readonly<IWalletController>;
  dapp: Readonly<IDAppController>;
  contacts: Readonly<IContactsController>;
  assets: Readonly<IAssetsController>;
  stateUpdater: () => void;
  appRoute: (newRoute?: string) => string;
  createPopup: (windowId: any) => Promise<Windows.Window | null>;
}

const MasterController = (): IMasterController => {
  const stargazerProvider = Object.freeze(new StargazerProvider());
  const wallet = new WalletController();
  const utils = Object.freeze(ControllerUtils());
  const dapp = Object.freeze(DAppController());
  const contacts = Object.freeze(ContactsController());
  const assets = Object.freeze(AssetsController(() => utils.updateFiat()));

  // Migration process
  Object.freeze(MigrationController());

  const stateUpdater = () => {
    utils.updateFiat();
  };

  const createPopup = async (windowId: any) => {
    const _window = await browser.windows.getCurrent();
    if (!_window || !_window.width) return null;
    return await browser.windows.create({
      url: `/external.html#${windowId}`,
      width: 372,
      height: 600,
      type: 'popup',
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
  };
};

export default MasterController;
