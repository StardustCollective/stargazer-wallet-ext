import { StargazerProvider } from 'scripts/Provider/StargazerProvider';
import WalletController from './WalletController';
import ControllerUtils, { IControllerUtils } from './ControllerUtils';
import ContactsController, { IContactsController } from './ContactsController';
import MigrationController from './MigrationController';
import DAppController from './DAppController';
import { DappRegistry } from '../dappRegistry';
import { EVMProvider } from 'scripts/Provider/EVMProvider';

class MasterController {
  #stargazerProvider: StargazerProvider;
  #ethereumProvider: EVMProvider;
  #wallet: typeof WalletController;
  #dapp: DAppController;
  #dappRegistry: DappRegistry;
  #contacts: IContactsController;
  #utils: IControllerUtils;

  constructor() {
    this.#stargazerProvider = new StargazerProvider();
    this.#ethereumProvider = new EVMProvider();
    this.#wallet = WalletController;
    this.#dapp = new DAppController(null);
    this.#dappRegistry = new DappRegistry();
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
}

export { MasterController };
