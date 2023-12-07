import { reload } from 'utils/browser';
import IAssetListState from 'state/assets/types';
import IContactBookState from 'state/contacts/types';
import IPriceState from 'state/price/types';
import { AssetType } from 'state/vault/types';
import { INFTListState } from 'state/nfts/types';
import { DAG_NETWORK, ETH_NETWORK } from 'constants/index';
import { KeyringNetwork, KeyringWalletState } from '@stardust-collective/dag4-keyring';
import { saveState } from 'state/localStorage';

type V2WalletState = {
  assets: IAssetListState;
  contacts: IContactBookState;
  dapp: {};
  nfts: INFTListState;
  price: IPriceState;
  vault: {
    wallets: KeyringWalletState[];
  };
};

type V3_5_0WalletState = {
  assets: IAssetListState;
  nfts: INFTListState;
  contacts: IContactBookState;
  dapp: {};
  price: IPriceState;
  vault: any;
};

const MigrateRunner = async (oldState: V2WalletState) => {
  try {
    const newState: V3_5_0WalletState = {
      ...oldState,
      vault: {
        ...oldState.vault,
        // Wallets shape changed
        wallets: {
          local: oldState.vault.wallets,
          ledger: [],
          bitfi: [],
        },
        // No change to all other properties.
        status: 0,
        activeWallet: undefined,
        activeAsset: undefined,
        hasEncryptedVault: false,
        activeNetwork: {
          [KeyringNetwork.Constellation]: DAG_NETWORK.main.id,
          [KeyringNetwork.Ethereum]: ETH_NETWORK.mainnet.id,
        },
        balances: {
          [AssetType.Constellation]: '0',
          [AssetType.Ethereum]: '0',
        },
        version: '3.5.0',
      },
    };
    await saveState(newState);
    console.log('Migrate to <v3.5.0> successfully!');
    reload();
  } catch (error) {
    console.log('<v3.5.0> Migration Error');
    console.log(error);
  }
};

export default MigrateRunner;
