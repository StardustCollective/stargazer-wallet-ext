///////////////////////////
// Screens
///////////////////////////

import screens from './screens';

///////////////////////////
// Linking Configs
///////////////////////////

const config = {
    screens: {
      //Common
      [screens.common.import]: '/import',
      // UnAuth Stack
      [screens.unAuthorized.home]: 'app.html',
      [screens.unAuthorized.remind]: '/remind',
      [screens.unAuthorized.createPass]: '/create/pass',
      [screens.unAuthorized.createPhraseGenerated]: '/create/phrase/generated',
      [screens.unAuthorized.createPhraseRemind]: '/create/phrase/remind',
      [screens.unAuthorized.createPhraseCheck]: '/create/phrase/check',
      // Auth Stack
      [screens.authorized.home]: '/home',
      [screens.authorized.addAsset]: '/asset/add',
      [screens.authorized.asset]: '/asset',
      [screens.authorized.sendConfirm]: '/send/confirm',
      [screens.authorized.send]: '/send/:address?',
      [screens.authorized.gasSettings]: '/gas-settings',
    },
  };
  
const linking = {
    prefixes: ['https://', 'http://'],
    config,
};

export default linking;