import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IBiometricsState } from './types';

const initialState: IBiometricsState = {
  available: false,
  enabled: false,
  biometryType: null,
  autoLogin: true,
  initialCheck: true,
};

const BiometricsState = createSlice({
  name: 'biometrics',
  initialState,
  reducers: {
    rehydrate(state: IBiometricsState, action: PayloadAction<IBiometricsState>) {
      return {
        ...state,
        ...action.payload,
      };
    },
    setBiometryAvailable(state: IBiometricsState, action: PayloadAction<boolean>) {
      state.available = action.payload;
    },
    setBiometryEnabled(state: IBiometricsState, action: PayloadAction<boolean>) {
      state.enabled = action.payload;
    },
    setBiometryType(state: IBiometricsState, action: PayloadAction<string>) {
      state.biometryType = action.payload;
    },
    setAutoLogin(state: IBiometricsState, action: PayloadAction<boolean>) {
      state.autoLogin = action.payload;
    },
    setInitialCheck(state: IBiometricsState, action: PayloadAction<boolean>) {
      state.initialCheck = action.payload;
    },
    resetBiometrics(state: IBiometricsState) {
      state.available = false;
      state.enabled = false;
      state.autoLogin = true;
      state.initialCheck = true;
      state.biometryType = null;
    },
  },
});

export const {
  rehydrate,
  setBiometryAvailable,
  setBiometryEnabled,
  setBiometryType,
  setAutoLogin,
  setInitialCheck,
  resetBiometrics,
} = BiometricsState.actions;

export default BiometricsState.reducer;
