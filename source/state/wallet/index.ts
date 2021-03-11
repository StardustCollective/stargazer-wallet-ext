import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Transaction } from '@stardust-collective/dag4-network';

import { DAG_NETWORK, ETH_NETWORK } from 'constants/index';
import IWalletState, {
  IAccountUpdateState,
  IAccountState,
  Keystore,
  AccountType,
  AssetType,
} from './types';

const initialState: IWalletState = {
  keystores: {},
  status: 0,
  accounts: {},
  activeAccountId: '0',
  activeAsset: {
    id: AssetType.Constellation,
    type: AssetType.Constellation,
  },
  seedKeystoreId: '',
  activeNetwork: {
    [AssetType.Constellation]: DAG_NETWORK.main.id,
    [AssetType.Ethereum]: ETH_NETWORK.mainnet.id,
  },
};

// createSlice comes with immer produce so we don't need to take care of immutational update
const WalletState = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setKeystoreInfo(state: IWalletState, action: PayloadAction<Keystore>) {
      state.keystores = {
        ...state.keystores,
        [action.payload.id]: action.payload,
      };
    },
    removeKeystoreInfo(state: IWalletState, action: PayloadAction<string>) {
      if (state.keystores[action.payload])
        delete state.keystores[action.payload];
    },
    updateSeedKeystoreId(state: IWalletState, action: PayloadAction<string>) {
      if (state.keystores && state.keystores[state.seedKeystoreId]) {
        delete state.keystores[state.seedKeystoreId];
      }
      state.seedKeystoreId = action.payload;
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
      if (Object.keys(state.accounts).length <= 1) return;
      if (state.activeAccountId === action.payload) {
        state.activeAccountId = Object.values(state.accounts)[0].id;
      }
      delete state.accounts[action.payload];
    },
    removeSeedAccounts(state: IWalletState) {
      Object.values(state.accounts).forEach((account) => {
        if (account.type === AccountType.Seed)
          delete state.accounts[account.id];
      });
      state.activeAccountId = '0';
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
      state.seedKeystoreId = '';
      state.activeAccountId = '0';
      state.activeAsset = {
        id: AssetType.Constellation,
        type: AssetType.Constellation,
      };
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
        assetId: string;
      }>
    ) {
      state.activeAsset.id = action.payload.assetId;
    },
    updateTransactions(
      state: IWalletState,
      action: PayloadAction<{
        id: string;
        asset: string;
        txs: Transaction[] | any;
      }>
    ) {
      state.accounts[action.payload.id].transactions[
        action.payload.asset as AssetType
      ] = action.payload.txs;
    },
    updateLabel(
      state: IWalletState,
      action: PayloadAction<{ id: string; label: string }>
    ) {
      state.accounts[action.payload.id].label = action.payload.label;
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
  updateSeedKeystoreId,
  changeAccountActiveId,
  changeActiveNetwork,
  changeActiveAsset,
  updateAccount,
  updateTransactions,
  updateLabel,
} = WalletState.actions;

export default WalletState.reducer;
