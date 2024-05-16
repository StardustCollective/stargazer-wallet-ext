import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { transitions, positions, Provider as AlertProvider } from 'react-alert';
import ToastAlert from 'components/ToastAlert';
import store from 'state/store';
import BitfiPage from './Bitfi';
import rehydrateStore from 'state/rehydrate';
import { handleDag4Setup } from 'scripts/Background/handlers/handleDag4Setup';
import { handleStoreSubscribe } from 'scripts/Background/handlers/handleStoreSubscribe';
import { handleRehydrateStore } from 'scripts/Background/handlers/handleRehydrateStore';

const app = document.getElementById('bitfi-root');

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

  // Render Bitfi App
  ReactDOM.render(
    (
      <Provider store={store}>
        <AlertProvider template={ToastAlert} {...options}>
          <BitfiPage />
        </AlertProvider>
      </Provider>
    ) as any,
    app
  );

  // Subscribe store to updates and notify
  handleStoreSubscribe(store);
});
