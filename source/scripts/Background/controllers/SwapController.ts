import store from 'state/store';
import {
  getCurrencyData,
  getSupportedAssets,
  getCurrencyRate,
  getTransactionHistory,
  stageTransaction
} from 'state/swap/api';
import { setSelectedTransaction, setSwapFrom, setSwapTo, clearPendingSwap, addTxId } from 'state/swap';
import { ISearchCurrency, ICurrencyNetwork, IStageTransaction, IExolixTransaction } from 'state/swap/types';

interface ICurrencyRateParams {
  coinFromCode: string,
  coinToCode: string,
  amount: number
}

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
  addTxId: (txId: string) => void;
}

class SwapController implements ISwapController {

  setSwapFrom(currency: ISearchCurrency, network: ICurrencyNetwork) {
    store.dispatch(setSwapFrom({ currency, network }));
  }

  setSwapTo(currency: ISearchCurrency, network: ICurrencyNetwork) {
    store.dispatch(setSwapTo({ currency, network }));
  }

  setSelectedTrasaction(transaction: IExolixTransaction){
    store.dispatch(setSelectedTransaction(transaction));
  }

  clearPendingSwap(){
    store.dispatch(clearPendingSwap());
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

  getCurrencyRate({ coinFromCode, coinToCode, amount }: ICurrencyRateParams) {
    store.dispatch<any>(getCurrencyRate({
      coinFrom: coinFromCode,
      coinTo: coinToCode,
      amount: amount,
    }));
  }

  stageTransaction(params: IStageTransaction) {
    store.dispatch<any>(stageTransaction({
      coinFrom: params.coinFrom,
      networkFrom: params.networkFrom,
      coinTo: params.coinTo,
      networkTo: params.networkTo,
      amount: params.amount,  
      withdrawalAddress: params.withdrawalAddress,
      refundAddress: params.withdrawalAddress
    }));
  }

  addTxId(txId: string){
    store.dispatch<any>(addTxId(txId));
  }

}

export default SwapController;