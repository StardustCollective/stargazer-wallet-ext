import { scrypt } from 'react-native-fast-crypto';


global.process = require('process/browser.js');
global.localStorage = require('@react-native-async-storage/async-storage').default;
global.crypto = require('react-native-crypto');
global.location = undefined;
global.scrypt = scrypt;
// Reference: https://github.com/vaxxnz/nzcp-js/issues/2#issuecomment-972808289
if (typeof BigInt === 'undefined') {
    const bi = require('big-integer');
  
    function myBigInt(value: any) {
        if (typeof value === 'string') {
            const match = value.match(/^0([xo])([0-9a-f]+)$/i)
            if (match) {
                return bi(match[2], match[1].toLowerCase() === 'x' ? 16 : 8)
            }
        }
        return bi(value)
    }
  
    global.BigInt = myBigInt
  }