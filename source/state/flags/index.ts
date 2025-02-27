import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IFlagsState } from './types';

const initialState: IFlagsState = {
  loadingDAGBalances: false,
  loadingETHBalances: false,
};

const FlagsState = createSlice({
  name: 'flags',
  initialState,
  reducers: {
    setLoadingDAGBalances(state: IFlagsState, action: PayloadAction<boolean>) {
      state.loadingDAGBalances = action.payload;
    },
    setLoadingETHBalances(state: IFlagsState, action: PayloadAction<boolean>) {
      state.loadingETHBalances = action.payload;
    },
  },
});

export const { setLoadingDAGBalances, setLoadingETHBalances } = FlagsState.actions;

export default FlagsState.reducer;
