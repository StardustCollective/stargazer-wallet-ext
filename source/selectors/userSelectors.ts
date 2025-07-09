import type { ElPacaStreakData } from 'state/user/types';
import type { RootState } from 'state/store';

const getElpacaHidden = (state: RootState): boolean => state.user.elpaca.hidden;
const getElpacaStreak = (state: RootState): ElPacaStreakData | null =>
  state.user?.elpaca?.streak?.data ?? null;

export default {
  getElpacaHidden,
  getElpacaStreak,
};
