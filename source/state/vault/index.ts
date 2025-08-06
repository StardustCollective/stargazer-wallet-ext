import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import localStorage from 'utils/localStorage';
import {
  AVALANCHE_NETWORK,
  BASE_NETWORK,
  BSC_NETWORK,
  DAG_NETWORK,
  ETH_NETWORK,
  POLYGON_NETWORK,
} from 'constants/index';

import {
  KeyringNetwork,
  KeyringVaultState,
  KeyringWalletState,
  KeyringWalletType,
} from '@stardust-collective/dag4-keyring';
import findIndex from 'lodash/findIndex';
import { IAssetInfoState } from 'state/assets/types';
import IVaultState, {
  AssetType,
  IAssetState,
  IWalletState,
  IVaultWalletsStoreState,
  ICustomNetworkObject,
  ICustomNetworks,
  Transaction,
  Reward,
} from './types';
import { upsertById } from 'utils/objects';
import type { ActionV2 } from '@stardust-collective/dag4-network';

const initialState: IVaultState = {
  status: 0,
  wallets: {
    local: [],
    ledger: [],
    bitfi: [],
    cypherock: [],
  },
  publicKey: null,
  hasEncryptedVault: false,
  balances: {
    // 349: New network should be added here.
    [AssetType.Constellation]: '0',
    [AssetType.Ethereum]: '0',
    [AssetType.Avalanche]: '0',
    [AssetType.BSC]: '0',
    [AssetType.Polygon]: '0',
    [AssetType.Base]: '0',
  },
  activeWallet: null,
  activeAsset: null,
  activeNetwork: {
    // 349: New network should be added here.
    [KeyringNetwork.Constellation]: DAG_NETWORK.main2.id,
    [KeyringNetwork.Ethereum]: ETH_NETWORK.mainnet.id,
    Avalanche: AVALANCHE_NETWORK['avalanche-mainnet'].id,
    BSC: BSC_NETWORK.bsc.id,
    Polygon: POLYGON_NETWORK.matic.id,
    Base: BASE_NETWORK['base-mainnet'].id,
  },
  currentEVMNetwork: ETH_NETWORK.mainnet.id,
  customNetworks: {
    constellation: {},
    ethereum: {},
  },
  customAssets: [],
  version: '5.3.5',
};

