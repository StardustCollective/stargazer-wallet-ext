import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { sanitizeLogo } from 'utils/dappLogo';

import { IDAppInfo, IDAppState } from './types';

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
    addDapp(
      state: IDAppState,
      action: PayloadAction<{
        id: string;
        dapp: IDAppInfo;
      }>
    ) {
      const { id, dapp } = action.payload;
      // The key is the request-bound origin; never let the payload override it.
      state.whitelist[id] = { id, origin: id, logo: sanitizeLogo(dapp?.logo) };
    },
    removeDapp(state: IDAppState, action: PayloadAction<{ id: string }>) {
      delete state.whitelist[action.payload.id];
    },
  },
});

export const { addDapp, removeDapp, rehydrate } = DAppState.actions;

export default DAppState.reducer;
