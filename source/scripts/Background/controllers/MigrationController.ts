import { loadState } from 'state/localStorage';

import { isNative } from 'utils/envUtil';
import { compareVersions } from 'utils/version';

import { checkStorageMigration } from '../migration/v5_0_0';

const MigrationController = async () => {
  // check current version of wallet
  const state = await loadState();

  if (!state) {
    /**
     * version < 5_0_0
     * Description: Migrates localStorage to Storage API
     */
    await checkStorageMigration();
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
  if (state.dapp && !state.dapp.whitelist && !state.dapp.listening) {
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
  // if (!state.nfts) {
  //   const NFTMigration = require('../migration/v3_3');
  //   await NFTMigration.default(state);
  // }

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

  /**
   * version < 3_10_0
   */
  if (!state.swap) {
    const v3_10_0 = require('../migration/v3_10_0');
    await v3_10_0.default(state);
  }

  /**
   * version < 3_11_1
   */
  if (compareVersions(state.vault.version, '3.11.1') < 0) {
    const v3_11_1 = require('../migration/v3_11_1');
    await v3_11_1.default(state);
  }

  /**
   * version < 4_0_0
   * Description: Adds JennyCo token
   */
  if (compareVersions(state.vault.version, '4.0.0') < 0) {
    const v4_0_0 = require('../migration/v4_0_0');
    await v4_0_0.default(state);
  }

  /**
   * version < 4_0_1
   * Description: Adds DOR token
   */
  if (compareVersions(state.vault.version, '4.0.1') < 0) {
    const v4_0_1 = require('../migration/v4_0_1');
    await v4_0_1.default(state);
  }

  /**
   * version < 4_0_3
   * Description: Adds priceId "dor" to the DOR token
   */
  if (compareVersions(state.vault.version, '4.0.3') < 0) {
    const v4_0_3 = require('../migration/v4_0_3');
    await v4_0_3.default(state);
  }

  /**
   * version < 4_1_0
   * Description: Updates LB endpoints on the DOR token and the logo in multiple tokens
   */
  if (compareVersions(state.vault.version, '4.1.0') < 0) {
    const v4_1_0 = require('../migration/v4_1_0');
    await v4_1_0.default(state);
  }

  /**
   * version < 5_0_0
   * Description: Migrates state only on Mobile
   */
  if (isNative && compareVersions(state.vault.version, '5.0.0') < 0) {
    const v5_0_0 = require('../migration/v5_0_0');
    await v5_0_0.default(state);
  }

  /**
   * version < 5_2_0
   * Description: adds Base network
   */
  if (!state.vault.activeNetwork.Base) {
    const v5_2_0 = require('../migration/v5_2_0');
    await v5_2_0.default(state);
  }

  /**
   * version < 5_3_0
   * Description: Adds Data L1 endpoints on DOR token
   */
  if (compareVersions(state.vault.version, '5.3.0') < 0) {
    const v5_3_0 = require('../migration/v5_3_0');
    await v5_3_0.default(state);
  }

  /**
   * version < 5_3_5
   * Description: Adds priceId for UP token and updates NDT endpoints
   */
  if (compareVersions(state.vault.version, '5.3.5') < 0) {
    const v5_3_5 = require('../migration/v5_3_5');
    await v5_3_5.default(state);
  }

  /**
   * version < 5_4_0
   * Description: Add cypherock wallet state
   */
  if (!state.vault.wallets.cypherock) {
    const v5_4_0 = require('../migration/v5_4_0');
    await v5_4_0.default(state);
  }

  /**
   * version < 5_4_2
   * Description: Add USDC.dag and SWAP assets
   */
  if (compareVersions(state.vault.version, '5.4.2') < 0) {
    const v5_4_2 = require('../migration/v5_4_2');
    await v5_4_2.default(state);
  }

  /**
   * version < 5_4_4
   * Description: Update Base DAG and Base DOR contract addresses
   */
  if (compareVersions(state.vault.version, '5.4.4') < 0) {
    const v5_4_4 = require('../migration/v5_4_4');
    await v5_4_4.default(state);
  }

  /**
   * version < 5_4_5
   * Description: Add Ink network
   */
  if (compareVersions(state.vault.version, '5.4.5') < 0) {
    const v5_4_5 = require('../migration/v5_4_5');
    await v5_4_5.default(state);
  }

  /**
   * version < 5_4_6
   * Description: Add PacaSwap priceId
   */
  if (compareVersions(state.vault.version, '5.4.6') < 0) {
    const v5_4_6 = require('../migration/v5_4_6');
    await v5_4_6.default(state);
  }
};

export default MigrationController;
