import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { transitions, positions, Provider as AlertProvider } from 'react-alert';
import ToastAlert from 'components/ToastAlert';
import store from 'state/store';
import scryptJS from 'scrypt-js';
import App from './App';
import rehydrateStore from 'state/rehydrate';
import { BrowserRouter } from 'react-router-dom';
import { handleDag4Setup } from 'scripts/Background/handlers/handleDag4Setup';
import { handleStoreSubscribe } from 'scripts/Background/handlers/handleStoreSubscribe';
import { handleRehydrateStore } from 'scripts/Background/handlers/handleRehydrateStore';
import { addBeforeUnloadListener } from '../../utils/windowListeners';

global.scrypt = scryptJS.scrypt;

const app = document.getElementById('external-root');

const options = {
  // you can also just use 'bottom center'
  position: positions.BOTTOM_CENTER,
  timeout: 20 * 1000,
  offset: '30px',
  // you can also just use 'scale'
  transition: transitions.FADE,
};

addBeforeUnloadListener();
handleRehydrateStore();

rehydrateStore(store).then(() => {
  // Initialize dag4
  handleDag4Setup(store);

  // Render External App
  ReactDOM.render(
    (
      <Provider store={store}>
        <AlertProvider template={ToastAlert} {...options}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AlertProvider>
      </Provider>
    ) as any,
    app
  );

  // Subscribe store to updates and notify
  handleStoreSubscribe(store);
});