export const getHasEncryptedVault = createAsyncThunk(
  'vault/getHasEncryptedVault',
  async () => {
    const hasEncryptedVault = await localStorage.getItem('stargazer-vault');
    return !!hasEncryptedVault;
  }
);

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
    },
    setPublicKey(state: IVaultState, action: PayloadAction<string>) {
      state.publicKey = action.payload;
    },
    removePublicKey(state: IVaultState) {
      state.publicKey = null;
    },
    updateStatus(state: IVaultState) {
      state.status = Date.now();
    },
    addLedgerWallet(state: IVaultState, action) {
      state.wallets.ledger = [...state.wallets.ledger, action.payload];
    },
    addBitfiWallet(state: IVaultState, action) {
      state.wallets.bitfi = [...state.wallets.bitfi, action.payload];
    },
    addCypherockWallet(state: IVaultState, action) {
      state.wallets.cypherock = [...state.wallets.cypherock, action.payload];
    },
    updateWallets(
      state: IVaultState,
      action: PayloadAction<{ wallets: IVaultWalletsStoreState }>
    ) {
      state.wallets = action.payload.wallets;
    },
    updateWalletLabel(
      state: IVaultState,
      action: PayloadAction<{ wallet: KeyringWalletState; label: string }>
    ) {
      const { wallet, label } = action.payload;
      let walletList: KeyringWalletState[];

      switch (wallet.type) {
        case KeyringWalletType.LedgerAccountWallet:
          walletList = state.wallets.ledger;
          break;
        case KeyringWalletType.CypherockAccountWallet:
          walletList = state.wallets.cypherock;
          break;
        case KeyringWalletType.BitfiAccountWallet:
          walletList = state.wallets.bitfi;
          break;
        default:
          break;
      }

      const index = findIndex(walletList, (w) => w.id === wallet.id);

      if (index !== -1 && walletList[index]) {
        walletList[index].label = label;
      }
    },
    changeActiveWallet(state: IVaultState, action: PayloadAction<IWalletState>) {
      state.activeWallet = action.payload;
      if (state.activeWallet) {
        if (state.activeAsset) {
          state.activeAsset = {
            transactions: [],
            rewards: [],
            actions: [],
            ...state.activeWallet.assets[0],
          };
        }
      } else {
        delete state.activeWallet;
        delete state.activeAsset;
      }
    },
    changeActiveNetwork(
      state: IVaultState,
      action: PayloadAction<{ network: string; chainId: string }>
    ) {
      state.activeNetwork = {
        ...state.activeNetwork,
        [action.payload.network]: action.payload.chainId,
      };
    },
    changeCurrentEVMNetwork(state: IVaultState, action: PayloadAction<string>) {
      state.currentEVMNetwork = action.payload;
    },
    changeActiveAsset(state: IVaultState, action: PayloadAction<IAssetState>) {
      state.activeAsset = { transactions: [], rewards: [], actions: [], ...action.payload };
    },
    updateWalletAssets(state: IVaultState, action: PayloadAction<IAssetState[]>) {
      state.activeWallet.assets = action.payload;
    },
    updateActiveWalletLabel(state: IVaultState, action: PayloadAction<string>) {
      state.activeWallet.label = action.payload;
    },
    setLoadingTransactions(state: IVaultState, action: PayloadAction<boolean>) {
      if (!state.activeAsset) return;

      state.activeAsset.loading = action.payload;
    },
    updateTransactions(
      state: IVaultState,
      action: PayloadAction<{ txs: Transaction[] }>
    ) {
      state.activeAsset.transactions = action.payload.txs;
    },
    updateRewards(state: IVaultState, action: PayloadAction<{ txs: Reward[] }>) {
      state.activeAsset.rewards = action.payload.txs;
    },
    updateActions(state: IVaultState, action: PayloadAction<{ txs: ActionV2[] }>) {
      state.activeAsset.actions = action.payload.txs;
    },
    resetBalances(state: IVaultState) {
      state.balances = {};
    },
    updateBalances(
      state: IVaultState,
      action: PayloadAction<{ [assetKey: string]: string }>
    ) {
      for (const key in action.payload) {
        state.balances[key] = action.payload[key];
      }
    },
    addActiveWalletAsset(state: IVaultState, action: PayloadAction<IAssetState>) {
      const updatedAssets = upsertById(state.activeWallet.assets, action.payload);
      state.activeWallet.assets = updatedAssets;
    },
    removeActiveWalletAsset(state: IVaultState, action: PayloadAction<IAssetState>) {
      state.activeWallet.assets = state.activeWallet.assets.filter(
        (asset) => asset.id !== action.payload.id
      );
    },
    migrateWalletComplete(state: IVaultState) {
      delete state.migrateWallet;
    },
    addCustomNetwork(
      state: IVaultState,
      action: PayloadAction<{ network: string; data: ICustomNetworkObject }>
    ) {
      const { network, data } = action.payload;

      if (network && data) {
        state.customNetworks[network as keyof ICustomNetworks] = {
          ...state.customNetworks[network as keyof ICustomNetworks],
          [data.id]: data,
        };
      }
    },
    addCustomAsset(state: IVaultState, action: PayloadAction<IAssetInfoState>) {
      const updatedCustomAssets = upsertById(state.customAssets, action.payload);
      state.customAssets = updatedCustomAssets;
    },
    removeCustomAsset(state: IVaultState, action: PayloadAction<IAssetInfoState>) {
      state.customAssets = state.customAssets.filter(
        (asset) => asset.id !== action.payload.id
      );
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
  addCypherockWallet,
  updateWallets,
  rehydrate,
  setVaultInfo,
  updateStatus,
  changeActiveWallet,
  changeActiveNetwork,
  changeActiveAsset,
  changeCurrentEVMNetwork,
  updateWalletAssets,
  updateWalletLabel,
  updateActiveWalletLabel,
  updateTransactions,
  setLoadingTransactions,
  updateRewards,
  updateActions,
  resetBalances,
  updateBalances,
  addActiveWalletAsset,
  removeActiveWalletAsset,
  migrateWalletComplete,
  addCustomNetwork,
  addCustomAsset,
  removeCustomAsset,
  setPublicKey,
  removePublicKey,
} = VaultState.actions;

export default VaultState.reducer;
