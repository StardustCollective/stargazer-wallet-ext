import { listNewDapp } from 'state/dapp';
import { IDAppInfo, IDAppState } from 'state/dapp/types';
import store from 'state/store';
import { browser } from 'webextension-polyfill-ts';

export interface IDAppController {
  getCurrent: () => IDAppInfo;
  connectDApp: (origin: string, dapp: IDAppInfo) => void;
  fetchInfo: (origin: string, upToDate?: boolean) => IDAppInfo | undefined;
}

const DAppController = (): IDAppController => {
  let current: IDAppInfo;

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

  const connectDApp = (origin: string, dapp: IDAppInfo) => {
    store.dispatch(listNewDapp({ id: origin, dapp }));
  };

  return { getCurrent, fetchInfo, connectDApp };
};

export default DAppController;
