import { dag4 } from '@stardust-collective/dag4';
import { Transaction } from '@stardust-collective/dag4-network';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';
import {
  KDFParamsPhrase,
  KDFParamsPrivateKey,
  V3Keystore,
} from '@stardust-collective/dag4-keystore';
import store from '../../../state/store';
import { migrateWalletComplete } from '../../../state/vault';
import { getWalletController } from 'utils/controllersUtils';

export class KeystoreToKeyringHelper {
  static async migrate(migrateWallet: KeyringWalletState, password: string) {
    const { keystores, accounts, seedKeystoreId } = migrateWallet;

    const seedPhrase = await V3Keystore.decryptPhrase(
      keystores[seedKeystoreId] as V3Keystore<KDFParamsPhrase>,
      password
    );
    const rootKey = dag4.keyStore.getMasterKeyFromMnemonic(seedPhrase);
    const seedAccount = accounts['0'];

    const walletController = getWalletController();
    await walletController.createWallet(seedAccount.label, seedPhrase, true);

    const accountList = Object.values(accounts);

    for (let i = 0; i < accountList.length; i++) {
      const { id, label, address, type } = accountList[i];

      if (type === 0) {
        const index = Number(id);

        if (isNaN(index)) {
          console.log('ERROR - Unable to migrate seed account - ', id, label, address);
        }
        //Skip the first account as it will already be available in multi-asset
        else if (index > 0) {
          try {
            const pKey = dag4.keyStore.deriveAccountFromMaster(rootKey, index);

            await walletController.importSingleAccount(
              label,
              KeyringNetwork.Constellation,
              pKey,
              true
            );
            console.log(pKey);
          } catch (e) {
            console.log(
              'ERROR - Unable to migrate seed account - ',
              id,
              label,
              address,
              e.toString()
            );
          }
        }
      } else {
        const keyStorePrivateKey = keystores[id] as V3Keystore<KDFParamsPrivateKey>;

        if (!keyStorePrivateKey) {
          console.log('ERROR - Unable to migrate import account - ', id, label, address);
        } else {
          try {
            const pKey = await dag4.keyStore.decryptPrivateKey(
              keyStorePrivateKey,
              password
            );

            await walletController.importSingleAccount(
              label,
              KeyringNetwork.Constellation,
              pKey,
              true
            );
            console.log(pKey);
          } catch (e) {
            console.log(
              'ERROR - Unable to migrate import account - ',
              id,
              label,
              address,
              e.toString()
            );
          }
        }
      }
    }

    store.dispatch(migrateWalletComplete());
  }
}

export type KeyringWalletState = {
  keystores: {
    [id: string]: V3Keystore<KDFParamsPrivateKey | KDFParamsPhrase>;
  };
  status: number;
  accounts: {
    [id: string]: {
      id: string; //Seed Index or Keystore Id
      label: string;
      address: { constellation: string };
      balance: number;
      transactions: Transaction[];
      type: 0 | 1;
    };
  };
  activeAccountId: string;
  seedKeystoreId: string;
  activeNetwork: 'main';
};
