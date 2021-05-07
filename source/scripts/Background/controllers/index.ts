import { WalletController } from './WalletController';
import { IWalletController } from './IWalletController';
import ControllerUtils from './ControllerUtils';
import ContactsController, { IContactsController } from './ContactsController';
import AssetsController, { IAssetsController } from './AssetsController';
import MigrationController from './MigrationController';

export interface IMasterController {
  wallet: Readonly<IWalletController>;
  contacts: Readonly<IContactsController>;
  assets: Readonly<IAssetsController>;
  stateUpdater: () => void;
  appRoute: (newRoute?: string) => string;
}

const MasterController = (): IMasterController => {
  const wallet = new WalletController();
  const utils = Object.freeze(ControllerUtils());
  const contacts = Object.freeze(
    ContactsController({ isUnlocked: wallet.isUnlocked })
  );
  const assets = Object.freeze(AssetsController(() => utils.updateFiat()));

  // Migration process
  Object.freeze(MigrationController());

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
