import store from 'state/store';
import {
  getCurrencyData,
  getSupportedAssets,
  getCurrencyRate,
  getTransactionHistory,
  stageTransaction,
} from 'state/swap/api';
import {
  setSelectedTransaction,
  setSwapFrom,
  setSwapTo,
  clearPendingSwap,
  addTxId,
  clearCurrencyRate,
} from 'state/swap';
import {
  ISearchCurrency,
  ICurrencyNetwork,
  IStageTransaction,
  IExolixTransaction,
  ICurrencyRateParams,
} from 'state/swap/types';

export interface ISwapController {
  getSupportedAssets: () => void;
  getCurrencyData: (searchQuery: string) => void;
  setSwapFrom: (currency: ISearchCurrency, network: ICurrencyNetwork) => void;
  setSwapTo: (currency: ISearchCurrency, network: ICurrencyNetwork) => void;
  setSelectedTrasaction: (transaction: IExolixTransaction) => void;
  getCurrencyRate: (params: ICurrencyRateParams) => void;
  getTransactionHistory: () => void;
  stageTransaction: (params: IStageTransaction) => void;
  clearPendingSwap: () => void;
  clearCurrencyRate: () => void;
  addTxId: (txId: string) => void;
}

class SwapController implements ISwapController {
  setSwapFrom(currency: ISearchCurrency, network: ICurrencyNetwork) {
    store.dispatch(setSwapFrom({ currency, network }));
  }

  setSwapTo(currency: ISearchCurrency, network: ICurrencyNetwork) {
    store.dispatch(setSwapTo({ currency, network }));
  }

  setSelectedTrasaction(transaction: IExolixTransaction) {
    store.dispatch(setSelectedTransaction(transaction));
  }

  clearPendingSwap() {
    store.dispatch(clearPendingSwap());
  }

  clearCurrencyRate() {
    store.dispatch(clearCurrencyRate());
  }

  getTransactionHistory() {
    store.dispatch<any>(getTransactionHistory());
  }

  getSupportedAssets() {
    store.dispatch<any>(getSupportedAssets());
  }

  getCurrencyData(searchQuery: string) {
    store.dispatch<any>(getCurrencyData(searchQuery));
  }

  getCurrencyRate({
    coinFromCode,
    coinFromNetwork,
    coinToCode,
    coinToNetwork,
    amount,
  }: ICurrencyRateParams) {
    store.dispatch<any>(
      getCurrencyRate({
        coinFrom: coinFromCode,
        coinFromNetwork: coinFromNetwork,
        coinTo: coinToCode,
        coinToNetwork: coinToNetwork,
        amount: amount,
      })
    );
  }

  stageTransaction(params: IStageTransaction) {
    store.dispatch<any>(
      stageTransaction({
        coinFrom: params.coinFrom,
        networkFrom: params.networkFrom,
        coinTo: params.coinTo,
        networkTo: params.networkTo,
        amount: params.amount,
        withdrawalAddress: params.withdrawalAddress,
        refundAddress: params.withdrawalAddress,
      })
    );
  }

  addTxId(txId: string) {
    store.dispatch<any>(addTxId(txId));
  }
}

export default SwapController;
