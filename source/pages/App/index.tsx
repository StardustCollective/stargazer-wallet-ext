import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Store, applyMiddleware } from 'webext-redux';
import createSagaMiddleware from 'redux-saga';

import App from './App';

const app = document.getElementById('app-root');
const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware];
const store = new Store({ portName: 'Stargazer' });
applyMiddleware(store, ...middleware);

store.ready().then(() => {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    app
  );
});
