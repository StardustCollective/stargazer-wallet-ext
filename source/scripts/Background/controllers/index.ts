import WalletController, { IWalletController } from './WalletController';

export interface IMasterController {
  wallet: Readonly<IWalletController>;
}

const MasterController = (): IMasterController => {
  const wallet = Object.freeze(WalletController());

  return {
    wallet,
  };
};

export default MasterController;
