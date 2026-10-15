/**
 * @format
 */

import './shim';
import 'fast-text-encoding';
import '@ethersproject/shims';
import {AppRegistry, Text, TextInput} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import * as Sentry from '@sentry/react-native';
import {SENTRY_DNS} from '@env';

// Keep app logs out of device logs in release builds
if (!__DEV__) {
  console.log = () => {};
  console.info = () => {};
  console.debug = () => {};
  console.warn = () => {};
}

// 64-char hex strings (private keys) and runs of 12+ lowercase words (seed phrases)
const SENSITIVE_PATTERN =
  /\b(?:0x)?[0-9a-fA-F]{64}\b|\b(?:[a-z]{3,8}\s+){11,23}[a-z]{3,8}\b/g;
const scrub = value =>
  typeof value === 'string' ? value.replace(SENSITIVE_PATTERN, '[Filtered]') : value;

Text.defaultProps = {};
Text.defaultProps.maxFontSizeMultiplier = 1.2;

TextInput.defaultProps = {};
TextInput.defaultProps.maxFontSizeMultiplier = 1.2;

Sentry.init({
  dsn: SENTRY_DNS,
  environment: __DEV__ ? 'development' : 'production',
  enableNative: __DEV__ ? false : true,
  beforeBreadcrumb: breadcrumb => {
    // Console breadcrumbs can carry anything the app logged
    if (breadcrumb.category === 'console') {
      return null;
    }
    breadcrumb.message = scrub(breadcrumb.message);
    return breadcrumb;
  },
  beforeSend: event => {
    event.message = scrub(event.message);
    event.exception?.values?.forEach(exception => {
      exception.value = scrub(exception.value);
    });
    return event;
  },
});

AppRegistry.registerComponent(appName, () => Sentry.wrap(App));
