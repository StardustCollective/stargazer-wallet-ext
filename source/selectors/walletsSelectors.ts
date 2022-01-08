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
} from '@stardust-collective/dag4-keyring';

/////////////////////////
// Types
/////////////////////////

import { IAccountDerived, IVaultWalletsStoreState } from 'state/vault/types';

/////////////////////////
// Selectors
/////////////////////////

/**
 * Returns root wallets state
 */
const wallets = (state: RootState) => state.vault.wallets;

/**
 * Returns local wallets.
 */

const selectLocalWallets = createSelector(wallets,
  (wallets: IVaultWalletsStoreState) => wallets.local
);

/**
 * Returns ledger wallets.
 */

 const selectLedgerWallets = createSelector(wallets,
  (wallets: IVaultWalletsStoreState) => wallets.ledger
);


/**
 * Returns all wallets.
 */

 const selectAllWallets = createSelector(
  selectLocalWallets,
  selectLedgerWallets,
  (localWallet, ledgerWallet) => {
    return [...localWallet, ...ledgerWallet];
  }
);

/**
 * Returns all accounts from all wallets.
 */

const selectAllAccounts = createSelector(
  selectAllWallets, 
  (wallets) => {
    let allAccounts = [];
    for (let i = 0; i < wallets.length; i++) {
      let accounts = wallets[i].accounts
      for (let j = 0; j < wallets[i].accounts.length; j++) {
        let account = accounts[j] as any as IAccountDerived;
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
  (allAccounts) => {
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
  (allAccounts) => {
    return allAccounts.filter(
      (account) => account.network === KeyringNetwork.Ethereum
    );
  }
);

export default {
  selectAllAccounts,
  selectAllDagAccounts,
  selectAllEthAccounts,
  selectAllWallets
};
