import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import IProcessState from './types';
import ProcessStates from './enums';

const initialState: IProcessState = {
  login: ProcessStates.IDLE,
  fetchDagBalance: ProcessStates.IDLE
};


const ProcessState = createSlice({
  name: 'process',
  initialState,
  reducers: {
    updateLoginState(
      state: IProcessState,
      action: PayloadAction<{ processState: ProcessStates; }>
    ) {
      return {
        ...state,
        login: action.payload.processState,
      }
    },
    updatefetchDagBalanceState(
      state: IProcessState,
      action: PayloadAction<{ processState: ProcessStates; }>
    ) {
      return {
        ...state,
        fetchDagBalance: action.payload.processState,
      }
    },
  },
});

export const { updateLoginState, updatefetchDagBalanceState } = ProcessState.actions;

export default ProcessState.reducer;
