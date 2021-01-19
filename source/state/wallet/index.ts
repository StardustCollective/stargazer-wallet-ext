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
  },
});

export const {
  setKeystoreInfo,
  updateStatus,
  createAccount,
} = WalletState.actions;

export default WalletState.reducer;
