import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IAuthState {
  isAuth: boolean;
  phrases: string[] | null;
}

const initialState: IAuthState = {
  phrases: null,
  isAuth: false,
};

// createSlice comes with immer produce so we don't need to take care of immutational update
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // authorization for new user
    authUser(state) {
      state.isAuth = true;
    },
    // set phrases with generated one
    setPhrases(state, action: PayloadAction<string[]>) {
      state.phrases = action.payload;
    },
  },
});

export const { authUser, setPhrases } = authSlice.actions;

export default authSlice.reducer;
