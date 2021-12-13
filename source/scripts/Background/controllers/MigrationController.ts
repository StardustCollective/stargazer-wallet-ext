
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

   /**
   * version < 3.2.0
   */
    if(state.assets && !state.assets.hasOwnProperty('0x4e08f03079c5cd3083ea331ec61bcc87538b7665')){
      const v3_2_0 = require('../migration/v3_2_0');
      v3_2_0.default(state);
     }


};

export default MigrationController;
