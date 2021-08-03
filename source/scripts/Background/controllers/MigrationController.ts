
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


  // /**
  //  * version = 2.2.0
  //  */
  // if (version === '2.1.0') {
  //   const v2_2 = require('../migration/v2_2');
  //   v2_2.default();
  // }
};

export default MigrationController;
