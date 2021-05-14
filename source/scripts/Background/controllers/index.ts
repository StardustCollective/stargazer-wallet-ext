import WalletController, { IWalletController } from './WalletController';
import ControllerUtils from './ControllerUtils';
import ContactsController, { IContactsController } from './ContactsController';
import { browser } from 'webextension-polyfill-ts';
import { StargazerProvider } from 'scripts/Provider/StargazerProvider';
export interface IMasterController {
  stargazerProvider: Readonly<StargazerProvider>;
  wallet: Readonly<IWalletController>;
  contacts: Readonly<IContactsController>;
  stateUpdater: () => void;
  appRoute: (newRoute?: string) => string;
  createPopup: (windowId: any) => void;
}

const MasterController = (): IMasterController => {
  const stargazerProvider = Object.freeze(new StargazerProvider());
  const wallet = Object.freeze(WalletController());
  const utils = Object.freeze(ControllerUtils());
  const contacts = Object.freeze(
    ContactsController({ isLocked: wallet.isLocked })
  );

  const stateUpdater = () => {
    utils.updateFiat();
  };

  const createPopup = (windowId: any) => {
    browser.windows.create({
      url: `/confirm.html#${windowId}`,
      width: 372,
      height: 650,
      type: 'popup',
    });
  };

  return {
    wallet,
    contacts,
    appRoute: utils.appRoute,
    stateUpdater,
    createPopup,
    stargazerProvider
  };
};

export default MasterController;
