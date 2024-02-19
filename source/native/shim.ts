import {scrypt} from 'react-native-fast-crypto';

global.process = require('process/browser.js');
global.localStorage =
  require('@react-native-async-storage/async-storage').default;
global.crypto = require('react-native-crypto');
global.location = undefined;
global.BigInt = undefined;
global.scrypt = scrypt;
