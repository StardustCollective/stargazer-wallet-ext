///////////////////////////
// Screens
///////////////////////////

import screens from './screens';

///////////////////////////
// Linking Configs
///////////////////////////

const config = {
    screens: {
      [screens.unAuthorized.home]: 'app.html',
      [screens.unAuthorized.remind]: '/remind',
      [screens.common.import]: '/import',
      [screens.unAuthorized.createPass]: '/create/pass',
      [screens.unAuthorized.createPhraseGenerated]: '/create/phrase/generated',
      [screens.unAuthorized.createPhraseRemind]: '/create/phrase/remind',
      [screens.unAuthorized.createPhraseCheck]: '/create/phrase/check'
    },
  };
  
const linking = {
    prefixes: ['https://', 'http://'],
    config,
};

export default linking;