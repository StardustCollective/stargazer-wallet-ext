import WalletController, { IWalletController } from './WalletController';
import ControllerUtils from './ControllerUtils';
import ContactsController, { IContactsController } from './ContactsController';
import { browser, Windows } from 'webextension-polyfill-ts';
import { StargazerProvider } from 'scripts/Provider/StargazerProvider';
import DAppController, { IDAppController } from './DAppController';
export interface IMasterController {
  stargazerProvider: Readonly<StargazerProvider>;
  wallet: Readonly<IWalletController>;
  dapp: Readonly<IDAppController>;
  contacts: Readonly<IContactsController>;
  stateUpdater: () => void;
  appRoute: (newRoute?: string) => string;
  createPopup: (windowId: any) => Promise<Windows.Window>;
}

const MasterController = (): IMasterController => {
  const stargazerProvider = Object.freeze(new StargazerProvider());
  const wallet = Object.freeze(WalletController());
  const utils = Object.freeze(ControllerUtils());
  const dapp = Object.freeze(DAppController());
  const contacts = Object.freeze(
    ContactsController({ isLocked: wallet.isLocked })
  );

  const stateUpdater = () => {
    utils.updateFiat();
  };

  const createPopup = async (windowId: any) => {
    return await browser.windows.create({
      url: `/confirm.html#${windowId}`,
      width: 372,
      height: 650,
      type: 'popup',
    });
  };

  return {
    wallet,
    contacts,
    dapp,
    appRoute: utils.appRoute,
    stateUpdater,
    createPopup,
    stargazerProvider,
  };
};

export default MasterController;
