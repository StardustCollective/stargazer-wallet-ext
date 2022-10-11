import store from 'state/store';
import {
  getCurrencyData,
  getSupportedAssets,
  getCurrencyRate,
  stageTransaction
} from 'state/swap/api';
import { setSwapFrom, setSwapTo, clearPendingSwap, addTxId } from 'state/swap';
import { ISearchCurrency, ICurrencyNetwork, IStageTransaction } from 'state/swap/types';

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
  getCurrencyRate: (params: ICurrencyRateParams) => void;
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

  clearPendingSwap(){
    store.dispatch(clearPendingSwap());
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
      coinTo: params.coinTo,
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