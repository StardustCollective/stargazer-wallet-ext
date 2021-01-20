import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import IWalletState, { IAccountState, Keystore } from './types';

const initialState: IWalletState = {
  keystore: null,
  status: 0,
  accounts: {},
  activeIndex: 0,
};

// createSlice comes with immer produce so we don't need to take care of immutational update
const WalletState = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setKeystoreInfo(state: IWalletState, action: PayloadAction<Keystore>) {
      state.keystore = action.payload;
    },
    updateStatus(state: IWalletState) {
      state.status = Date.now();
    },
    createAccount(state: IWalletState, action: PayloadAction<IAccountState>) {
      return {
        ...state,
        accounts: {
          ...state.accounts,
          [action.payload.index]: action.payload,
        },
        activeIndex: action.payload.index,
      };
    },
    removeAccount(state: IWalletState, action: PayloadAction<number>) {
      if (Object.keys(state.accounts).length <= 1) return;
      if (state.activeIndex === action.payload) {
        state.activeIndex = Object.values(state.accounts)[0].index;
      }
      delete state.accounts[action.payload];
    },
    deleteWallet(state: IWalletState) {
      state.keystore = null;
      state.accounts = {};
      state.activeIndex = 0;
    },
    changeActiveIndex(state: IWalletState, action: PayloadAction<number>) {
      state.activeIndex = action.payload;
    },
  },
});

export const {
  setKeystoreInfo,
  updateStatus,
  createAccount,
  removeAccount,
  deleteWallet,
  changeActiveIndex,
} = WalletState.actions;

export default WalletState.reducer;
