import { reload } from 'utils/browser';
import { AssetType } from 'state/vault/types';
import { DAG_NETWORK, ETH_NETWORK } from 'constants/index';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';
import { KeyringWalletState } from '../helpers/keystoreToKeyringHelper';
import { saveState } from 'state/localStorage';

export type V1WalletState = {
  wallet: KeyringWalletState;
  price: { fiat: { 'constellation-labs': number } };
  contacts: {
    [id: string]: { id: string; name: string; address: string; memo: string };
  };
  dapp: {};
};

const MigrateRunner = async (oldState: V1WalletState) => {
  try {
    console.log('You are using old version lower than v2');

    // if (!oldState) {
    //   console.log('🔺', '<v2.1> Migration Error');
    //   console.log('Error: Can\'t find state on localstorage');
    //   return;
    // }

    const vault: any = {
      status: 0,
      wallets: {
        local: [],
        ledger: [],
        bitfi: [],
      },
      hasEncryptedVault: false,
      balances: {
        [AssetType.Constellation]: '0',
        [AssetType.Ethereum]: '0',
      },
      activeWallet: undefined,
      activeAsset: undefined,
      activeNetwork: {
        [KeyringNetwork.Constellation]: DAG_NETWORK.main.id,
        [KeyringNetwork.Ethereum]: ETH_NETWORK.mainnet.id,
      },
      version: '2.1',
    };

    const newState = {
      vault,
      contacts: oldState.contacts,
    };

    // update wallet state
    const walletUpdater = () => {
      const { keystores, accounts, seedKeystoreId } = oldState.wallet;

      // const keyStore = V3Keystore.decryptPhrase(keystores[seedKeystoreId], password);
      const accountList = Object.values(accounts);

      vault.migrateWallet = {
        keystores,
        seedKeystoreId,
        accounts: {} as any,
      };

      for (let i = 0; i < accountList.length; i++) {
        const { id, label, address, type } = accountList[i];

        vault.migrateWallet.accounts[id] = { id, label, address, type };
      }
    };

    // update contacts state
    const contactsUpdater = () => {
      newState.contacts = oldState.contacts;
    };

    walletUpdater();
    contactsUpdater();

    await saveState(newState);
    console.log('Migrate to <v2.1> successfully!');
    reload();
  } catch (error) {
    console.log('<v2.1> Migration Error');
    console.log(error);
  }
};

export default MigrateRunner;
