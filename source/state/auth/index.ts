import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IAuthState } from './types';

const initialState: IAuthState = {
  unlocked: false,
  loading: false,
};

const AuthState = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUnlocked(state: IAuthState, action: PayloadAction<boolean>) {
      state.unlocked = action.payload;
    },
    setLoading(state: IAuthState, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { setUnlocked, setLoading } = AuthState.actions;

export default AuthState.reducer;
