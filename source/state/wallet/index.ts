import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WalletStatus } from './consts';

import IWalletState, { Keystore } from './types';

const initialState: IWalletState = {
  keystore: null,
  status: WalletStatus.NONE,
};

// createSlice comes with immer produce so we don't need to take care of immutational update
const WalletState = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setKeystoreInfo(state: IWalletState, action: PayloadAction<Keystore>) {
      state.keystore = action.payload;
    },
    updateStatus(state: IWalletState, action: PayloadAction<WalletStatus>) {
      state.status = action.payload;
    },
  },
});

export const { setKeystoreInfo, updateStatus } = WalletState.actions;

export default WalletState.reducer;
