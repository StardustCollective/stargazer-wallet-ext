import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IDAppState, IDAppInfo } from './types';

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

      return {
        ...state,
        whitelist: {
          ...state.whitelist,
          [id]: {
            id,
            ...dapp,
          },
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
