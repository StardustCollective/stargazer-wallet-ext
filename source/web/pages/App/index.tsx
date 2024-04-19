import React from 'react';
import ReactDOM from 'react-dom';
import { dag4 } from '@stardust-collective/dag4';
import { Provider } from 'react-redux';
import { transitions, positions, Provider as AlertProvider } from 'react-alert';
import ToastAlert from 'components/ToastAlert';
import store, { updateState } from 'state/store';
import scryptJS from 'scrypt-js';
import App from './App';
import localStorage from 'utils/localStorage';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';
import { DAG_NETWORK } from 'constants/index';
import rehydrateStore from 'state/rehydrate';
import throttle from 'lodash/throttle';

global.scrypt = scryptJS.scrypt;

const app = document.getElementById('app-root');

if (
  !process.env.ETHERSCAN_API_KEY ||
  !process.env.POLYGONSCAN_API_KEY ||
  !process.env.BSCSCAN_API_KEY ||
  !process.env.SNOWTRACE_API_KEY ||
  !process.env.TEST_PRIVATE_KEY
) {
  throw 'Missing .env file or missing definition';
}

const options = {
  // you can also just use 'bottom center'
  position: positions.BOTTOM_CENTER,
  timeout: 20 * 1000,
  offset: '30px',
  // you can also just use 'scale'
  transition: transitions.FADE,
};

rehydrateStore(store).then(() => {
  // Get network info from store
  const state = store.getState();
  const vault = state.vault;
  const networkId =
    vault && vault.activeNetwork && vault.activeNetwork[KeyringNetwork.Constellation];
  const networkInfo = (networkId && DAG_NETWORK[networkId]) || DAG_NETWORK.main2;

  // Setup dag4.js
  dag4.di.getStateStorageDb().setPrefix('stargazer-');
  dag4.di.useLocalStorageClient(localStorage);
  dag4.account.connect(
    {
      id: networkInfo.id,
      networkVersion: networkInfo.version,
      ...networkInfo.config,
    },
    false
  );

  // Render App
  ReactDOM.render(
    (
      <Provider store={store}>
        <AlertProvider template={ToastAlert} {...options}>
          <App />
        </AlertProvider>
      </Provider>
    ) as any,
    app
  );

  // Subscribe store to updates
  store.subscribe(
    throttle(() => {
      // every second we update store state
      updateState();
    }, 1000)
  );
});
