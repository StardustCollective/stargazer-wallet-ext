import { createAsyncThunk } from '@reduxjs/toolkit';
import { GET_ELPACA_API, POST_ELPACA_API } from 'constants/index';
import { ClaimElpacaBody, ClaimElpacaData, ElPacaStreakData } from './types';
import subSeconds from 'date-fns/subSeconds';
import addDays from 'date-fns/addDays';
import differenceInMinutes from 'date-fns/differenceInMinutes';
import store from 'state/store';
import { getDagAddress } from 'utils/wallet';
import { decodeFromBase64 } from 'utils/encoding';
import { ELPACA_KEY } from 'utils/envUtil';

const mapElpacaInfo = (
  {
    claimAmount,
    currentEpochProgress,
    currentStreak,
    lastClaimEpochProgress,
    nextToken,
    totalEarned,
  }: ElPacaStreakData,
  address: string,
  thunkAPI: any
) => {
  const secondsSinceLastClaim = (currentEpochProgress - lastClaimEpochProgress) * 43;
  const lastClaimDate = subSeconds(Date.now(), secondsSinceLastClaim);
  const nextClaimDate = addDays(lastClaimDate, 1);
  const refreshStreakDate = addDays(lastClaimDate, 2);
  const diffInMinutesRefresh = differenceInMinutes(refreshStreakDate, Date.now());
  const diffInMinutes = differenceInMinutes(nextClaimDate, Date.now());
  let currentClaimWindow = '0h 0m';
  let currentRefreshWindow = '0h 0m';

  if (diffInMinutes > 0) {
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = (diffInMinutes % 60).toString().padStart(2, '0');
    currentClaimWindow = `${hours}h ${minutes}m`;
  }

  if (diffInMinutesRefresh > 0) {
    const hours = Math.floor(diffInMinutesRefresh / 60);
    const minutes = (diffInMinutesRefresh % 60).toString().padStart(2, '0');
    currentRefreshWindow = `${hours}h ${minutes}m`;
  }

  const claimEnabled = currentClaimWindow === '0h 0m';
  const { activeWallet } = store.getState().vault;
  const walletAddress = getDagAddress(activeWallet);
  const showError = walletAddress !== address && !claimEnabled;
  const refreshPacaInfo = walletAddress !== address && claimEnabled;
  const shouldReset = diffInMinutesRefresh <= 0;
  const streak = shouldReset ? 0 : currentStreak;
  const amount = shouldReset ? 1 : claimAmount / 1e8;
  const claimWindow = claimEnabled ? currentRefreshWindow : currentClaimWindow;

  if (refreshPacaInfo) {
    thunkAPI.dispatch(getElPacaInfo(walletAddress));
  }

  return {
    totalEarned: totalEarned / 1e8,
    claimAmount: amount,
    currentEpochProgress,
    lastClaimEpochProgress,
    currentStreak: streak,
    nextToken,
    currentClaimWindow: claimWindow,
    claimEnabled,
    showError,
  };
};

export const getElPacaInfo = createAsyncThunk(
  'user/getElPacaInfo',
  async (address: string, thunkAPI): Promise<ElPacaStreakData | any> => {
    const response = await fetch(`${GET_ELPACA_API}/${address}`);
    const responseJson = await response.json();

    if (!!responseJson.claimAmount) {
      return mapElpacaInfo(responseJson, address, thunkAPI);
    }

    return responseJson;
  }
);

export const claimElpaca = createAsyncThunk(
  'user/claimElpaca',
  async ({
    address,
    signature,
    token = '',
  }: ClaimElpacaData): Promise<ClaimElpacaData | any> => {
    const PUBLIC_ID = decodeFromBase64(ELPACA_KEY);
    const body: ClaimElpacaBody = {
      value: {
        StreakUpdate: {
          address,
          token,
        },
      },
      proofs: [
        {
          id: PUBLIC_ID,
          signature,
        },
      ],
    };
    const response = await fetch(POST_ELPACA_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const responseJson = await response.json();

    return {
      ...responseJson,
      address,
    };
  }
);
