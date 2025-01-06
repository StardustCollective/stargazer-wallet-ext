import { RootState } from 'state/store';

/**
 * Returns loading balances states
 */
const getLoadingBalances = (state: RootState): boolean =>
  state.flags.loadingDAGBalances || state.flags.loadingETHBalances;
const getLoadingDAGBalances = (state: RootState): boolean =>
  state.flags.loadingDAGBalances;
const getLoadingETHBalances = (state: RootState): boolean =>
  state.flags.loadingETHBalances;

export default {
  getLoadingBalances,
  getLoadingDAGBalances,
  getLoadingETHBalances,
};
