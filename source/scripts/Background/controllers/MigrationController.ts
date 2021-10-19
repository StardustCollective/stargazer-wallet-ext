
const MigrationController = () => {
  // check current version of wallet
  const stateStr = localStorage.getItem('state');
  const state = JSON.parse(stateStr);

  if (!state) {
    return;
  }

  /**
   * version < 2.1
   */
  if (state.wallet) {
    const v2_1 = require('../migration/v2_1');
    v2_1.default(state);
  }

  /**
   * version < 3.1.1
   */
   if(state.dapp && !state.dapp.whitelist && !state.dapp.listening){
    const v3_1_1 = require('../migration/v3_1_1');
    v3_1_1.default(state);
   }


};

export default MigrationController;
