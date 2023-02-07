import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IBiometricsState } from './types';

const initialState: IBiometricsState = {
  available: false,
  enabled: false,
  biometryType: null,
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
    resetBiometrics(state: IBiometricsState) {
      state.available = false;
      state.enabled = false;
      state.biometryType = null;
    },
  },
});

export const { 
  rehydrate,
  setBiometryAvailable,
  setBiometryEnabled,
  setBiometryType,
  resetBiometrics,
} = BiometricsState.actions;

export default BiometricsState.reducer;
