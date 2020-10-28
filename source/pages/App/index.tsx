import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Store, applyMiddleware } from 'webext-redux';
import thunkMiddleware from 'redux-thunk';

import App from './App';

const app = document.getElementById('app-root');
const middleware = [thunkMiddleware];
const store = new Store({ portName: 'STARGARZER' });
applyMiddleware(store, ...middleware);

store.ready().then(() => {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    app
  );
});
