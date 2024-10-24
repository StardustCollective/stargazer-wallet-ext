import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUserState } from './types';
import { claimElpaca, getElPacaInfo } from './api';

const initialState: IUserState = {
  elpaca: {
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
      // claim is the only object that is presisted for the elpaca state.
      if (!action?.payload?.elpaca?.claim) return;

      return {
        elpaca: {
          ...state.elpaca,
          claim: {
            ...state.elpaca.claim,
            data: action.payload.elpaca.claim.data,
          },
        },
      };
    },
    clearClaim(state: IUserState) {
      state.elpaca.claim = initialState.elpaca.claim;
    },
    clearClaimHash(state: IUserState) {
      delete state.elpaca.claim.data.hash;
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
      const error = action.payload?.message ? action.payload : null;
      const data = !!action?.payload?.claimAmount ? action.payload : null;
      const claimEnabled = !!action?.payload?.claimEnabled;

      if (claimEnabled) {
        state.elpaca.claim.data = null;
      }

      state.elpaca.streak.loading = false;
      state.elpaca.streak.data = data;
      state.elpaca.streak.error = error;
    });
    builder.addCase(getElPacaInfo.rejected, (state, action) => {
      state.elpaca.streak.loading = false;
      state.elpaca.streak.data = {
        currentStreak: 0,
        claimAmount: 1,
        totalEarned: 0,
        lastClaimEpochProgress: 0,
        currentEpochProgress: 0,
        nextToken: '',
        currentClaimWindow: '0h 0m',
        claimEnabled: true,
      };
      state.elpaca.streak.error = action.payload;
    });
    builder.addCase(claimElpaca.pending, (state) => {
      state.elpaca.claim.loading = true;
      state.elpaca.claim.data = null;
      state.elpaca.claim.error = null;
    });
    builder.addCase(claimElpaca.fulfilled, (state, action) => {
      const error = action.payload?.message ? action.payload : null;
      const data = !!action?.payload?.hash ? action.payload : null;
      state.elpaca.claim.loading = false;
      state.elpaca.claim.data = data;
      state.elpaca.claim.error = error;
    });
    builder.addCase(claimElpaca.rejected, (state, action) => {
      state.elpaca.claim.loading = false;
      state.elpaca.claim.data = null;
      state.elpaca.claim.error = action.payload;
    });
  },
});

export const { rehydrate, clearClaim, clearClaimHash, clearClaimAddress, clearStreak } =
  UserState.actions;

export default UserState.reducer;
