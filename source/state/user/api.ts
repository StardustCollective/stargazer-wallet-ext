import { createAsyncThunk } from '@reduxjs/toolkit';
import { GET_ELPACA_API } from 'constants/index';
import type { ElPacaStreakData, ElPacaStreakResponse } from './types';
import { toDag } from 'utils/number';

export const getElPacaInfo = createAsyncThunk(
  'user/getElPacaInfo',
  async (address: string): Promise<ElPacaStreakResponse> => {
    const response = await fetch(`${GET_ELPACA_API}/${address}`);
    const responseJson: ElPacaStreakData = await response.json();

    if (responseJson && 'totalEarned' in responseJson) {
      return {
        success: true,
        response: {
          totalEarned: toDag(responseJson.totalEarned),
        },
      };
    }

    return {
      success: false,
      response: responseJson,
    };
  }
);
