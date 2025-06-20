declare module '@ledgerhq/hw-transport-webhid';

declare module 'react-native-fast-crypto' {
  export = import('crypto');
}

declare const STARGAZER_WALLET_VERSION: string;
declare module 'scrypt-js' {
  export = import('scrypt-js');
}

declare module 'single-call-balance-checker-abi';

declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}
