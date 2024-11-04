import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IAuthState, ExternalData } from './types';

const initialState: IAuthState = {
  unlocked: false,
  loading: false,
  external: null,
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
    setExternalToken(state: IAuthState, action: PayloadAction<ExternalData>) {
      state.external = action.payload;
    },
  },
});

export const { setUnlocked, setLoading, setExternalToken } = AuthState.actions;

export default AuthState.reducer;
