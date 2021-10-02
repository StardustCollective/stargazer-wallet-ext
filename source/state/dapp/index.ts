import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IDAppState, IDAppInfo } from './types';

const initialState: IDAppState = {
  listening: [],
  whitelist: {}
};

// createSlice comes with immer produce so we don't need to take care of immutational update
const DAppState = createSlice({
  name: 'dapp',
  initialState,
  reducers: {
    registerListeningSite(
      state: IDAppState,
      action: PayloadAction<{ origin: string }>
    ) {
      return {
        ...state,
        listening: [
          ...state.listening, 
          action.payload.origin],
      };
    },
    listNewDapp(
      state: IDAppState,
      action: PayloadAction<{
        id: string;
        dapp: IDAppInfo;
        network: string;
        accounts: string[];
      }>
    ) {
      return {
        ...state,
        whitelist: {
          ...state.whitelist,
          [action.payload.id]: {
            ...action.payload.dapp,
            accounts: {
              [action.payload.network]:[
                ...action.payload.accounts
              ]
            }
          },
        },
      };
    },
    unlistDapp(state: IDAppState, action: PayloadAction<{ id: string }>) {
      delete state.whitelist[action.payload.id];
    },

  },
});

export const { listNewDapp, unlistDapp, registerListeningSite } = DAppState.actions;

export default DAppState.reducer;
