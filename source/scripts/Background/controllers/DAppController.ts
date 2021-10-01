import { listNewDapp, unlistDapp } from 'state/dapp';
import { IDAppInfo, IDAppState, IDappAccounts } from 'state/dapp/types';
import store from 'state/store';


export interface IDAppController {
  getCurrent: () => IDAppInfo;
  fromUserConnectDApp: (origin: string, dapp: IDAppInfo, network: string, accounts: IDappAccounts[]) => void;
  fromUseDisconnectDApp: (origin: string) => void;
  fromPageConnectDApp: (origin: string, title: string) => boolean;
  setSigRequest: (req: ISigRequest) => void;
  getSigRequest: () => ISigRequest;
}

interface ISigRequest {
  address: string;
  message: string;
  origin: string;
}

const DAppController = (): IDAppController => {
  let current: IDAppInfo = { origin: '', logo: '', title: '' };
  let request: ISigRequest;

  const fromPageConnectDApp = (origin: string, title: string) => {
    const dapp: IDAppState = store.getState().dapp;

    current = {
      origin,
      logo: `chrome://favicon/size/64@1x/${origin}`,
      title
    }

    return !!dapp[origin];
  }

  const fromUserConnectDApp = (
    origin: string, 
    dapp: IDAppInfo, 
    network: string, 
    accounts: IDappAccounts[]) => {
    store.dispatch(listNewDapp({ id: origin, dapp, network, accounts }));
  };

  const fromUseDisconnectDApp = (origin: string) => {
    store.dispatch(unlistDapp({ id: origin }));
  }

  const getCurrent = () => {
    return current;
  };

  const setSigRequest = (req: ISigRequest) => {
    request = req;
  };

  const getSigRequest = () => {
    return request;
  };


  return { 
    getCurrent, 
    fromPageConnectDApp, 
    fromUserConnectDApp, 
    setSigRequest, 
    getSigRequest,
    fromUseDisconnectDApp
  };
};

export default DAppController;
