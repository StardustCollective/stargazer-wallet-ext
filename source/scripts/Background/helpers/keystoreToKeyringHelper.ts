import { dag4 } from '@stardust-collective/dag4';
import { Transaction } from '@stardust-collective/dag4-network';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';
import { KDFParamsPhrase, KDFParamsPrivateKey, V3Keystore } from '@stardust-collective/dag4-keystore';

export class KeystoreToKeyringHelper {

  static async migrate (migrateWallet: KeyringWalletState, password: string) {

    const { keystores, accounts, seedKeystoreId } = migrateWallet;

    const seedPhrase = await V3Keystore.decryptPhrase(keystores[seedKeystoreId] as V3Keystore<KDFParamsPhrase>, password);
    const seedAccount = accounts[seedKeystoreId];
    const rootKey = dag4.keyStore.getMasterKeyFromMnemonic(seedPhrase);

    await window.controller.wallet.createWallet(seedAccount.label, seedPhrase, true);

    delete accounts[seedKeystoreId];

    const accountList = Object.values(accounts);

    for (let i = 0; i < accountList.length; i++) {
      const { id, label, address, type } = accountList[i];

      if (type === 0) {
        const index = Number(id);

        if (isNaN(index)) {
          console.log('ERROR - Unable to migrate seed account - ', id, label, address);
        }
        else {
          try {
            const pKey = dag4.keyStore.deriveAccountFromMaster(rootKey, index);

            await window.controller.wallet.importSingleAccount(label, KeyringNetwork.Constellation, pKey, true);
          }
          catch(e) {
            console.log('ERROR - Unable to migrate seed account - ', id, label, address, e.toString());
          }
        }
      }
      else {
        const keyStorePrivateKey = keystores[id] as V3Keystore<KDFParamsPrivateKey>;

        if (!keyStorePrivateKey) {
          console.log('ERROR - Unable to migrate import account - ', id, label, address);
        }
        else {

          try {
            const pKey = await dag4.keyStore.decryptPrivateKey(keyStorePrivateKey, password);

            await window.controller.wallet.importSingleAccount(label, KeyringNetwork.Constellation, pKey, true);
          }
          catch(e) {
            console.log('ERROR - Unable to migrate import account - ', id, label, address, e.toString());
          }
        }
      }

    }
  }
}

export type KeyringWalletState = {
  'keystores': {
    [id: string]: V3Keystore<KDFParamsPrivateKey|KDFParamsPhrase>,
  },
  'status': number,
  'accounts': {
    [id: string]: {
      'id': string, //Seed Index or Keystore Id
      'label': string,
      'address': { 'constellation': string },
      'balance': number,
      'transactions': Transaction[],
      'type': 0 | 1
    }
  },
  'activeAccountId': string,
  'seedKeystoreId': string,
  'activeNetwork': 'main'
}