/**
 * Polyfills and shims for React Native environment
 * This file sets up global objects needed for crypto operations
 */
import {install} from 'react-native-quick-crypto';
import {Buffer} from '@craftzdog/react-native-buffer';

// Ensure Buffer is available globally before installing quick-crypto
// This is required as quick-crypto depends on Buffer being available
if (!global.Buffer) {
  // @ts-expect-error - Buffer types don't match exactly but work in practice
  global.Buffer = Buffer;
}

// Install react-native-quick-crypto polyfills
// This sets up global.crypto with JSI-backed implementations
install();

// Set up process polyfill for Node.js compatibility
global.process = require('process/browser.js');

// Set up localStorage using AsyncStorage
// @ts-expect-error - AsyncStorage doesn't perfectly match localStorage interface but works for our use case
global.localStorage =
  require('@react-native-async-storage/async-storage').default;

// Disable location and BigInt for compatibility
// @ts-expect-error - Intentionally setting to undefined for React Native compatibility
global.location = undefined;
// @ts-expect-error - Intentionally disabling BigInt for compatibility with older devices
global.BigInt = undefined;
