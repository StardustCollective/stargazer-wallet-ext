import { browser } from 'webextension-polyfill-ts';
import IAssetListState from 'state/assets/types';
import IContactBookState from 'state/contacts/types';
import IPriceState from 'state/price/types';
import IWalletState, { AccountType, AssetType } from 'state/wallet/types';

interface INewState {
  wallet: IWalletState;
  price: IPriceState;
  contacts: IContactBookState;
  assets: IAssetListState;
}

const MigrateRunner = () => {
  try {
    console.emoji('ℹ️', 'You are using old version - v2.0');

    const localState = localStorage.getItem('state');
    if (!localState) {
      console.emoji('🔺', '<v2.1> Migration Error');
      console.log("Error: Can't find state on localstorage");
      return;
    }

    const oldState = JSON.parse(localState);
    const newState: INewState = oldState;

    // update wallet state
    const walletUpdater = () => {
      const { accounts } = oldState.wallet;

      for (let i = 0; i < Object.values(accounts).length; i += 1) {
        const { id, label, assets, type } = Object.values(accounts)[i] as any;

        if (type === AccountType.Seed) {
          newState.wallet.accounts[id] = Object.values(accounts)[i] as any;
        } else {
          newState.wallet.accounts[id] = {
            id,
            label,
            activeAssetId: AssetType.Constellation,
            assets: {
              [AssetType.Constellation]: {
                ...assets[AssetType.Constellation],
              },
            },
            type: AccountType.PrivKey,
          };
        }
      }

      newState.wallet.version = '2.1.0';
    };

    walletUpdater();

    localStorage.setItem('state', JSON.stringify(newState));
    console.emoji('✅', 'Migrate to <v2.1> successfully!');
    browser.runtime.reload();
  } catch (error) {
    console.emoji('🔺', '<v2.1> Migration Error');
    console.log(error);
  }
};

export default MigrateRunner;
