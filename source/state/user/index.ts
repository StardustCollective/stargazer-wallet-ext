import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUserState } from './types';
import { getElPacaInfo } from './api';

const initialState: IUserState = {
  elpaca: {
    hidden: false,
    streak: {
      loading: false,
      data: null,
      error: null,
    },
    claim: {
      loading: false,
      data: null,
      error: null,
    },
  },
};

const UserState = createSlice({
  name: 'user',
  initialState,
  reducers: {
    rehydrate(state: IUserState, action: PayloadAction<IUserState>) {
      // claim and hidden are the only values presisted for the elpaca state.
      if (!action?.payload?.elpaca?.claim) return;
      if (action?.payload?.elpaca?.hidden === undefined) return;

      return {
        elpaca: {
          ...state.elpaca,
          hidden: action.payload.elpaca.hidden,
          claim: {
            ...state.elpaca.claim,
            data: action.payload.elpaca.claim.data,
          },
        },
      };
    },
    setElpacaHidden(state: IUserState, action: PayloadAction<boolean>) {
      state.elpaca.hidden = action.payload;
    },
    clearClaim(state: IUserState) {
      state.elpaca.claim = initialState.elpaca.claim;
    },
    clearClaimHash(state: IUserState) {
      if (state?.elpaca?.claim?.data?.hash) {
        delete state.elpaca.claim.data.hash;
      }
    },
    clearClaimAddress(state: IUserState) {
      delete state.elpaca.claim.data.address;
    },
    clearStreak(state: IUserState) {
      state.elpaca.streak = initialState.elpaca.streak;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getElPacaInfo.pending, (state) => {
      state.elpaca.streak.loading = true;
    });
    builder.addCase(getElPacaInfo.fulfilled, (state, action) => {
      const error = !action.payload?.success ? action.payload.response : null;
      const data = action?.payload?.success ? action.payload.response : null;

      state.elpaca.streak.loading = false;
      state.elpaca.streak.data = data;
      state.elpaca.streak.error = error;
    });
    builder.addCase(getElPacaInfo.rejected, (state, action) => {
      state.elpaca.streak.loading = false;
      state.elpaca.streak.data = null;
      state.elpaca.streak.error = action.payload;
    });
  },
});

export const {
  rehydrate,
  setElpacaHidden,
  clearClaim,
  clearClaimHash,
  clearClaimAddress,
  clearStreak,
} = UserState.actions;

export default UserState.reducer;
