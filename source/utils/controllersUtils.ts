import { MasterController } from 'scripts/Background/controllers';
import WalletController from 'scripts/Background/controllers/WalletController';
import ContactsController from 'scripts/Background/controllers/ContactsController';

let controller: MasterController;

export function getController() {
  if (controller) return controller;
  controller = new MasterController();
  return controller;
}

export const getWalletController = () => {
  return WalletController;
};

export const getAccountController = () => {
  return getWalletController().account;
};

export const getDappController = () => {
  return getController().dapp;
};

export const getDappRegistry = () => {
  return getController().dappRegistry;
};

export const getContactsController = () => {
  return ContactsController();
};
