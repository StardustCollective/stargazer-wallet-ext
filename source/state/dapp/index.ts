import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IDAppState, IDAppInfo, IDappAccounts } from './types';

const initialState: IDAppState = {};

// createSlice comes with immer produce so we don't need to take care of immutational update
const DAppState = createSlice({
  name: 'dapp',
  initialState,
  reducers: {
    listNewDapp(
      state: IDAppState,
      action: PayloadAction<{ id: string; dapp: IDAppInfo, network: string, accounts: IDappAccounts[] }>
    ) {
      return {
        ...state,
        [action.payload.id]: {...action.payload.dapp, accounts: {[action.payload.network]: action.payload.accounts}},
      };
    },
    unlistDapp(state: IDAppState, action: PayloadAction<{ id: string }>) {
      delete state[action.payload.id];
    },
  },
});

export const { listNewDapp, unlistDapp } = DAppState.actions;

export default DAppState.reducer;
