import WalletController from 'scripts/Background/controllers/WalletController';
import ContactsController from 'scripts/Background/controllers/ContactsController';

export const getWalletController = () => {
  return WalletController;
};

export const getAccountController = () => {
  return getWalletController().account;
};

export const getContactsController = () => {
  return ContactsController();
};
