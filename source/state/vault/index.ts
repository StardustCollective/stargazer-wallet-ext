import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import localStorage from 'utils/localStorage';
import {
  AVALANCHE_NETWORK,
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

const initialState: IVaultState = {
  status: 0,
  wallets: {
    local: [],
    ledger: [],
    bitfi: [],
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
  },
  activeWallet: undefined,
  activeAsset: undefined,
  activeNetwork: {
    // 349: New network should be added here.
    [KeyringNetwork.Constellation]: DAG_NETWORK.main2.id,
    [KeyringNetwork.Ethereum]: ETH_NETWORK.mainnet.id,
    Avalanche: AVALANCHE_NETWORK['avalanche-mainnet'].id,
    BSC: BSC_NETWORK.bsc.id,
    Polygon: POLYGON_NETWORK.matic.id,
  },
  currentEVMNetwork: ETH_NETWORK.mainnet.id,
  customNetworks: {
    constellation: {},
    ethereum: {},
  },
  customAssets: [],
  version: '5.0.0',
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
      const isLedger =
        action.payload.wallet.type === KeyringWalletType.LedgerAccountWallet;
      const wallets = isLedger ? state.wallets.ledger : state.wallets.bitfi;
      const index = findIndex(wallets, (w) => w.id === action.payload.wallet.id);
      wallets[index].label = action.payload.label;
    },
    changeActiveWallet(state: IVaultState, action: PayloadAction<IWalletState>) {
      state.activeWallet = action.payload;
      if (state.activeWallet) {
        if (state.activeAsset) {
          state.activeAsset = {
            transactions: [],
            rewards: [],
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
      state.activeAsset = { transactions: [], rewards: [], ...action.payload };
    },
    updateWalletAssets(state: IVaultState, action: PayloadAction<IAssetState[]>) {
      state.activeWallet.assets = action.payload;
    },
    updateActiveWalletLabel(state: IVaultState, action: PayloadAction<string>) {
      state.activeWallet.label = action.payload;
    },
    setLoadingTransactions(state: IVaultState, action: PayloadAction<boolean>) {
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
    updateBalances(
      state: IVaultState,
      action: PayloadAction<{ [assetKey: string]: string }>
    ) {
      state.balances = {
        ...state.balances,
        ...action.payload,
      };
    },
    addActiveWalletAsset(state: IVaultState, action: PayloadAction<IAssetState>) {
      state.activeWallet.assets = state.activeWallet.assets.concat([action.payload]);
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
      state.customAssets.push(action.payload);
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
