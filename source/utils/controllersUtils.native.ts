import WalletController from 'scripts/Background/controllers/WalletController';

export const getWalletController = () => {
  return WalletController;
}

export const getAccountController = () => {
  return WalletController.account;
}

// There are no Dapp features on mobile 
export const getDappController = () => {
  return null;
}