/**
 * Handles derived data for wallets state.
 */

/////////////////////////
// Modules
/////////////////////////

import { IDAppInfo } from 'state/dapp/types';
import { RootState } from 'state/store';

/////////////////////////
// Selectors
/////////////////////////

/**
 * Returns root dapp state
 */
const dapp = (state: RootState) => state.dapp;

/**
 * Returns current dApp info
 */
const getCurrent = (state: RootState): IDAppInfo | null => state.dapp.current;

export default {
  dapp,
  getCurrent,
};
