import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Transaction } from '@stardust-collective/dag4-network';

import { AVALANCHE_NETWORK, BSC_NETWORK, DAG_NETWORK, ETH_NETWORK, POLYGON_NETWORK } from 'constants/index';

import { KeyringNetwork, KeyringVaultState } from '@stardust-collective/dag4-keyring';
import findIndex from 'lodash/findIndex';
import IVaultState, { AssetBalances, AssetType, IAssetState, IWalletState, IVaultWalletsStoreState, ICustomNetworkObject, ICustomNetworks } from './types';
import { KeyringWalletState, KeyringWalletType } from '@stardust-collective/dag4-keyring';
import { IAssetInfoState } from 'state/assets/types';

const initialState: IVaultState = {
  status: 0,
  wallets: {
    local: [],
    ledger: [],
    bitfi: [],
  },
  hasEncryptedVault: false,
  balances: {
    // 349: New network should be added here.
    [AssetType.Constellation]: '0',
    [AssetType.Ethereum]: '0',
    [AssetType.Avalanche]: '0',
    [AssetType.BSC]: '0',
    [AssetType.Polygon]: '0',
  },
  // activeWalletId: undefined,
  activeWallet: undefined,
  activeAsset: undefined,
  // activeAccountId: '',
  activeNetwork: {
    // 349: New network should be added here.
    [KeyringNetwork.Constellation]: DAG_NETWORK.main.id,
    [KeyringNetwork.Ethereum]: ETH_NETWORK.mainnet.id,
    'Avalanche': AVALANCHE_NETWORK['avalanche-mainnet'].id,
    'BSC': BSC_NETWORK.bsc.id,
    'Polygon': POLYGON_NETWORK.matic.id,
  },
  customNetworks: {
    constellation: {},
    ethereum: {},
  },
  customAssets: [],
  version: '2.1.1',
};

export const getHasEncryptedVault = createAsyncThunk('vault/getHasEncryptedVault',
async () => {
  const hasEncryptedVault = await localStorage.getItem('stargazer-vault');
  return !!hasEncryptedVault;
});

// createSlice comes with immer produce so we don't need to take care of immutational update
const VaultState = createSlice({
  name: 'vault',
  initialState,
  reducers: {
    rehydrate(state: IVaultState, action: PayloadAction<IVaultState>) {
      return {
        ...state,
        ...action.payload,
      };
    },
    setVaultInfo(state: IVaultState, action: PayloadAction<KeyringVaultState>) {
      state.wallets.local = action.payload.wallets;
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
    addLedgerWallet(state: IVaultState, action){
      state.wallets.ledger = [
        ...state.wallets.ledger,
        action.payload
      ];
    },
    addBitfiWallet(state: IVaultState, action){
      state.wallets.bitfi = [
        ...state.wallets.bitfi,
        action.payload
      ];
    },
    updateWallets(state: IVaultState, action: PayloadAction<{wallets: IVaultWalletsStoreState}>){
      state.wallets = action.payload.wallets;
    },
    updateWalletLabel(state: IVaultState, action: PayloadAction<{wallet: KeyringWalletState, label: string}>){
      const isLedger = action.payload.wallet.type === KeyringWalletType.LedgerAccountWallet;
      const wallets  = isLedger ? state.wallets.ledger : state.wallets.bitfi;
      const index    = findIndex(wallets, (w) => w.id === action.payload.wallet.id);
      wallets[index].label = action.payload.label;
    },
    changeActiveWallet(state: IVaultState, action: PayloadAction<IWalletState>) {
      state.activeWallet = action.payload;
      if (state.activeWallet) {
        if (state.activeAsset) {
          state.activeAsset = { transactions: [], ...state.activeWallet.assets[0] };
        }
      } else {
        delete state.activeWallet;
        delete state.activeAsset;
      }
    },
    changeActiveNetwork(state: IVaultState, action: PayloadAction<{ network: string; chainId: string }>) {
      state.activeNetwork = {
        ...state.activeNetwork,
        [action.payload.network]: action.payload.chainId,
      };
    },
    changeActiveAsset(state: IVaultState, action: PayloadAction<IAssetState>) {
      state.activeAsset = { transactions: [], ...action.payload };
    },
    updateWalletAssets(state: IVaultState, action: PayloadAction<IAssetState[]>) {
      state.activeWallet.assets = action.payload;
    },
    updateActiveWalletLabel(state: IVaultState, action: PayloadAction<string>) {
      state.activeWallet.label = action.payload;
    },
    updateTransactions(state: IVaultState, action: PayloadAction<{ txs: Transaction[] }>) {
      state.activeAsset.transactions = action.payload.txs;
    },
    updateBalances(state: IVaultState, action: PayloadAction<AssetBalances>) {
      state.balances = action.payload;
    },
    // updateLabel(
    //   state: IVaultState,
    //   action: PayloadAction<{ wallet: IWalletState; label: string }>
    // ) {
    //   state.activeWallet.label = action.payload.label;
    // },
    addAsset(state: IVaultState, action: PayloadAction<IAssetState>) {
      state.activeWallet.assets = state.activeWallet.assets.concat([action.payload]);
    },
    removeAsset(state: IVaultState, action: PayloadAction<IAssetState>) {
      state.activeWallet.assets = state.activeWallet.assets.filter(asset => asset.id !== action.payload.id);
    },
    migrateWalletComplete(state: IVaultState) {
      delete state.migrateWallet;
    },
    addCustomNetwork(state: IVaultState, action: PayloadAction<{network: string, data: ICustomNetworkObject }>) {
      const { network, data } = action.payload;

      if (network && data) {
        state.customNetworks[network as keyof ICustomNetworks] = {
          ...state.customNetworks[network as keyof ICustomNetworks],
          [data.id]: data,
        };
      }
    },
    addCustomAsset(state: IVaultState, action: PayloadAction<IAssetInfoState>) {
      state.customAssets.push(action.payload);
    },
    removeCustomAsset(state: IVaultState, action: PayloadAction<IAssetInfoState>) {
      state.customAssets = state.customAssets.filter(asset => asset.id !== action.payload.id);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getHasEncryptedVault.fulfilled, (state, action) => {
      state.hasEncryptedVault = action.payload;
    });
  },
});

export const {
  addLedgerWallet,
  addBitfiWallet,
  updateWallets,
  rehydrate,
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
  updateActiveWalletLabel,
  updateTransactions,
  updateBalances,
  // updateLabel,
  addAsset,
  removeAsset,
  migrateWalletComplete,
  addCustomNetwork,
  addCustomAsset,
  removeCustomAsset,
} = VaultState.actions;

export default VaultState.reducer;
