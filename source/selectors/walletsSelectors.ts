/**
 * Handles derived data for wallets state.
 */

/////////////////////////
// Modules
/////////////////////////

import { RootState } from 'state/store';
import { createSelector } from 'reselect';
import {
  KeyringNetwork,
  KeyringWalletState,
} from '@stardust-collective/dag4-keyring';

/////////////////////////
// Types
/////////////////////////

import { IAccountDerived } from 'state/vault/types';

/////////////////////////
// Selectors
/////////////////////////

/**
 * Returns root wallets state
 */
const wallets = (state: RootState) => state.vault.wallets;

/**
 * Returns all accounts from all wallets.
 */

const selectAllAccounts = createSelector
(wallets, (wallets: KeyringWalletState[]) => {
  let allAccounts = [];
  for (let i = 0; i < wallets.length; i++) {
    let accounts  = wallets[i].accounts
    for (let j = 0; j < wallets[i].accounts.length; j++) {
      let account = accounts[j] as IAccountDerived;
      account.label = wallets[i].label;
      allAccounts.push(account);
    }
  }
  return allAccounts;
});

/**
 * Returns all DAG accounts from all wallets.
 */
const selectAllDagAccounts = createSelector(
  selectAllAccounts,
  (allAccounts: IAccountDerived[]) => {
    return allAccounts.filter(
      (account) => account.network === KeyringNetwork.Constellation
    );
  }
);

/**
 * Returns all ETH accounts from all wallets.
 */
const selectAllEthAccounts = createSelector(
  selectAllAccounts,
  (allAccounts: IAccountDerived[]) => {
    return allAccounts.filter(
      (account) => account.network === KeyringNetwork.Ethereum
    );
  }
);

export default {
  selectAllAccounts,
  selectAllDagAccounts,
  selectAllEthAccounts,
};
