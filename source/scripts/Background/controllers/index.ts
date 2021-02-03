import WalletController, { IWalletController } from './WalletController';
import ControllerUtils from './ControllerUtils';
export interface IMasterController {
  wallet: Readonly<IWalletController>;
  stateUpdater: () => void;
  appRoute: (newRoute?: string) => string;
}

const MasterController = (): IMasterController => {
  const wallet = Object.freeze(WalletController());
  const utils = Object.freeze(ControllerUtils());

  const stateUpdater = () => {
    utils.updateFiat();
  };

  return {
    wallet,
    appRoute: utils.appRoute,
    stateUpdater,
  };
};

export default MasterController;
