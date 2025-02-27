import { ElPacaClaimData, ElPacaStreakData, IElpacaState } from 'state/user/types';
import { RootState } from 'state/store';

const getElpaca = (state: RootState): IElpacaState => state.user.elpaca;
const getElpacaHidden = (state: RootState): boolean => state.user.elpaca.hidden;
const getElpacaClaim = (state: RootState): ElPacaClaimData | null =>
  state.user?.elpaca?.claim?.data ?? null;
const getElpacaClaimLoading = (state: RootState): boolean =>
  state.user.elpaca?.claim?.loading;
const getElpacaStreak = (state: RootState): ElPacaStreakData | null =>
  state.user?.elpaca?.streak?.data ?? null;
const getCurrentClaimWindow = (state: RootState): string | null =>
  state.user.elpaca?.streak?.data?.currentClaimWindow ?? null;

export default {
  getElpaca,
  getElpacaHidden,
  getElpacaClaim,
  getElpacaStreak,
  getElpacaClaimLoading,
  getCurrentClaimWindow,
};
