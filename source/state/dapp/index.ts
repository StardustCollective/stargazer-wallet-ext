import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IDAppState, IDAppInfo } from './types';

const initialState: IDAppState = {
  whitelist: {},
};

// createSlice comes with immer produce so we don't need to take care of immutational update
const DAppState = createSlice({
  name: 'dapp',
  initialState,
  reducers: {
    rehydrate(
      state: IDAppState,
      action: PayloadAction<{ origin: string; eventName: string }>
    ) {
      return {
        ...state,
        ...action.payload,
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
      const { dapp, network, accounts } = action.payload;

      const id = action.payload.id;

      // Append to accounts if a network already exists
      let accountsByNetwork = {};
      if (state.whitelist[id]) {
        accountsByNetwork = {
          ...state.whitelist[id].accounts,
        };
      }

      return {
        ...state,
        whitelist: {
          ...state.whitelist,
          [id]: {
            id,
            ...dapp,
            accounts: {
              ...accountsByNetwork,
              [network]: [...accounts],
            },
          },
        },
      };
    },
    unlistDapp(state: IDAppState, action: PayloadAction<{ id: string }>) {
      delete state.whitelist[action.payload.id];
    },
  },
});

export const {
  listNewDapp,
  unlistDapp,
  rehydrate,
} = DAppState.actions;

export default DAppState.reducer;
