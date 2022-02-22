import WalletController from 'scripts/Background/controllers/WalletController';

export const getWalletController = () => {
  return WalletController;
}

export const getAccountController = () => {
  return WalletController.account;
}