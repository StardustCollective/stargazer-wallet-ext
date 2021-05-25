import { listNewDapp } from 'state/dapp';
import { IDAppInfo, IDAppState } from 'state/dapp/types';
import store from 'state/store';


export interface IDAppController {
  getCurrent: () => IDAppInfo;
  fromUserConnectDApp: (origin: string, dapp: IDAppInfo) => void;
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

  const fromUserConnectDApp = (origin: string, dapp: IDAppInfo) => {
    store.dispatch(listNewDapp({ id: origin, dapp }));
  };

  const getCurrent = () => {
    return current;
  };

  const setSigRequest = (req: ISigRequest) => {
    request = req;
  };

  const getSigRequest = () => {
    return request;
  };


  return { getCurrent, fromPageConnectDApp, fromUserConnectDApp, setSigRequest, getSigRequest };
};

export default DAppController;
