import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { transitions, positions, Provider as AlertProvider } from 'react-alert';
import ToastAlert from 'components/ToastAlert';
import store from 'state/store';
import scryptJS from 'scrypt-js';
import LedgerPage from './Ledger';
import rehydrateStore from 'state/rehydrate';
import { handleDag4Setup } from 'scripts/Background/handlers/handleDag4Setup';
import { handleStoreSubscribe } from 'scripts/Background/handlers/handleStoreSubscribe';
import { handleRehydrateStore } from 'scripts/Background/handlers/handleRehydrateStore';

global.scrypt = scryptJS.scrypt;

const app = document.getElementById('ledger-root');

const options = {
  // you can also just use 'bottom center'
  position: positions.BOTTOM_CENTER,
  timeout: 20 * 1000,
  offset: '30px',
  // you can also just use 'scale'
  transition: transitions.FADE,
};

handleRehydrateStore();

rehydrateStore(store).then(() => {
  // Initialize dag4
  handleDag4Setup(store);

  // Render Ledger App
  ReactDOM.render(
    (
      <Provider store={store}>
        <AlertProvider template={ToastAlert} {...options}>
          <LedgerPage />
        </AlertProvider>
      </Provider>
    ) as any,
    app
  );

  // Subscribe store to updates and notify
  handleStoreSubscribe(store);
});
