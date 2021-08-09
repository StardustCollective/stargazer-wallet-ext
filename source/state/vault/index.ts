import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Transaction } from '@stardust-collective/dag4-network';

import { DAG_NETWORK, ETH_NETWORK } from 'constants/index';

import IVaultState, {
  AssetBalances,
  AssetType,
  IAssetState, IWalletState
} from './types';

import {
  KeyringNetwork,
  KeyringVaultState,
} from '@stardust-collective/dag4-keyring';

const hasEncryptedVault = !!localStorage.getItem('stargazer-vault');

const initialState: IVaultState = {
  status: 0,
  wallets: [],
  hasEncryptedVault,
  balances: {
    [AssetType.Constellation]: '0',
    [AssetType.Ethereum]: '0',
  },
  // activeWalletId: undefined,
  activeWallet: undefined,
  activeAsset: undefined,
  // activeAccountId: '',
  activeNetwork: {
    [KeyringNetwork.Constellation]: DAG_NETWORK.main.id,
    [KeyringNetwork.Ethereum]: ETH_NETWORK.mainnet.id,
  },
  version: '2.1.1',
};

// createSlice comes with immer produce so we don't need to take care of immutational update
const VaultState = createSlice({
  name: 'vault',
  initialState,
  reducers: {
    setVaultInfo(
      state: IVaultState,
      action: PayloadAction<KeyringVaultState>
    ) {
      state.wallets = action.payload.wallets;
      // if (!state.activeWallet) {
      //   state.activeWallet = { assets:[], ...state.wallets[0] };
      // }
    },
    // setKeystoreInfo(
    //   state: IVaultState,
    //   action: PayloadAction<{ keystore: Keystore; networkType: NetworkType }>
    // ) {
    //   const id = `${
    //     action.payload.networkType === NetworkType.Ethereum ? ETH_PREFIX : ''
    //   }${action.payload.keystore.id}`;
    //
    //   state.keystores = {
    //     ...state.keystores,
    //     [id]: action.payload.keystore,
    //   };
    // },
    // removeKeystoreInfo(state: IVaultState, action: PayloadAction<string>) {
    //   if (state.keystores[action.payload])
    //     delete state.keystores[action.payload];
    // },
    updateStatus(state: IVaultState) {
      state.status = Date.now();
    },
    // createAccount(state: IWalletState, action: PayloadAction<IAccountState>) {
    //   return {
    //     ...state,
    //     accounts: {
    //       ...state.accounts,
    //       [action.payload.id]: action.payload,
    //     },
    //     activeAccountId: action.payload.id,
    //   };
    // },
    // createAccount(state: IVaultState, action: PayloadAction<IWalletState>) {
    //   return {
    //     ...state,
    //     accounts: {
    //       ...state.accounts,
    //       [action.payload.id]: action.payload,
    //     },
    //     activeAccountId: action.payload.id,
    //   };
    // },
    // removeAccount(state: IVaultState, action: PayloadAction<string>) {
    //   if (Object.keys(state.accounts).length <= 1) return;
    //   if (state.activeAccountId === action.payload) {
    //     state.activeAccountId = Object.keys(state.accounts)[0];
    //   }
    //   delete state.accounts[action.payload];
    // },
    // removeAllAccounts(state: IVaultState) {
    //   state.accounts = {};
    //   state.activeAccountId = '';
    // },
    // updateAccount(
    //   state: IVaultState,
    //   action: PayloadAction<IAccountUpdateState>
    // ) {
    //   state.accounts[action.payload.id] = {
    //     ...state.accounts[action.payload.id],
    //     ...action.payload,
    //   };
    // },
    // deleteWallet(state: IVaultState) {
    //   state.keystores = {};
    //   state.accounts = {};
    //   state.activeAccountId = '0';
    //   state.activeNetwork = {
    //     [AssetType.Constellation]: DAG_NETWORK.main.id,
    //     [AssetType.Ethereum]: ETH_NETWORK.main.id,
    //   };
    // },
    changeActiveWallet(
      state: IVaultState,
      action: PayloadAction<IWalletState>
    ) {
      state.activeWallet = action.payload;
      if (state.activeWallet) {
        if (state.activeAsset) {
          state.activeAsset = { transactions: [], ...state.activeWallet.assets[0] };
        }
      }
      else {
        delete state.activeWallet;
        delete state.activeAsset;
      }
    },
    changeActiveNetwork(
      state: IVaultState,
      action: PayloadAction<{ network: KeyringNetwork; chainId: string }>
    ) {
      state.activeNetwork = {
        ...state.activeNetwork,
        [action.payload.network]: action.payload.chainId,
      };
    },
    changeActiveAsset(
      state: IVaultState,
      action: PayloadAction<IAssetState>
    ) {
      state.activeAsset = { transactions: [], ...action.payload };
    },
    updateWalletAssets(
      state: IVaultState,
      action: PayloadAction<IAssetState[]>
    ) {
      state.activeWallet.assets = action.payload;
    },
    updateWalletLabel(
      state: IVaultState,
      action: PayloadAction<string>
    ) {
      state.activeWallet.label = action.payload;
    },
    updateTransactions(
      state: IVaultState,
      action: PayloadAction<{txs: Transaction[]}>
    ) {
      state.activeAsset.transactions = action.payload.txs;
    },
    updateBalances(
      state: IVaultState,
      action: PayloadAction<AssetBalances>
    ) {
      state.balances = action.payload;
    },
    // updateLabel(
    //   state: IVaultState,
    //   action: PayloadAction<{ wallet: IWalletState; label: string }>
    // ) {
    //   state.activeWallet.label = action.payload.label;
    // },
    addAsset(
      state: IVaultState,
      action: PayloadAction<IAssetState>
    ) {
      state.activeWallet.assets = state.activeWallet.assets.concat([action.payload]);
      //state.activeAsset = action.payload.asset;
    },
    migrateWalletComplete(
      state: IVaultState,
    ) {
      delete state.migrateWallet;
    },
  },
});

export const {
  setVaultInfo,
  // setKeystoreInfo,
  // removeKeystoreInfo,
  updateStatus,
  // createAccount,
  // removeAccount,
  // removeAllAccounts,
  // deleteWallet,
  changeActiveWallet,
  changeActiveNetwork,
  changeActiveAsset,
  // updateAccount,
  updateWalletAssets,
  updateWalletLabel,
  updateTransactions,
  updateBalances,
  // updateLabel,
  addAsset,
  migrateWalletComplete,
} = VaultState.actions;

export default VaultState.reducer;
