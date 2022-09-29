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
  //  if (state.assets) {
  //   const assetListMigration = require('../migration/update_token_list');
  //   await assetListMigration.default(state);  // Checks if state needs to be updated
  // }

  /**
   * version < 3.3.0
   */
  if (!state.nfts) {
    const NFTMigration = require('../migration/v3_3');
    await NFTMigration.default(state); 
  }

  /**
   * version < 3_5_0
   */
  if (Array.isArray(state?.vault?.wallets)) {
    const v3_5_0 = require('../migration/v3_5_0');
    await v3_5_0.default(state); 
  }

  /**
   * version < 3_5_1
   */
     if (!state.vault.wallets.bitfi) {
      const v3_5_1 = require('../migration/v3_5_1');
      await v3_5_1.default(state); 
    }

  /** 
   * version < 3_8_0
   */
  if (!state.vault.activeNetwork.Polygon) {
    const v3_8_0 = require('../migration/v3_8_0');
    await v3_8_0.default(state);
  }

  /** 
   * version < 3_8_2
   */
  if (!state.vault.activeNetwork.Avalanche) {
    const v3_8_2 = require('../migration/v3_8_2');
    await v3_8_2.default(state);
  }

  /** 
   * version < 3_8_3
   */
  if (!state.vault.activeNetwork.BSC) {
    const v3_8_3 = require('../migration/v3_8_3');
    await v3_8_3.default(state);
  }

  /** 
   * version < 3_9_1
   */
  if (state.vault.activeNetwork.Constellation === 'main') {
    const v3_9_1 = require('../migration/v3_9_1');
    await v3_9_1.default(state);
  }
};

export default MigrationController;
