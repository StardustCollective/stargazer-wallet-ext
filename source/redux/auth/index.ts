import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IAuthState {
  phrases: string[] | null;
}

const initialState: IAuthState = {
  phrases: null,
};

// createSlice comes with immer produce so we don't need to take care of immutational update
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setPhrases(state, action: PayloadAction<string[]>) {
      state.phrases = action.payload;
    },
  },
});

export const { setPhrases } = authSlice.actions;

export default authSlice.reducer;
