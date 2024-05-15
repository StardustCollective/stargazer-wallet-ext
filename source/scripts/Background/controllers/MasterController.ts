import { EVMProvider } from 'scripts/Provider/evm';
import { ConstellationProvider } from 'scripts/Provider/constellation';
import WalletController from './WalletController';
import ControllerUtils, { IControllerUtils } from './ControllerUtils';
import ContactsController, { IContactsController } from './ContactsController';
import MigrationController from './MigrationController';
import DAppController from './DAppController';

class MasterController {
  #stargazerProvider: ConstellationProvider;
  #ethereumProvider: EVMProvider;
  #wallet: typeof WalletController;
  #dapp: DAppController;

  #contacts: IContactsController;
  #utils: IControllerUtils;

  constructor() {
    this.#stargazerProvider = new ConstellationProvider();
    this.#ethereumProvider = new EVMProvider();
    this.#wallet = WalletController;
    this.#dapp = new DAppController();

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

  get contacts() {
    return this.#contacts;
  }

  get assets() {
    return this.#wallet.account.assetsController;
  }

  get appRoute() {
    return this.#utils.appRoute;
  }
}

export { MasterController };
