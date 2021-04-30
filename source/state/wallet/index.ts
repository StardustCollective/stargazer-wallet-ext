import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Transaction } from '@stardust-collective/dag4-network';

import { DAG_NETWORK, ETH_NETWORK, ETH_PREFIX } from 'constants/index';

import IWalletState, {
  IAccountUpdateState,
  IAccountState,
  Keystore,
  AccountType,
  AssetType,
  IAssetState,
  NetworkType,
} from './types';

const initialState: IWalletState = {
  keystores: {},
  status: 0,
  accounts: {},
  activeAccountId: '',
  activeNetwork: {
    [AssetType.Constellation]: DAG_NETWORK.main.id,
    [AssetType.Ethereum]: ETH_NETWORK.mainnet.id,
  },
  version: '2.1.0',
};

// createSlice comes with immer produce so we don't need to take care of immutational update
const WalletState = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setKeystoreInfo(
      state: IWalletState,
      action: PayloadAction<{ keystore: Keystore; networkType: NetworkType }>
    ) {
      const id = `${
        action.payload.networkType === NetworkType.Ethereum ? ETH_PREFIX : ''
      }${action.payload.keystore.id}`;

      state.keystores = {
        ...state.keystores,
        [id]: action.payload.keystore,
      };
    },
    removeKeystoreInfo(state: IWalletState, action: PayloadAction<string>) {
      if (state.keystores[action.payload])
        delete state.keystores[action.payload];
    },
    updateStatus(state: IWalletState) {
      state.status = Date.now();
    },
    createAccount(state: IWalletState, action: PayloadAction<IAccountState>) {
      return {
        ...state,
        accounts: {
          ...state.accounts,
          [action.payload.id]: action.payload,
        },
        activeAccountId: action.payload.id,
      };
    },
    removeAccount(state: IWalletState, action: PayloadAction<string>) {
      if (
        Object.values(state.accounts).filter(
          (account) => account.type === AccountType.Seed
        ).length <= 1
      )
        return;
      if (state.activeAccountId === action.payload) {
        state.activeAccountId = Object.keys(state.accounts)[0];
      }
      delete state.accounts[action.payload];
    },
    removeSeedAccounts(state: IWalletState) {
      Object.values(state.accounts).forEach((account) => {
        if (account.type === AccountType.Seed)
          delete state.accounts[account.id];
      });
      state.activeAccountId = '';
    },
    updateAccount(
      state: IWalletState,
      action: PayloadAction<IAccountUpdateState>
    ) {
      state.accounts[action.payload.id] = {
        ...state.accounts[action.payload.id],
        ...action.payload,
      };
    },
    deleteWallet(state: IWalletState) {
      state.keystores = {};
      state.accounts = {};
      state.activeAccountId = '0';
      state.activeNetwork = {
        [AssetType.Constellation]: DAG_NETWORK.main.id,
        [AssetType.Ethereum]: ETH_NETWORK.main.id,
      };
    },
    changeAccountActiveId(state: IWalletState, action: PayloadAction<string>) {
      state.activeAccountId = action.payload;
    },
    changeActiveNetwork(
      state: IWalletState,
      action: PayloadAction<{ asset: string; network: string }>
    ) {
      state.activeNetwork = {
        ...state.activeNetwork,
        [action.payload.asset]: action.payload.network,
      };
    },
    changeActiveAsset(
      state: IWalletState,
      action: PayloadAction<{
        id: string;
        assetId: string;
      }>
    ) {
      state.accounts[action.payload.id].activeAssetId = action.payload.assetId;
    },
    updateTransactions(
      state: IWalletState,
      action: PayloadAction<{
        id: string;
        assetId: string;
        txs: Transaction[] | any;
      }>
    ) {
      state.accounts[action.payload.id].assets[
        action.payload.assetId
      ].transactions = action.payload.txs;
    },
    updateLabel(
      state: IWalletState,
      action: PayloadAction<{ id: string; label: string }>
    ) {
      state.accounts[action.payload.id].label = action.payload.label;
    },
    addAsset(
      state: IWalletState,
      action: PayloadAction<{ id: string; asset: IAssetState }>
    ) {
      state.accounts[action.payload.id].assets = {
        ...state.accounts[action.payload.id].assets,
        [action.payload.asset.id]: action.payload.asset,
      };
      state.accounts[action.payload.id].activeAssetId = action.payload.asset.id;
    },
  },
});

export const {
  setKeystoreInfo,
  removeKeystoreInfo,
  updateStatus,
  createAccount,
  removeAccount,
  removeSeedAccounts,
  deleteWallet,
  changeAccountActiveId,
  changeActiveNetwork,
  changeActiveAsset,
  updateAccount,
  updateTransactions,
  updateLabel,
  addAsset,
} = WalletState.actions;

export default WalletState.reducer;
