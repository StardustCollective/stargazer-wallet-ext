import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IAuthState {
  isAuth: boolean;
  isLogged: boolean;
  password: string | null;
  phrases: string[] | null;
}

const initialState: IAuthState = {
  phrases: null,
  password: null,
  isAuth: false,
  isLogged: false,
};

// createSlice comes with immer produce so we don't need to take care of immutational update
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // initialize state
    initState(state) {
      state.phrases = null;
      state.password = null;
      state.isAuth = false;
    },
    // log-in
    loginUser(state) {
      state.isLogged = true;
    },
    // log-out
    logoutUser(state) {
      state.isLogged = false;
    },
    // authorization for new user
    authUser(state) {
      state.isAuth = true;
    },
    // unauthorization for new user
    unauthUser(state) {
      state.isAuth = false;
      state.phrases = null;
    },
    // set phrases with generated one
    setPhrases(state, action: PayloadAction<string[]>) {
      state.phrases = action.payload;
    },
    // set password
    setPassword(state, action: PayloadAction<string>) {
      state.password = action.payload;
    },
  },
});

export const {
  initState,
  loginUser,
  logoutUser,
  authUser,
  unauthUser,
  setPhrases,
  setPassword,
} = authSlice.actions;

export default authSlice.reducer;
