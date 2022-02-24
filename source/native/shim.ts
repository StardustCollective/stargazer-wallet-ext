export default async () => {
  global.process = require('process/browser.js');

  console.log('REQUIRING ISOMORPHIC WEBCRYPTO ------- >>>>>');
  // Important: do not set this to global.crypto until ensureSecure has been called
  const crypto = require('isomorphic-webcrypto');
  await crypto.ensureSecure();
  
  global.crypto = crypto;
  
  console.log('AFTER REQUIRE ISOMORPHIC WEBCRYPTO ------- >>>>>');

  global.localStorage =
    require('@react-native-async-storage/async-storage').default;

  const emptyFunc = () => {};

  global.window = global.window || {};
  global.window.addEventListener = global.window.addEventListener || emptyFunc;
  global.document = global.document || {};
  global.document.addEventListener = global.document.addEventListener || emptyFunc;
  global.document.body = global.document.body || {};
  global.document.body.addEventListener = global.document.body.addEventListener || emptyFunc;
  global.HTMLElement = {
    prototype: {
      focus: () => {}
    }
  };
  global.Node = {
    ELEMENT_NODE: 1,
    DOCUMENT_NODE: 9
  };
};
