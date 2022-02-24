import shim from './shim';
import '@ethersproject/shims';
import {AppRegistry} from 'react-native';

shim().then(() => {
  const App = require('./App').default;

  const AppConfig = require('./app.json');

  AppRegistry.registerComponent(AppConfig.name, () => App);
});
