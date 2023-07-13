import WalletController from 'scripts/Background/controllers/WalletController';
import ContactsController from 'scripts/Background/controllers/ContactsController';

export const getWalletController = () => {
  return WalletController;
};

export const getAccountController = () => {
  return WalletController.account;
};

// There are no Dapp features on mobile
export const getDappController = () => {
  return null;
};

export const getContactsController = () => {
  return new ContactsController();
};
