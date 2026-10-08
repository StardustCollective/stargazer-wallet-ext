import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IDAppState, IDAppInfo } from './types';

const MAX_TITLE_LENGTH = 100;
const MAX_LOGO_LENGTH = 2048;

const initialState: IDAppState = {
  current: null,
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
    setCurrent(state: IDAppState, action: PayloadAction<IDAppInfo>) {
      state.current = action.payload;
    },
    removeCurrent(state: IDAppState) {
      state.current = null;
    },
    addDapp(
      state: IDAppState,
      action: PayloadAction<{
        id: string;
        dapp: IDAppInfo;
      }>
    ) {
      const { id, dapp } = action.payload;
      const title = typeof dapp?.title === 'string' ? dapp.title.slice(0, MAX_TITLE_LENGTH) : '';
      const logo = typeof dapp?.logo === 'string' && dapp.logo.length <= MAX_LOGO_LENGTH ? dapp.logo : '';

      return {
        ...state,
        whitelist: {
          ...state.whitelist,
          [id]: { id, origin: id, title, logo },
        },
      };
    },
    removeDapp(state: IDAppState, action: PayloadAction<{ id: string }>) {
      delete state.whitelist[action.payload.id];
    },
  },
});

export const { addDapp, removeDapp, setCurrent, removeCurrent, rehydrate } =
  DAppState.actions;

export default DAppState.reducer;
