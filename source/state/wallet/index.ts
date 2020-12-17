import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import IWalletState, { Keystore } from './types';

const initialState: IWalletState = {
  keystore: null,
};

// createSlice comes with immer produce so we don't need to take care of immutational update
const WalletState = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setKeystoreInfo(state: IWalletState, action: PayloadAction<Keystore>) {
      state.keystore = action.payload;
    },
  },
});

export const { setKeystoreInfo } = WalletState.actions;

export default WalletState.reducer;
