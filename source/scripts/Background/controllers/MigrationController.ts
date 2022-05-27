import { loadState } from "state/localStorage";

const MigrationController = async () => {
  // check current version of wallet
  const state = await loadState();

  if (!state) {
    return;
  }

  /**
   * version < 2.1
   */
  if (state.wallet) {
    const v2_1 = require('../migration/v2_1');
    await v2_1.default(state);
  }

  /**
   * version < 3.1.1
   */
  if (state.dapp && !state.dapp.whitelist && !state.dapp.listening){
    const v3_1_1 = require('../migration/v3_1_1');
    await v3_1_1.default(state);
  }

   /**
   * Upgrade asset list any time it's out of sync
   */
  if (state.assets){
    const assetListMigration = require('../migration/update_token_list');
    await assetListMigration.default(state);  // Checks if state needs to be updated
  }

  /**
   * version < 3.3.0
   */
  if (!state.nfts) {
    const NFTMigration = require('../migration/v3_3');
    await NFTMigration.default(state); 
  }

  /**
   * version < 3_4_2
   */
  if (Array.isArray(state?.vault?.wallets)) {
    const v3_4_2 = require('../migration/v3_4_2');
    await v3_4_2.default(state); 
  }
};

export default MigrationController;
