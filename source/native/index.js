/**
 * @format
 */

import './shim';
import "@ethersproject/shims"
import { AppRegistry , Text, TextInput} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import * as Sentry from "@sentry/react-native";

Text.defaultProps = {};
Text.defaultProps.maxFontSizeMultiplier = 1.2;

TextInput.defaultProps = {};
TextInput.defaultProps.maxFontSizeMultiplier = 1.2;

Sentry.init({
  dsn: process.env.SENTRY_DNS,
  debug: __DEV__ ? true : false,
  environment: __DEV__ ? 'development' : 'production'
});

AppRegistry.registerComponent(appName, () => Sentry.wrap(App));
