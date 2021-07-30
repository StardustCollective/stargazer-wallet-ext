import { browser } from 'webextension-polyfill-ts';
import IVaultState, { AssetType } from 'state/vault/types';
import { DAG_NETWORK, ETH_NETWORK } from 'constants/index';
import { KeyringNetwork } from '@stardust-collective/dag4-keyring';
import { KeyringWalletState } from '../helpers/keystoreToKeyringHelper';

export type V1WalletState = {
  'wallet': KeyringWalletState,
  'price': { 'fiat': { 'constellation-labs': number } },
  'contacts': {
    [id: string]: { 'id': string, 'name': string, 'address': string, 'memo': string }
  },
  'dapp': {}
}

const MigrateRunner = () => {
  try {
    console.emoji('ℹ️', 'You are using old version lower than v2');

    const localState = localStorage.getItem('state');
    if (!localState) {
      console.emoji('🔺', '<v2.1> Migration Error');
      console.log('Error: Can\'t find state on localstorage');
      return;
    }

    const oldState: V1WalletState = JSON.parse(localState);
    const vault: IVaultState = {
      status: 0,
      wallets: [],
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
      version: '2.1.1',
    };

    const newState = {
      vault,
      migrateWallet: {} as any,
      contacts: oldState.contacts
    };


    // update wallet state
    const walletUpdater = () => {
      const { keystores, accounts, seedKeystoreId } = oldState.wallet;

      // const keyStore = V3Keystore.decryptPhrase(keystores[seedKeystoreId], password);
      const accountList = Object.values(accounts);

      newState.migrateWallet = {
        keystores,
        seedKeystoreId,
        accounts: {} as any
      }

      for (let i = 0; i < accountList.length; i++) {
        const { id, label, address, type } = accountList[i];

        newState.migrateWallet.accounts[id] = { id, label, address, type };
      }

      //
      //       newState.wallet.accounts[id] = {
      //         id,
      //         label,
      //         type,
      //         assets: {
      //           [AssetType.Constellation]: {
      //             type: AssetType.Constellation,
      //             balance,
      //             address: address[AssetType.Constellation],
      //             transactions,
      //           },
      //           [AssetType.Ethereum]: {
      //             type: AssetType.Ethereum,
      //             balance: 0,
      //             address: '',
      //             transactions: [],
      //           },
      //           [LATTICE_ASSET]: {
      //             type: AssetType.ERC20,
      //             contract: LATTICE_ASSET,
      //             balance: 0,
      //             address: '',
      //             transactions: [],
      //           },
      //         },
      //         //activeAssetId: AssetType.Constellation,
      //       };
      //     }
    };

    // update contacts state
    const contactsUpdater = () => {
      newState.contacts = oldState.contacts;
    };

    walletUpdater();
    contactsUpdater();

    localStorage.setItem('state', JSON.stringify(newState));
    console.emoji('✅', 'Migrate to <v2.1> successfully!');
    browser.runtime.reload();
  } catch (error) {
    console.emoji('🔺', '<v2.1> Migration Error');
    console.log(error);
  }
};

export default MigrateRunner;
