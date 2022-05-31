
///////////////////////////
// Screens
///////////////////////////

import screens from './screens';

///////////////////////////
// Routes
///////////////////////////

export default {
  //Common
  [screens.common.import]: '/import',
  // UnAuth Stack
  [screens.unAuthorized.root]: '/unAuthRoot',
  [screens.unAuthorized.home]: '/homeUnauth',
  [screens.unAuthorized.remind]: '/remind',
  [screens.unAuthorized.createPass]: '/create/pass',
  [screens.unAuthorized.createPhraseGenerated]: '/create/phrase/generated',
  [screens.unAuthorized.createPhraseRemind]: '/create/phrase/remind',
  [screens.unAuthorized.createPhraseCheck]: '/create/phrase/check',
  // Auth Stack
  [screens.authorized.root]: '/authRoot',
  [screens.authorized.home]: '/home',
  [screens.authorized.buyList]: '/buyList',
  [screens.authorized.buyAsset]: '/buyAsset',
  [screens.authorized.addAsset]: '/asset/add',
  [screens.authorized.asset]: '/asset',
  [screens.authorized.sendConfirm]: '/send/confirm',
  [screens.authorized.send]: '/send/:address?',
  [screens.authorized.gasSettings]: '/gas-settings',
  // Settings Stack
  [screens.settings.main]: '/settings',
  [screens.settings.about]: '/settings/about',
  [screens.settings.networks]: '/settings/networks',
  [screens.settings.contacts]: '/settings/contacts',
  [screens.settings.modifyContact]: '/setting/contacts/modify',
  [screens.settings.contactInfo]: '/settings/contacts/info',
  [screens.settings.wallets]: '/settings/wallets',
  [screens.settings.addWallet]: '/settings/wallets/add',
  [screens.settings.createWallet]: '/settings/wallets/create',
  [screens.settings.walletPhrase]: '/settings/wallets/phrase',
  [screens.settings.manageWallet]: '/settings/wallets/manage',
  [screens.settings.removeWallet]: '/settings/wallets/remove',
  [screens.settings.privateKey]: '/settings/wallets/privateKey',
  [screens.settings.importWallet]: '/settings/wallets/import',
  [screens.settings.importAccount]: '/settings/wallets/import/account',
  [screens.settings.importPhrase]: '/settings/wallets/import/phrase',
  [screens.settings.connectedSites]: '/settings/connectedSites',

};
