import WalletController, { IWalletController } from './WalletController';
import ControllerUtils from './ControllerUtils';
import ContactsController, { IContactsController } from './ContactsController';
import AssetsController, { IAssetsController } from './AssetsController';
export interface IMasterController {
  wallet: Readonly<IWalletController>;
  contacts: Readonly<IContactsController>;
  assets: Readonly<IAssetsController>;
  stateUpdater: () => void;
  appRoute: (newRoute?: string) => string;
}

const MasterController = (): IMasterController => {
  const wallet = Object.freeze(WalletController());
  const utils = Object.freeze(ControllerUtils());
  const contacts = Object.freeze(
    ContactsController({ isLocked: wallet.isLocked })
  );
  const assets = Object.freeze(AssetsController());

  const stateUpdater = () => {
    utils.updateFiat();
  };

  return {
    wallet,
    contacts,
    assets,
    appRoute: utils.appRoute,
    stateUpdater,
  };
};

export default MasterController;
