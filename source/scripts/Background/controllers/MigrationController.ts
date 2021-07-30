import store from 'state/store';
import IVaultState from 'state/vault/types';

const MigrationController = () => {
  // check current version of wallet
  const { version }: IVaultState = store.getState().vault;
  //
  // /**
  //  * version < 2.1
  //  */
  if (!version) {
    const v2_1 = require('../migration/v2_1');
    v2_1.default();
  }
  // /**
  //  * version = 2.2.0
  //  */
  // if (version === '2.1.0') {
  //   const v2_2 = require('../migration/v2_2');
  //   v2_2.default();
  // }
};

export default MigrationController;
