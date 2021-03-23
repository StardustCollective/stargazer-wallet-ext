import store from 'state/store';
import IWalletState from 'state/wallet/types';

const MigrationController = () => {
  // check current version of wallet
  const { version }: IWalletState = store.getState().wallet;

  /**
   * version < 2.0
   */
  if (!version) {
    const v2_0 = require('../migration/v2_0');
    v2_0.default();
  }
};

export default MigrationController;
