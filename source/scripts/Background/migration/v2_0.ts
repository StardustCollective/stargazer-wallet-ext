import { browser } from 'webextension-polyfill-ts';
import IAssetListState from 'state/assets/types';
import ERC20_TOKENS_LIST from 'state/assets/tokens';
import IContactBookState from 'state/contacts/types';
import IPriceState from 'state/price/types';
import IWalletState, { AssetType } from 'state/wallet/types';
import { DAG_NETWORK, ETH_NETWORK, LATTICE_ASSET } from 'constants/index';

interface INewState {
  wallet: IWalletState;
  price: IPriceState;
  contacts: IContactBookState;
  assets: IAssetListState;
}

const MigrateRunner = () => {
  try {
    console.emoji('ℹ️', 'You are using old version lower than v2');

    const localState = localStorage.getItem('state');
    if (!localState) {
      console.emoji('🔺', '<v2.0> Migration Error');
      console.log("Error: Can't find state on localstorage");
      return;
    }

    const oldState = JSON.parse(localState);
    const newState: INewState = {
      wallet: {
        keystores: {},
        status: 0,
        version: '2.0.0',
        accounts: {},
        activeAccountId: '0',
        seedKeystoreId: '',
        activeNetwork: {
          [AssetType.Constellation]: DAG_NETWORK.main.id,
          [AssetType.Ethereum]: ETH_NETWORK.mainnet.id,
        },
      },
      price: {
        fiat: {},
        currency: {
          id: 'usd',
          symbol: '$',
          name: 'USD',
        },
      },
      contacts: {},
      assets: {},
    };

    // update wallet state
    const walletUpdater = () => {
      const {
        keystores,
        status,
        accounts,
        activeAccountId,
        seedKeystoreId,
        activeNetwork,
      } = oldState.wallet;

      newState.wallet = {
        ...newState.wallet,
        keystores,
        status,
        accounts: {},
        activeAccountId,
        seedKeystoreId,
        activeNetwork: {
          ...newState.wallet.activeNetwork,
          [AssetType.Constellation]: activeNetwork,
        },
      };

      for (let i = 0; i < Object.values(accounts).length; i += 1) {
        const {
          id,
          label,
          address,
          balance,
          transactions,
          type,
        } = Object.values(accounts)[i] as any;

        newState.wallet.accounts[id] = {
          id,
          label,
          type,
          assets: {
            [AssetType.Constellation]: {
              id: AssetType.Constellation,
              balance,
              address: address[AssetType.Constellation],
              transactions,
            },
            [AssetType.Ethereum]: {
              id: AssetType.Ethereum,
              balance: 0,
              address: '',
              transactions: [],
            },
            [LATTICE_ASSET]: {
              id: LATTICE_ASSET,
              balance: 0,
              address: '',
              transactions: [],
            },
          },
          activeAssetId: AssetType.Constellation,
        };
      }
    };

    // update contacts state
    const contactsUpdater = () => {
      newState.contacts = oldState.contacts;
    };

    // add assets state
    const assetsUpdater = () => {
      newState.assets = {
        [AssetType.Constellation]: {
          id: AssetType.Constellation,
          name: 'Constellation',
          type: AssetType.Constellation,
          symbol: 'DAG',
          native: true,
          network: 'both',
          logo:
            'https://assets.coingecko.com/coins/images/4645/small/Constellation.jpg?1613976385',
          priceId: 'constellation-labs',
          decimals: 8,
        },
        [AssetType.Ethereum]: {
          id: AssetType.Ethereum,
          name: 'Ethereum',
          type: AssetType.Ethereum,
          symbol: 'ETH',
          native: true,
          network: 'both',
          logo:
            'https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880',
          priceId: 'ethereum',
          decimals: 18,
        },
        ...ERC20_TOKENS_LIST,
      };
    };

    walletUpdater();
    contactsUpdater();
    assetsUpdater();

    localStorage.setItem('state', JSON.stringify(newState));
    console.emoji('✅', 'Migrate to <v2.0> successfully!');
    browser.runtime.reload();
  } catch (error) {
    console.emoji('🔺', '<v2.0> Migration Error');
    console.log(error);
  }
};

export default MigrateRunner;
