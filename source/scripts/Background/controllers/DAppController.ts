import { listNewDapp, unlistDapp, registerListeningSite as registerListeningSiteAction, deregisterListeningSite as deregisterListeningSiteAction } from 'state/dapp';
import { IDAppInfo, IDAppState } from 'state/dapp/types';
import store from 'state/store';


export interface IDAppController {
  getCurrent: () => IDAppInfo;
  fromUserConnectDApp: (origin: string, dapp: IDAppInfo, network: string, accounts: string[]) => void;
  fromUseDisconnectDApp: (origin: string) => void;
  fromPageConnectDApp: (origin: string, title: string) => boolean;
  setSigRequest: (req: ISigRequest) => void;
  getSigRequest: () => ISigRequest;
  registerListeningSite: (origin: string, eventName: string) => void;
  deregisterListeningSite: (origin: string, eventName: string) => void;
  isSiteListening: (origin: string, eventName: string) => boolean;
  isDAppConnected: (origin: string) => boolean
}

interface ISigRequest {
  address: string;
  message: string;
  origin: string;
}

const DAppController = (): IDAppController => {
  let current: IDAppInfo = { origin: '', logo: '', title: '' };
  let request: ISigRequest;

  const isDAppConnected = (origin: string) => {
    const dapp: IDAppState = store.getState().dapp;

    return !!dapp.whitelist[origin as keyof IDAppState];
  }

  const fromPageConnectDApp = (origin: string, title: string) => {
    current = {
      origin,
      logo: `chrome://favicon/size/64@1x/${origin}`,
      title
    }

    return isDAppConnected(origin);
  }

  const fromUserConnectDApp = (
    origin: string,
    dapp: IDAppInfo,
    network: string,
    accounts: string[]) => {
    store.dispatch(listNewDapp({ id: origin, dapp, network, accounts }));
  };

  const fromUseDisconnectDApp = (origin: string) => {
    store.dispatch(unlistDapp({ id: origin }));
  }

  const registerListeningSite = (origin: string, eventName: string) => {
    store.dispatch(registerListeningSiteAction({ origin, eventName }));
  }

  const deregisterListeningSite = (origin: string, eventName: string) => {
    store.dispatch(deregisterListeningSiteAction({ origin, eventName }));
  }

  const isSiteListening = (origin: string, eventName: string) => {
    const dapp: IDAppState = store.getState().dapp;

    return dapp.listening[origin] && dapp.listening[origin].includes(eventName);
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
    fromUseDisconnectDApp,
    registerListeningSite,
    deregisterListeningSite,
    isSiteListening,
    isDAppConnected
  };
};

export default DAppController;
