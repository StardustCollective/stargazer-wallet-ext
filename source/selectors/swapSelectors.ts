/**
 * Handles derived data for swap state.
 */

/////////////////////////
// Modules
/////////////////////////

import { createSelector } from '@reduxjs/toolkit';

/////////////////////////
// Types
/////////////////////////

import { RootState } from 'state/store';
import { ISearchCurrency } from 'state/swap/types';

/////////////////////////
// Enums
/////////////////////////

import { SupportedExolixSwapNetworks } from 'state/swap/types';

/**
 * Returns the unfiltered currency currency data.
 */
const getCurrencyData = (state: RootState): ISearchCurrency[] => state.swap.currencyData;

/**
 * Returns supported asset with balances.
 */
const getSupportedAssets = (state: RootState) => state.swap.supportedAssets;

/**
 * Returns the currency rate for a trading pair.
 */
const getCurrencyRate = (state: RootState) => state.swap.currencyRate.rate;

/**
 * Return the transaction history.
 */
const getTransactionHistory = (state: RootState) => state.swap.transactionHistory;

/**
 * Returns the loading state for the currency rate.
 */
const getCurrencyRateLoading = (state: RootState) => state.swap.currencyRate.loading;

/**
 * Returns currency pending swap
 */
const getPendingSwap = (state: RootState) => state.swap.pendingSwap;

/**
 * Returns the filtered currency data by supported network
 */

const selectSupportedCurrencyData = (excludeDag: boolean = false) => {
  return createSelector(
    getCurrencyData,
    (currencyData: ISearchCurrency[]): ISearchCurrency[] => {
      const currencyDataReduced = currencyData?.map((currency) => {
        let networks = currency?.networks?.filter((network) => {
          return (
            network.network === SupportedExolixSwapNetworks.AVALANCHE ||
            network.network === SupportedExolixSwapNetworks.BINANCE_SMART_CHAIN ||
            network.network === SupportedExolixSwapNetworks.ETHEREUM ||
            network.network === SupportedExolixSwapNetworks.POLYGON ||
            (!excludeDag && network.network === SupportedExolixSwapNetworks.CONSTELLATION)
          );
        });

        return {
          code: currency.code,
          name: currency.name,
          icon: currency.icon,
          networks,
        };
      });

      // Return only the currencies with supported networks.
      return currencyDataReduced?.filter(
        (currency) => currency?.networks?.length > 0
      ) as ISearchCurrency[];
    }
  );
};

export default {
  getPendingSwap,
  getSupportedAssets,
  getCurrencyRate,
  getCurrencyRateLoading,
  getTransactionHistory,
  selectSupportedCurrencyData,
};
