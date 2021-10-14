/**
 * Handles derived data for wallets state.
 */

/////////////////////////
// Modules
/////////////////////////

import { RootState } from 'state/store';

/////////////////////////
// Selectors
/////////////////////////

/**
 * Returns root dapp state
 */
const dapp = (state: RootState) => state.dapp;

export default {
  dapp,
};
