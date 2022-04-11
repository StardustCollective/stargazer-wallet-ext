/**
 * @format
 */

import './shim';
import "@ethersproject/shims"
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: process.env.SENTRY_DNS,
  tracesSampleRate: __DEV__ ? 1 : 0.2,
  debug: __DEV__ ? true : false,
  environment: __DEV__ ? 'development' : 'production'
});

AppRegistry.registerComponent(appName, () => Sentry.wrap(App));
