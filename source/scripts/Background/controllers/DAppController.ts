import { listNewDapp } from 'state/dapp';
import { IDAppInfo, IDAppState } from 'state/dapp/types';
import store from 'state/store';
import { browser } from 'webextension-polyfill-ts';

export interface IDAppController {
  getCurrent: () => IDAppInfo;
  connectDApp: (origin: string, dapp: IDAppInfo) => void;
  fetchInfo: (origin: string, upToDate?: boolean) => IDAppInfo | undefined;
  setSigRequest: (req: ISigRequest) => void;
  getSigRequest: () => ISigRequest;
}

interface ISigRequest {
  address: string;
  message: string;
  origin: string;
}

const DAppController = (): IDAppController => {
  let current: IDAppInfo;
  let request: ISigRequest;

  const fetchInfo = (origin: string, upToDate = false) => {
    const dapp: IDAppState = store.getState().dapp;
    if (upToDate) {
      browser.tabs.query({ active: true }).then((tabs) => {
        current = {
          uri: tabs[0].url,
          logo: `chrome://favicon/size/64@1x/${tabs[0].url}`,
          title: tabs[0].title,
        };
      });
    }

    return dapp[origin];
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

  const connectDApp = (origin: string, dapp: IDAppInfo) => {
    store.dispatch(listNewDapp({ id: origin, dapp }));
  };

  return { getCurrent, fetchInfo, connectDApp, setSigRequest, getSigRequest };
};

export default DAppController;
